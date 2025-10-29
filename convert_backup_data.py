#!/usr/bin/env python3
"""
Script para converter dados de backup da pasta sql/Nova pasta
para o formato correto das tabelas atuais do db/init-prod
"""

import re
import os

def convert_students():
    """Converte students_rows.sql para o formato correto"""
    print("Convertendo students...")

    with open('sql/Nova pasta/students_rows.sql', 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern: captura cada campo como 'valor' ou null
    # field = aceita tanto 'texto' quanto null (sem aspas)
    field = r"(?:'([^']*)'|null)"
    # Campos: id, created_at, name, cpf, birth_date, email, phone, is_whatsapp, cep, street, number, complement, neighborhood, city, state, responsible_name, responsible_phone, medical_obs, status
    # Podem ser null: cpf, birth_date, email, street, number, complement, responsible_name, responsible_phone, medical_obs
    pattern = rf"\('(\d+)',\s*'([^']+)',\s*'([^']*)',\s*{field},\s*{field},\s*{field},\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*{field},\s*{field},\s*{field},\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*{field},\s*{field},\s*{field},\s*'([^']*)'\)"

    matches = re.findall(pattern, content)

    print(f"Encontrados {len(matches)} alunos")

    # Criar novo INSERT com formato correto (mantendo schema antigo com campos separados)
    output = 'INSERT INTO "public"."students" ("id", "name", "cpf", "birth_date", "email", "phone", "cep", "street", "number", "complement", "neighborhood", "city", "state", "responsible_name", "responsible_phone", "medical_observations", "status", "created_at") VALUES\n'

    values = []
    for match in matches:
        # Extrair campos - alguns vêm de grupos de regex que aceitam null
        # match = (id, created_at, name, cpf, birth_date, email, phone, is_whatsapp, cep, street, number, complement, neighborhood, city, state, responsible_name, responsible_phone, medical_obs, status)
        id_val, created_at, name, cpf, birth_date, email, phone, is_whatsapp, cep, street, number, complement, neighborhood, city, state, responsible_name, responsible_phone, medical_obs, status = match

        # Escape aspas simples
        name = name.replace("'", "''")
        street_safe = street.replace("'", "''") if street else ''
        complement_safe = complement.replace("'", "''") if complement else ''
        responsible_name_safe = responsible_name.replace("'", "''") if responsible_name else ''

        # Tratar valores vazios/null
        cpf_value = f"'{cpf}'" if cpf else 'null'
        birth_value = f"'{birth_date}'" if birth_date else 'null'
        email_value = f"'{email}'" if email else 'null'
        street_value = f"'{street_safe}'" if street else 'null'
        number_value = f"'{number}'" if number else 'null'
        complement_value = f"'{complement_safe}'" if complement else 'null'
        responsible_name_value = f"'{responsible_name_safe}'" if responsible_name else 'null'
        responsible_phone_value = f"'{responsible_phone}'" if responsible_phone else 'null'
        medical_obs_value = f"'{medical_obs}'" if medical_obs else 'null'

        value = f"('{id_val}', '{name}', {cpf_value}, {birth_value}, {email_value}, '{phone}', '{cep}', {street_value}, {number_value}, {complement_value}, '{neighborhood}', '{city}', '{state}', {responsible_name_value}, {responsible_phone_value}, {medical_obs_value}, '{status}', '{created_at}')"
        values.append(value)

    output += ',\n'.join(values)
    output += '\nON CONFLICT (id) DO NOTHING;'

    # Salvar
    with open('db/init-prod/03_students_data.sql', 'w', encoding='utf-8') as f:
        f.write(output)

    print(f"OK {len(values)} alunos convertidos -> db/init-prod/03_students_data.sql")

def convert_plans():
    """Converte plans_rows.sql"""
    print("Convertendo plans...")

    with open('sql/Nova pasta/plans_rows.sql', 'r', encoding='utf-8') as f:
        content = f.read()

    # Corrigir JSON inválido no campo benefits: '"{]}' -> '[]'
    # O pattern real no arquivo é '"{]}' (aspas duplas dentro de simples)
    content = content.replace('''"{]}''', "[]")

    # Adiciona ON CONFLICT
    if 'ON CONFLICT' not in content:
        content = content.rstrip().rstrip(';') + '\nON CONFLICT (id) DO NOTHING;'

    with open('db/init-prod/04_plans_data.sql', 'w', encoding='utf-8') as f:
        f.write(content)

    print("OK Plans convertidos -> db/init-prod/04_plans_data.sql")

def convert_student_plans():
    """Converte student_plans_rows.sql"""
    print("Convertendo student_plans...")

    with open('sql/Nova pasta/student_plans_rows.sql', 'r', encoding='utf-8') as f:
        content = f.read()

    # Apenas adiciona ON CONFLICT
    if 'ON CONFLICT' not in content:
        content = content.rstrip().rstrip(';') + '\nON CONFLICT (id) DO NOTHING;'

    with open('db/init-prod/05_student_plans_data.sql', 'w', encoding='utf-8') as f:
        f.write(content)

    print("OK Student plans convertidos -> db/init-prod/05_student_plans_data.sql")

def convert_payments():
    """Converte payments_rows.sql - remove colunas que não existem no schema"""
    print("Convertendo payments...")

    with open('sql/Nova pasta/payments_rows.sql', 'r', encoding='utf-8') as f:
        content = f.read()

    # Schema atual: id, student_id, amount, payment_date, payment_method, status, created_at
    # Schema backup: id, created_at, student_id, enrollment_id, amount, payment_date, due_date, payment_method, status, description
    # Precisamos remover: enrollment_id, due_date, description

    # Extrair valores com regex
    field = r"(?:'([^']*)'|null)"
    pattern = rf"\('(\d+)',\s*'([^']+)',\s*{field},\s*{field},\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\)"

    matches = re.findall(pattern, content)

    # Criar novo INSERT
    output = 'INSERT INTO "public"."payments" ("id", "student_id", "amount", "payment_date", "payment_method", "status", "created_at") VALUES\n'

    values = []
    for match in matches:
        # match = (id, created_at, student_id, enrollment_id, amount, payment_date, due_date, payment_method, status, description)
        id_val, created_at, student_id, enrollment_id, amount, payment_date, due_date, payment_method, status, description = match

        student_id_val = f"'{student_id}'" if student_id else 'null'

        value = f"('{id_val}', {student_id_val}, '{amount}', '{payment_date}', '{payment_method}', '{status}', '{created_at}')"
        values.append(value)

    output += ',\n'.join(values)
    output += '\nON CONFLICT (id) DO NOTHING;'

    with open('db/init-prod/06_payments_data.sql', 'w', encoding='utf-8') as f:
        f.write(output)

    print(f"OK {len(values)} payments convertidos -> db/init-prod/06_payments_data.sql")

if __name__ == '__main__':
    print("Iniciando conversao de dados de backup...")
    print()

    try:
        convert_students()
        convert_plans()
        convert_student_plans()
        convert_payments()

        print()
        print("CONVERSAO CONCLUIDA!")
        print()
        print("Arquivos gerados em db/init-prod/:")
        print("  - 03_students_data.sql (169 alunos)")
        print("  - 04_plans_data.sql (69 planos)")
        print("  - 05_student_plans_data.sql")
        print("  - 06_payments_data.sql")
        print()
        print("Agora rode: docker-compose down -v && docker-compose up")

    except Exception as e:
        print(f"ERRO: {e}")
        import traceback
        traceback.print_exc()
