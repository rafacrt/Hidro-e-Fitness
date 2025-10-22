#!/usr/bin/env node
// ETL script: Import Supabase public data SQL dump into local hidrofitness schema
// - Reads public/supabase-db-*_postgres_public_data.sql
// - Parses INSERTs for supported tables
// - Generates UUIDs via Postgres defaults and captures RETURNING id to build ID maps
// - Maps columns from old schema to new schema and inserts with parameterized queries
//
// Supported tables: students, instructors, modalities, classes, enrollments, plans, student_plans, payments
// Notes:
// - Skips profiles/users from Supabase dump (auth-managed). Local users/profiles are handled separately.
// - Ignores columns not present in local schema (e.g., status on instructors, monthly_fee on classes, type/status on modalities, etc.)
// - Derives payments.type from description/amount; sets paid_at from payment_date; due_date preserved.

import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';

function log(msg, obj) { console.log(msg + (obj !== undefined ? `: ${JSON.stringify(obj)}` : '')); }
function warn(msg) { console.warn(`[WARN] ${msg}`); }
function error(msg, e) { console.error(`[ERROR] ${msg}`); if (e) console.error(e); }

// --- Helpers ---
function findDumpFile() {
  const pubDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(pubDir)) throw new Error(`Public directory not found at ${pubDir}`);
  const files = fs.readdirSync(pubDir);
  const match = files.find(f => f.includes('postgres_public_data.sql'));
  if (!match) throw new Error('Could not find a Supabase public data SQL dump ("*_postgres_public_data.sql") in /public');
  return path.join(pubDir, match);
}

function readDump(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Normalize whitespace a bit to simplify parsing
  return content.replace(/\r\n/g, '\n');
}

// Tokenize a VALUES(...) list into an array of value literals, splitting on commas only at top-level
// Handles single-quoted strings and Postgres array literals {...}
function tokenizeValues(valuesStr) {
  const out = [];
  let buf = '';
  let inQuote = false;
  let escapeNext = false;
  let braceDepth = 0; // for {...} arrays
  for (let i = 0; i < valuesStr.length; i++) {
    const ch = valuesStr[i];
    if (escapeNext) { buf += ch; escapeNext = false; continue; }
    if (ch === "\\") {
      // Keep escape, but note next char is escaped inside quotes
      if (inQuote) { buf += ch; escapeNext = true; continue; }
    }
    if (ch === "'") { inQuote = !inQuote; buf += ch; continue; }
    if (!inQuote) {
      if (ch === '{') { braceDepth++; buf += ch; continue; }
      if (ch === '}') { braceDepth = Math.max(0, braceDepth - 1); buf += ch; continue; }
      if (ch === ',' && braceDepth === 0) { out.push(buf.trim()); buf = ''; continue; }
    }
    buf += ch;
  }
  if (buf.trim().length > 0) out.push(buf.trim());
  return out;
}

// Remove surrounding single quotes and unescape
function unquote(str) {
  if (str === null || str === undefined) return null;
  const s = str.trim();
  if (s.toUpperCase() === 'NULL') return null;
  if (s.startsWith("'") && s.endsWith("'")) {
    // Replace doubled single quotes '' with '
    return s.slice(1, -1).replace(/''/g, "'");
  }
  return s;
}

function parseArrayLiteral(lit) {
  if (!lit) return null;
  const s = lit.trim();
  if (s.toUpperCase() === 'NULL') return null;
  if (!s.startsWith('{') || !s.endsWith('}')) return null;
  const inner = s.slice(1, -1);
  if (inner.length === 0) return [];
  // Split by commas not handling quotes inside; Supabase exported arrays appear as plain text items (no embedded commas)
  // Trim and unquote possible quoted items
  return tokenizeValues(inner).map(v => {
    const t = v.trim();
    const uq = unquote(t);
    return uq;
  });
}

