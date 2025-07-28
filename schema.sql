-- Hidro Fitness - Sistema de Gestão para Academias
-- Esquema do Banco de Dados para MariaDB

-- Tabela para armazenar as configurações da academia
CREATE TABLE `academies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `logo_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de usuários do sistema (login)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('developer', 'admin', 'reception') NOT NULL,
  `avatar_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de alunos
CREATE TABLE `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `cpf` VARCHAR(14) UNIQUE,
  `birth_date` DATE,
  `email` VARCHAR(255),
  `phone` VARCHAR(20),
  `is_whatsapp` BOOLEAN DEFAULT FALSE,
  `cep` VARCHAR(9),
  `street` VARCHAR(255),
  `number` VARCHAR(50),
  `complement` VARCHAR(100),
  `neighborhood` VARCHAR(100),
  `city` VARCHAR(100),
  `state` VARCHAR(2),
  `responsible_name` VARCHAR(255),
  `responsible_phone` VARCHAR(20),
  `medical_observations` TEXT,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `enrollment_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de professores
CREATE TABLE `instructors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE,
  `phone` VARCHAR(20),
  `avatar_url` VARCHAR(255),
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de modalidades oferecidas
CREATE TABLE `modalities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `type` ENUM('aquatica', 'coletiva', 'individual'),
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de especialidades dos professores (relação N:N)
CREATE TABLE `instructor_specialties` (
  `instructor_id` INT,
  `modality_id` INT,
  PRIMARY KEY (`instructor_id`, `modality_id`),
  FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`modality_id`) REFERENCES `modalities`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de turmas
CREATE TABLE `classes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `modality_id` INT,
  `instructor_id` INT,
  `location` VARCHAR(100),
  `max_students` INT,
  `start_time` TIME,
  `end_time` TIME,
  `monthly_fee` DECIMAL(10, 2),
  `status` ENUM('active', 'inactive', 'full') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`modality_id`) REFERENCES `modalities`(`id`),
  FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela para os dias da semana de cada turma (relação N:N)
CREATE TABLE `class_weekdays` (
  `class_id` INT,
  `weekday` ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'),
  PRIMARY KEY (`class_id`, `weekday`),
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de matrículas dos alunos nas turmas (relação N:N)
CREATE TABLE `enrollments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT,
  `class_id` INT,
  `enrollment_date` DATE,
  `status` ENUM('active', 'cancelled') DEFAULT 'active',
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`),
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de transações financeiras (receitas e despesas)
CREATE TABLE `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `description` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `type` ENUM('revenue', 'expense') NOT NULL,
  `category` VARCHAR(100),
  `transaction_date` DATE,
  `payment_method` VARCHAR(50),
  `student_id` INT NULL, -- Associado a um aluno, se for uma receita de mensalidade
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de controle de frequência
CREATE TABLE `attendances` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT,
  `class_id` INT,
  `class_date` DATE,
  `status` ENUM('present', 'absent', 'justified') NOT NULL,
  `check_in_time` TIME,
  `observations` TEXT,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`),
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de equipamentos para manutenção
CREATE TABLE `equipments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100),
  `location` VARCHAR(100),
  `brand` VARCHAR(100),
  `model` VARCHAR(100),
  `serial_number` VARCHAR(100) UNIQUE,
  `installation_date` DATE,
  `status` ENUM('operational', 'maintenance', 'broken') DEFAULT 'operational',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de agendamentos de manutenção
CREATE TABLE `maintenance_schedules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `equipment_id` INT,
  `type` ENUM('preventive', 'corrective', 'emergency'),
  `description` TEXT,
  `scheduled_date` DATETIME,
  `completion_date` DATETIME,
  `status` ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
  `cost` DECIMAL(10, 2),
  `responsible` VARCHAR(255),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipments`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserção inicial para a academia
INSERT INTO `academies` (`name`) VALUES ('Hidro Fitness');

-- Inserção do usuário Desenvolvedor (a senha deve ser hash)
-- Exemplo com a senha 'superdev123'
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`) VALUES ('Desenvolvedor', 'dev@hidrofitness.com', '$2b$10$abcdefghijklmnopqrstuv', 'developer');
