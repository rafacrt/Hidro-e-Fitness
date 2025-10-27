#!/usr/bin/env node

/**
 * Script para migrar URLs antigos do Supabase Storage para URLs locais
 * 
 * Converte:
 * - https://supabase.app.rajo.com.br/storage/v1/object/public/avatars/[user-id]-[timestamp].jpg
 *   para: /storage/avatars/[user-id]/[filename].jpg
 * 
 * - https://supabase.app.rajo.com.br/storage/v1/object/public/logos/logo-[timestamp].png
 *   para: /storage/logos/[user-id]/logo-[timestamp].png
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const FILES_TO_MIGRATE = [
  'sql/public_profiles_import.sql',
  'sql/public_users_import.sql', 
  'sql/public_profiles_data.sql',
  'public/supabase-db-pwokkg4kcw8k4k4sksskosgc_postgres_public_data.sql'
];

const SUPABASE_STORAGE_PATTERN = /https:\/\/supabase\.app\.rajo\.com\.br\/storage\/v1\/object\/public\/(avatars|logos)\/(.+)/g;

function migrateUrl(match, type, filename) {
  if (type === 'avatars') {
    // Extrair user-id do filename (formato: user-id-timestamp.ext)
    const parts = filename.split('-');
    if (parts.length >= 2) {
      const userId = parts.slice(0, -1).join('-'); // Tudo exceto o último part (timestamp)
      const extension = filename.split('.').pop();
      return `/storage/avatars/${userId}/${filename}`;
    }
  } else if (type === 'logos') {
    // Para logos, usar um diretório padrão (pode ser admin ou sistema)
    // Como não temos user-id específico para logos, usar 'system'
    return `/storage/logos/system/${filename}`;
  }
  
  return match; // Retorna original se não conseguir processar
}

async function migrateFile(filePath) {
  try {
    console.log(`Migrando arquivo: ${filePath}`);
    
    const content = await readFile(filePath, 'utf-8');
    let migratedContent = content;
    let changeCount = 0;
    
    migratedContent = migratedContent.replace(SUPABASE_STORAGE_PATTERN, (match, type, filename) => {
      changeCount++;
      const newUrl = migrateUrl(match, type, filename);
      console.log(`  ${match} -> ${newUrl}`);
      return newUrl;
    });
    
    if (changeCount > 0) {
      await writeFile(filePath, migratedContent, 'utf-8');
      console.log(`  ✅ ${changeCount} URLs migrados em ${filePath}`);
    } else {
      console.log(`  ℹ️  Nenhum URL encontrado em ${filePath}`);
    }
    
    return changeCount;
  } catch (error) {
    console.error(`❌ Erro ao migrar ${filePath}:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Iniciando migração de URLs do Supabase Storage para URLs locais...\n');
  
  let totalChanges = 0;
  
  for (const file of FILES_TO_MIGRATE) {
    const changes = await migrateFile(file);
    totalChanges += changes;
  }
  
  console.log(`\n✅ Migração concluída! Total de URLs migrados: ${totalChanges}`);
  
  if (totalChanges > 0) {
    console.log('\n📝 Próximos passos:');
    console.log('1. Revisar as mudanças nos arquivos SQL');
    console.log('2. Executar os scripts de importação se necessário');
    console.log('3. Fazer commit das mudanças');
  }
}

main().catch(console.error);