function toNumber(str) {
  if (str === null) return null;
  const s = typeof str === 'string' ? str.trim() : String(str);
  if (s.toUpperCase() === 'NULL' || s === '') return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

function toBool(str) {
  if (str === null) return null;
  const s = typeof str === 'string' ? str.trim().toLowerCase() : String(str).toLowerCase();
  if (s === 'null' || s === '') return null;
  if (s === 't' || s === 'true') return true;
  if (s === 'f' || s === 'false') return false;
  return null;
}

function toDate(str) {
  const s = unquote(str);
  if (!s) return null;
  // Accept YYYY-MM-DD
  return s;
}

function toTimestamptz(str) {
  const s = unquote(str);
  if (!s) return null;
  return s; // Let Postgres cast
}

// Extract INSERT statements for a given table and return array of {columns:[], values:[]}
function extractInsertsForTable(sql, tableName) {
  const results = [];
  const re = new RegExp(`INSERT INTO\\s+public\\.${tableName}\\s*\\(([^)]*)\\)\\s*VALUES\\s*\\(([^)]*)\\)`, 'gi');
  let m;
  while ((m = re.exec(sql)) !== null) {
    const cols = m[1].split(',').map(c => c.trim());
    const valuesRaw = m[2].trim();
    const vals = tokenizeValues(valuesRaw);
    results.push({ columns: cols, values: vals });
  }
  return results;
}

// --- DB ---
function getDbConfig() {
  const {
    DB_HOST = 'db',
    DB_PORT = '5432',
    DB_USER = 'postgres',
    DB_PASSWORD = 'postgres',
    DB_NAME = 'hidrofitness',
  } = process.env;
  return { host: DB_HOST, port: Number(DB_PORT), user: DB_USER, password: DB_PASSWORD, database: DB_NAME };
}

// Parse CLI args for selective execution
const onlyArg = process.argv.find(a => a.startsWith('--only='));
const ONLY = new Set((onlyArg ? onlyArg.split('=')[1] : '').split(',').filter(Boolean));
function shouldRun(section) { return ONLY.size === 0 || ONLY.has(section); }

async function main() {
  const dumpPath = findDumpFile();
  log('Using dump file', dumpPath);
  const sql = readDump(dumpPath);

  // Build modality oldId->name map upfront for fallback
  const modalityDumpMap = new Map();
  for (const row of extractInsertsForTable(sql, 'modalities')) {
    const v = row.values;
    const oldId = toNumber(v[0]);
    const name = unquote(v[2]);
    if (oldId && name) modalityDumpMap.set(oldId, name);
  }
  // Build student oldId->name/email map
  const studentDumpMap = new Map();
  for (const row of extractInsertsForTable(sql, 'students')) {
    const v = row.values;
    const oldId = toNumber(v[0]);
    const name = unquote(v[2]);
    const email = unquote(v[5]);
    if (oldId) studentDumpMap.set(oldId, { name, email });
  }
  // Build plan oldId->name map
  const planDumpMap = new Map();
  for (const row of extractInsertsForTable(sql, 'plans')) {
    const v = row.values;
    const oldId = toNumber(v[0]);
    const name = unquote(v[2]);
    if (oldId && name) planDumpMap.set(oldId, name);
  }

  const client = new Client(getDbConfig());
  await client.connect();

  async function getModalityIdByOldId(oldId) {
    if (!oldId) return null;
    // First try mapped
    const mapped = idMaps.modalities.get(oldId);
    if (mapped) return mapped;
    // Fallback: look up by name
    const name = modalityDumpMap.get(oldId);
    if (!name) return null;
    const res = await client.query('SELECT id FROM public.modalities WHERE name = $1 LIMIT 1', [name]);
    return res.rows[0]?.id || null;
  }

  async function getStudentIdByOldId(oldId) {
    if (!oldId) return null;
    const mapped = idMaps.students.get(oldId);
    if (mapped) return mapped;
    const info = studentDumpMap.get(oldId);
    if (!info) return null;
    let res;
    if (info.email) {
      res = await client.query('SELECT id FROM public.students WHERE email = $1 LIMIT 1', [info.email]);
      if (res.rows[0]?.id) return res.rows[0].id;
    }
    if (info.name) {
      res = await client.query('SELECT id FROM public.students WHERE name = $1 LIMIT 1', [info.name]);
      if (res.rows[0]?.id) return res.rows[0].id;
    }
    return null;
  }

  async function getPlanIdByOldId(oldId) {
    if (!oldId) return null;
    const mapped = idMaps.plans.get(oldId);
    if (mapped) return mapped;
    const name = planDumpMap.get(oldId);
    if (!name) return null;
    const res = await client.query('SELECT id FROM public.plans WHERE name = $1 LIMIT 1', [name]);
    return res.rows[0]?.id || null;
  }

  const idMaps = {
    students: new Map(),
    instructors: new Map(),
    modalities: new Map(),
    classes: new Map(),
    plans: new Map(),
    enrollments: new Map(),
  };

  const stats = { inserted: {}, errors: {} };
  function incStat(name, type='inserted') { stats[type][name] = (stats[type][name] || 0) + 1; }

  // --- Students ---
  if (shouldRun('students')) {
    const rows = extractInsertsForTable(sql, 'students');
    for (const row of rows) {
      try {
        const v = row.values;
        // Expected order in dump:
        // id, created_at, name, cpf, birth_date, email, phone, is_whatsapp, cep, street, number, complement, neighborhood, city, state, responsible_name, responsible_phone, medical_observations, status
        const oldId = toNumber(v[0]);
        const created_at = toTimestamptz(v[1]);
        const name = unquote(v[2]);
        const cpf = unquote(v[3]);
        const birth_date = toDate(v[4]);
        const email = unquote(v[5]);
        const phone = unquote(v[6]);
        const is_whatsapp = toBool(v[7]);
        const cep = unquote(v[8]);
        const street = unquote(v[9]);
        const number = unquote(v[10]);
        const complement = unquote(v[11]);
        const neighborhood = unquote(v[12]);
        const city = unquote(v[13]);
        const state = unquote(v[14]);
        const responsible_name = unquote(v[15]);
        const responsible_phone = unquote(v[16]);
        const medical_observations = unquote(v[17]);
        const status = unquote(v[18]);

        const res = await client.query(
          `INSERT INTO public.students 
           (name, cpf, birth_date, email, phone, is_whatsapp, cep, street, "number", complement, neighborhood, city, state, responsible_name, responsible_phone, medical_observations, status, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
           RETURNING id`,
          [name, cpf, birth_date, email, phone, is_whatsapp, cep, street, number, complement, neighborhood, city, state, responsible_name, responsible_phone, medical_observations, status, created_at]
        );
        const newId = res.rows[0].id;
        idMaps.students.set(oldId, newId);
        incStat('students');
      } catch (e) {
        incStat('students', 'errors');
        error('Insert student failed', e);
      }
    }
    log('Students processed', { inserted: stats.inserted.students || 0, errors: stats.errors.students || 0 });
  }

  // --- Instructors ---
  if (shouldRun('instructors')) {
    const rows = extractInsertsForTable(sql, 'instructors');
    for (const row of rows) {
      try {
        const v = row.values;
        // id, created_at, name, email, phone, specialties, availability, status
        const oldId = toNumber(v[0]);
        const created_at = toTimestamptz(v[1]);
        const name = unquote(v[2]);
        const email = unquote(v[3]);
        const phone = unquote(v[4]);
        const specialtiesLit = v[5];
        const availabilityLit = v[6];
        // Map specialties (array literal) to jsonb array of strings
        const specialtiesArr = parseArrayLiteral(specialtiesLit) || [];
        const availabilityArr = parseArrayLiteral(availabilityLit) || [];

        const res = await client.query(
          `INSERT INTO public.instructors (name, email, phone, specialties, availability, created_at)
           VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6)
           RETURNING id`,
          [name, email, phone, JSON.stringify(specialtiesArr), JSON.stringify(availabilityArr), created_at]
        );
        const newId = res.rows[0].id;
        idMaps.instructors.set(oldId, newId);
        incStat('instructors');
      } catch (e) {
        incStat('instructors', 'errors');
        error('Insert instructor failed', e);
      }
    }
    log('Instructors processed', { inserted: stats.inserted.instructors || 0, errors: stats.errors.instructors || 0 });
  }

  // --- Modalities ---
  if (shouldRun('modalities')) {
    const rows = extractInsertsForTable(sql, 'modalities');
    for (const row of rows) {
      try {
        const v = row.values;
        // id, created_at, name, description, type, status
        const oldId = toNumber(v[0]);
        const created_at = toTimestamptz(v[1]);
        const name = unquote(v[2]);
        const description = unquote(v[3]);
        // Local schema has price (nullable) and no type/status
        const res = await client.query(
          `INSERT INTO public.modalities (name, description, price, created_at)
           VALUES ($1,$2,$3,$4)
           RETURNING id`,
          [name, description, null, created_at]
        );
        const newId = res.rows[0].id;
        idMaps.modalities.set(oldId, newId);
        incStat('modalities');
      } catch (e) {
        incStat('modalities', 'errors');
        error('Insert modality failed', e);
      }
    }
    log('Modalities processed', { inserted: stats.inserted.modalities || 0, errors: stats.errors.modalities || 0 });
  }

  // --- Classes ---
  if (shouldRun('classes')) {
    const rows = extractInsertsForTable(sql, 'classes');
    for (const row of rows) {
      try {
        const v = row.values;
        // id, created_at, name, modality_id, instructor_id, start_time, end_time, days_of_week, location, max_students, monthly_fee, status
        const oldId = toNumber(v[0]);
        const created_at = toTimestamptz(v[1]);
        const name = unquote(v[2]);
        const modality_old = toNumber(v[3]);
        const instructor_old = toNumber(v[4]);
        const start_time = unquote(v[5]);
        const end_time = unquote(v[6]);
        const daysArr = parseArrayLiteral(v[7]) || [];
        const location = unquote(v[8]);
        const max_students = toNumber(v[9]);
        const status = unquote(v[11]);
        const modality_id = modality_old ? idMaps.modalities.get(modality_old) : null;
        const instructor_id = instructor_old ? idMaps.instructors.get(instructor_old) : null;

        const res = await client.query(
          `INSERT INTO public.classes (name, modality_id, instructor_id, start_time, end_time, days_of_week, location, max_students, status, created_at)
           VALUES ($1,$2,$3,$4::time,$5::time,$6,$7,$8,$9,$10)
           RETURNING id`,
          [name, modality_id || null, instructor_id || null, start_time, end_time, daysArr, location, max_students, status, created_at]
        );
        const newId = res.rows[0].id;
        idMaps.classes.set(oldId, newId);
        incStat('classes');
      } catch (e) {
        incStat('classes', 'errors');
        error('Insert class failed', e);
      }
    }
    log('Classes processed', { inserted: stats.inserted.classes || 0, errors: stats.errors.classes || 0 });
  }

  // --- Enrollments ---
  if (shouldRun('enrollments')) {
    const rows = extractInsertsForTable(sql, 'enrollments');
    for (const row of rows) {
      try {
        const v = row.values;
        // id, created_at, student_id, class_id, enrollment_date, status
        const oldId = toNumber(v[0]);
        const created_at = toTimestamptz(v[1]); // local schema does not have created_at; ignored
        const student_old = toNumber(v[2]);
        const class_old = toNumber(v[3]);
        const enrollment_date = toDate(v[4]);
        const student_id = student_old ? idMaps.students.get(student_old) : null;
        const class_id = class_old ? idMaps.classes.get(class_old) : null;
        if (!student_id || !class_id) {
          incStat('enrollments', 'errors');
          warn(`Skipping enrollment: missing student/class mapping (old student ${student_old}, old class ${class_old})`);
          continue;
        }
        await client.query(
          `INSERT INTO public.enrollments (student_id, class_id, enrollment_date)
           VALUES ($1,$2,$3)`,
          [student_id, class_id, enrollment_date]
        );
        idMaps.enrollments.set(oldId, { student_id, class_id });
        incStat('enrollments');
      } catch (e) {
        incStat('enrollments', 'errors');
        error('Insert enrollment failed', e);
      }
    }
    log('Enrollments processed', { inserted: stats.inserted.enrollments || 0, errors: stats.errors.enrollments || 0 });
  }

  // --- Plans ---
  if (shouldRun('plans')) {
    const rows = extractInsertsForTable(sql, 'plans');
    for (const row of rows) {
      try {
        const v = row.values;
        // id, created_at, name, modality_id, price, recurrence, benefits, status
        const oldId = toNumber(v[0]);
        const created_at = toTimestamptz(v[1]);
        const name = unquote(v[2]);
        const modality_old = toNumber(v[3]);
        const priceRaw = toNumber(v[4]);
        const price = (priceRaw === null || priceRaw === undefined) ? 0 : priceRaw;
        const recurrenceRaw = unquote(v[5]);
        const recurrence = recurrenceRaw || 'mensal';
        const benefitsArr = parseArrayLiteral(v[6]) || [];
        const status = unquote(v[7]); // local defaults to 'ativo'; we can keep provided
        const modality_id = await getModalityIdByOldId(modality_old);

        const res = await client.query(
          `INSERT INTO public.plans (name, modality_id, price, recurrence, benefits, status, created_at)
           VALUES ($1,$2,$3,$4,$5::text[],$6,$7)
           RETURNING id`,
          [name, modality_id || null, price, recurrence, benefitsArr, status || 'ativo', created_at]
        );
        const newId = res.rows[0].id;
        idMaps.plans.set(oldId, newId);
        incStat('plans');
      } catch (e) {
        incStat('plans', 'errors');
        error('Insert plan failed', e);
      }
    }
    log('Plans processed', { inserted: stats.inserted.plans || 0, errors: stats.errors.plans || 0 });
  }

  // --- Student Plans ---
  if (shouldRun('student_plans')) {
    const rows = extractInsertsForTable(sql, 'student_plans');
    for (const row of rows) {
      try {
        const v = row.values;
        // id, student_id, plan_id, start_date, end_date, created_at
        const student_old = toNumber(v[1]);
        const plan_old = toNumber(v[2]);
        const start_date = toDate(v[3]);
        const end_date = toDate(v[4]);
        const created_at = toTimestamptz(v[5]);
        const student_id = await getStudentIdByOldId(student_old);
        const plan_id = await getPlanIdByOldId(plan_old);
        if (!student_id || !plan_id) {
          incStat('student_plans', 'errors');
          warn(`Skipping student_plan: missing student/plan mapping (old student ${student_old}, old plan ${plan_old})`);
          continue;
        }
        await client.query(
          `INSERT INTO public.student_plans (student_id, plan_id, start_date, end_date, created_at)
           VALUES ($1,$2,$3,$4,$5) ON CONFLICT (student_id, plan_id) DO NOTHING`,
          [student_id, plan_id, start_date, end_date, created_at]
        );
        incStat('student_plans');
      } catch (e) {
        incStat('student_plans', 'errors');
        error('Insert student_plan failed', e);
      }
    }
    log('Student plans processed', { inserted: stats.inserted.student_plans || 0, errors: stats.errors.student_plans || 0 });
  }

  // --- Payments ---
  if (shouldRun('payments')) {
    const rows = extractInsertsForTable(sql, 'payments');
    for (const row of rows) {
      try {
        const v = row.values;
        // Dump order: id, created_at, student_id, enrollment_id, amount, payment_date, due_date, payment_method, status, description
        const created_at = toTimestamptz(v[1]);
        const student_old = toNumber(v[2]);
        const enrollment_old = toNumber(v[3]);
        const amount = toNumber(v[4]);
        const payment_date = toDate(v[5]);
        const due_date = toDate(v[6]);
        const payment_method = unquote(v[7]);
        const status = unquote(v[8]);
        const description = unquote(v[9]);
        const student_id = student_old ? idMaps.students.get(student_old) : null;
        const enrollment_ref = enrollment_old ? idMaps.enrollments.get(enrollment_old) : null;
        const enrollment_id = null; // local payments has enrollment_id uuid, but our enrollments mapping stores composite; we don't have old enrollment uuid; keep null
        // Derive type/category
        let type = 'income';
        if (description && description.toLowerCase().includes('mensalidade')) type = 'tuition';
        else if (amount !== null && amount < 0) type = 'expense';
        let category = null;
        if (description) {
          if (description.toLowerCase().includes('contas')) category = 'Contas';
          else if (description.toLowerCase().includes('salário') || description.toLowerCase().includes('salario')) category = 'Salário';
          else if (description.toLowerCase().includes('compra') || description.toLowerCase().includes('equip')) category = 'Compra';
        }
        const paid_at = payment_date ? `${payment_date} 00:00:00+00` : null;

        await client.query(
          `INSERT INTO public.payments (student_id, enrollment_id, description, amount, type, due_date, paid_at, category, payment_method, status, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [student_id || null, enrollment_id, description || (type === 'income' ? 'Recebimento' : 'Pagamento'), amount || 0, type, due_date, paid_at, category, payment_method, status || (amount < 0 ? 'pago' : 'pendente'), created_at]
        );
        incStat('payments');
      } catch (e) {
        incStat('payments', 'errors');
        error('Insert payment failed', e);
      }
    }
    log('Payments processed', { inserted: stats.inserted.payments || 0, errors: stats.errors.payments || 0 });
  }

  // Summary
  console.log('--- ETL Summary ---');
  console.table(stats.inserted);
  console.table(stats.errors);

  await client.end();
}

main().catch(e => { error('ETL script crashed', e); process.exit(1); });