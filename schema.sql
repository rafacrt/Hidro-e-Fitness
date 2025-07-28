-- Active: 1722120023021@@127.0.0.1@3306@hidro
CREATE DATABASE IF NOT EXISTS `hidro`;

USE `hidro`;

-- Tabela de Usuários do Sistema
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('Desenvolvedor', 'Administrador', 'Recepção') NOT NULL,
    `avatar_url` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS `students` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(14) UNIQUE,
    `birth_date` DATE NOT NULL,
    `email` VARCHAR(255) UNIQUE,
    `phone` VARCHAR(20),
    `is_whatsapp` BOOLEAN DEFAULT TRUE,
    `cep` VARCHAR(9),
    `street` VARCHAR(255),
    `number` VARCHAR(20),
    `complement` VARCHAR(100),
    `neighborhood` VARCHAR(100),
    `city` VARCHAR(100),
    `state` VARCHAR(50),
    `responsible_name` VARCHAR(255),
    `responsible_phone` VARCHAR(20),
    `medical_observations` TEXT,
    `status` ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS `instructors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(20),
    `avatar_url` VARCHAR(255),
    `status` ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de Modalidades
CREATE TABLE IF NOT EXISTS `modalities` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT,
    `type` ENUM('Aquática', 'Coletiva', 'Individual') NOT NULL,
    `status` ENUM('Ativa', 'Inativa') DEFAULT 'Ativa'
) ENGINE=InnoDB;

-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS `classes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `modality_id` INT,
    `instructor_id` INT,
    `location` VARCHAR(100),
    `max_students` INT NOT NULL,
    `status` ENUM('Ativa', 'Inativa', 'Lotada') DEFAULT 'Ativa',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`modality_id`) REFERENCES `modalities`(`id`),
    FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`)
) ENGINE=InnoDB;

-- Tabela de Horários das Turmas (relação N:N entre turmas e dias/horários)
CREATE TABLE IF NOT EXISTS `class_schedules` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT,
    `day_of_week` ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo') NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela de Matrículas (relação N:N entre alunos e turmas)
CREATE TABLE IF NOT EXISTS `enrollments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT,
    `class_id` INT,
    `enrollment_date` DATE NOT NULL,
    `status` ENUM('Ativa', 'Cancelada', 'Pendente') DEFAULT 'Ativa',
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`),
    FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`)
) ENGINE=InnoDB;

-- Tabela de Planos e Preços
CREATE TABLE IF NOT EXISTS `plans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `modality_id` INT,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `period` ENUM('Mensal', 'Trimestral', 'Semestral', 'Anual') NOT NULL,
    `description` TEXT,
    `status` ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    FOREIGN KEY (`modality_id`) REFERENCES `modalities`(`id`)
) ENGINE=InnoDB;

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS `payments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT,
    `plan_id` INT,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_date` DATE,
    `due_date` DATE NOT NULL,
    `payment_method` ENUM('PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto'),
    `status` ENUM('Pago', 'Pendente', 'Vencido', 'Estornado') NOT NULL,
    `description` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`),
    FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`)
) ENGINE=InnoDB;

-- Tabela de Frequência
CREATE TABLE IF NOT EXISTS `attendance` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT,
    `class_schedule_id` INT,
    `class_date` DATE NOT NULL,
    `status` ENUM('Presente', 'Ausente', 'Justificado') NOT NULL,
    `check_in_time` TIME,
    `observations` TEXT,
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`),
    FOREIGN KEY (`class_schedule_id`) REFERENCES `class_schedules`(`id`)
) ENGINE=InnoDB;

-- Tabela de Equipamentos para Manutenção
CREATE TABLE IF NOT EXISTS `equipment` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100),
    `location` VARCHAR(100),
    `brand` VARCHAR(100),
    `model` VARCHAR(100),
    `serial_number` VARCHAR(100) UNIQUE,
    `installation_date` DATE,
    `status` ENUM('Operacional', 'Manutenção', 'Quebrado') NOT NULL,
    `last_maintenance_date` DATE,
    `next_maintenance_date` DATE
) ENGINE=InnoDB;

-- Tabela de Agendamentos de Manutenção
CREATE TABLE IF NOT EXISTS `maintenance_schedules` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `equipment_id` INT,
    `type` ENUM('Preventiva', 'Corretiva', 'Emergencial') NOT NULL,
    `description` TEXT NOT NULL,
    `scheduled_date` DATETIME NOT NULL,
    `responsible` VARCHAR(255),
    `cost` DECIMAL(10, 2),
    `status` ENUM('Agendada', 'Em Andamento', 'Concluída', 'Cancelada') NOT NULL,
    `completion_date` DATETIME,
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`)
) ENGINE=InnoDB;

-- Tabela de Produtos Químicos
CREATE TABLE IF NOT EXISTS `chemical_products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `unit` VARCHAR(20),
    `current_stock` DECIMAL(10, 2) NOT NULL,
    `min_stock` DECIMAL(10, 2),
    `max_stock` DECIMAL(10, 2)
) ENGINE=InnoDB;


-- Inserções Iniciais para popular o banco de dados
-- Verifique se os usuários já existem antes de inserir
INSERT INTO `users` (`name`, `email`, `password`, `role`)
SELECT 'Desenvolvedor', 'dev@hidrofitness.com', 'senha_super_segura', 'Desenvolvedor'
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `email` = 'dev@hidrofitness.com');

INSERT INTO `users` (`name`, `email`, `password`, `role`)
SELECT 'Admin Sistema', 'admin@hidrofitness.com', 'admin123', 'Administrador'
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `email` = 'admin@hidrofitness.com');

INSERT INTO `users` (`name`, `email`, `password`, `role`)
SELECT 'Ana Silva', 'ana.silva@email.com', 'recepcao123', 'Recepção'
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `email` = 'ana.silva@email.com');

-- Inserir Modalidades (Apenas se não existirem)
INSERT INTO `modalities` (`name`, `description`, `type`)
SELECT 'Natação Adulto', 'Aulas de natação para adultos.', 'Aquática'
WHERE NOT EXISTS (SELECT 1 FROM `modalities` WHERE `name` = 'Natação Adulto');

INSERT INTO `modalities` (`name`, `description`, `type`)
SELECT 'Hidroginástica', 'Exercícios na água.', 'Aquática'
WHERE NOT EXISTS (SELECT 1 FROM `modalities` WHERE `name` = 'Hidroginástica');

INSERT INTO `modalities` (`name`, `description`, `type`)
SELECT 'Natação Infantil', 'Aulas para crianças.', 'Aquática'
WHERE NOT EXISTS (SELECT 1 FROM `modalities` WHERE `name` = 'Natação Infantil');

-- Inserir Professores (Apenas se não existirem)
INSERT INTO `instructors` (`name`, `email`, `phone`)
SELECT 'Prof. Ana Silva', 'prof.ana@email.com', '(11) 99999-8888'
WHERE NOT EXISTS (SELECT 1 FROM `instructors` WHERE `email` = 'prof.ana@email.com');

INSERT INTO `instructors` (`name`, `email`, `phone`)
SELECT 'Prof. Carlos Santos', 'prof.carlos@email.com', '(11) 88888-7777'
WHERE NOT EXISTS (SELECT 1 FROM `instructors` WHERE `email` = 'prof.carlos@email.com');
