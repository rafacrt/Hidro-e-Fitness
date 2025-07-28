-- Active: 1722123547161@@35.222.193.111@3306@hidro
-- Create Users Table
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('Desenvolvedor', 'Administrador', 'Recepção') NOT NULL,
    ProfilePicture VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AcademySettings Table
CREATE TABLE IF NOT EXISTS AcademySettings (
    SettingID INT AUTO_INCREMENT PRIMARY KEY,
    AcademyName VARCHAR(255) NOT NULL,
    LogoURL VARCHAR(255)
);

-- Create Students Table
CREATE TABLE IF NOT EXISTS Students (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) UNIQUE,
    BirthDate DATE,
    Email VARCHAR(255),
    Phone VARCHAR(20),
    IsWhatsApp BOOLEAN,
    CEP VARCHAR(9),
    Street VARCHAR(255),
    Number VARCHAR(10),
    Complement VARCHAR(100),
    Neighborhood VARCHAR(100),
    City VARCHAR(100),
    State VARCHAR(50),
    ResponsibleName VARCHAR(255),
    ResponsiblePhone VARCHAR(20),
    MedicalObservations TEXT,
    Status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Instructors Table
CREATE TABLE IF NOT EXISTS Instructor (
    InstructorID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE,
    Phone VARCHAR(20),
    Status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Specialties Table
CREATE TABLE IF NOT EXISTS Specialties (
    SpecialtyID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE
);

-- Create InstructorSpecialties Table (Junction Table)
CREATE TABLE IF NOT EXISTS InstructorSpecialties (
    InstructorID INT,
    SpecialtyID INT,
    PRIMARY KEY (InstructorID, SpecialtyID),
    FOREIGN KEY (InstructorID) REFERENCES Instructor(InstructorID) ON DELETE CASCADE,
    FOREIGN KEY (SpecialtyID) REFERENCES Specialties(SpecialtyID) ON DELETE CASCADE
);

-- Create Modalities Table
CREATE TABLE IF NOT EXISTS Modalities (
    ModalityID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Type VARCHAR(100),
    MaxStudents INT,
    DurationMinutes INT,
    Price DECIMAL(10, 2),
    Status ENUM('Ativa', 'Inativa') DEFAULT 'Ativa'
);

-- Create Classes Table
CREATE TABLE IF NOT EXISTS Classes (
    ClassID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    ModalityID INT,
    InstructorID INT,
    StartTime TIME,
    EndTime TIME,
    Location VARCHAR(100),
    MaxStudents INT,
    Status ENUM('Ativa', 'Inativa', 'Lotada') DEFAULT 'Ativa',
    FOREIGN KEY (ModalityID) REFERENCES Modalities(ModalityID),
    FOREIGN KEY (InstructorID) REFERENCES Instructor(InstructorID)
);

-- Create ClassDays Table (Junction Table for recurring classes)
CREATE TABLE IF NOT EXISTS ClassDays (
    ClassID INT,
    DayOfWeek ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'),
    PRIMARY KEY (ClassID, DayOfWeek),
    FOREIGN KEY (ClassID) REFERENCES Classes(ClassID) ON DELETE CASCADE
);

-- Create Enrollments Table
CREATE TABLE IF NOT EXISTS Enrollments (
    EnrollmentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    ClassID INT,
    EnrollmentDate DATE,
    Status ENUM('Ativo', 'Cancelado') DEFAULT 'Ativo',
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (ClassID) REFERENCES Classes(ClassID)
);

-- Create Attendance Table
CREATE TABLE IF NOT EXISTS Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    ClassID INT,
    StudentID INT,
    AttendanceDate DATE,
    Status ENUM('Presente', 'Ausente', 'Justificado'),
    CheckInTime TIME,
    Observations TEXT,
    FOREIGN KEY (ClassID) REFERENCES Classes(ClassID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DueDate DATE,
    Status ENUM('Pago', 'Pendente', 'Vencido', 'Estornado'),
    PaymentMethod VARCHAR(50),
    Description TEXT,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);

-- Create Equipment Table
CREATE TABLE IF NOT EXISTS Equipment (
    EquipmentID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Category VARCHAR(100),
    Location VARCHAR(100),
    Brand VARCHAR(100),
    Model VARCHAR(100),
    SerialNumber VARCHAR(100),
    PurchaseDate DATE,
    Cost DECIMAL(10, 2),
    Status ENUM('Operacional', 'Manutenção', 'Quebrado')
);

-- Create Maintenance Table
CREATE TABLE IF NOT EXISTS Maintenance (
    MaintenanceID INT AUTO_INCREMENT PRIMARY KEY,
    EquipmentID INT,
    Type ENUM('Preventiva', 'Corretiva', 'Emergencial'),
    Description TEXT,
    ScheduledDate DATE,
    CompletionDate DATE,
    Cost DECIMAL(10, 2),
    Responsible VARCHAR(255),
    Status ENUM('Agendada', 'Em Andamento', 'Concluída', 'Cancelada'),
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID)
);

-- Create ChemicalProducts Table
CREATE TABLE IF NOT EXISTS ChemicalProducts (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Unit VARCHAR(10), -- e.g., kg, L
    CurrentStock DECIMAL(10, 2),
    MinStock DECIMAL(10, 2),
    MaxStock DECIMAL(10, 2)
);

-- Create ChemicalApplications Table
CREATE TABLE IF NOT EXISTS ChemicalApplications (
    ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    Amount DECIMAL(10, 2),
    ApplicationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UserID INT,
    Reason TEXT,
    FOREIGN KEY (ProductID) REFERENCES ChemicalProducts(ProductID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Create WaterQualityLog Table
CREATE TABLE IF NOT EXISTS WaterQualityLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pH DECIMAL(4, 2),
    Chlorine DECIMAL(4, 2),
    Alkalinity INT,
    Temperature DECIMAL(4, 2),
    Turbidity DECIMAL(4, 2),
    PoolID VARCHAR(50) -- e.g., 'Piscina 1', 'Piscina 2'
);

-- Insert some initial data for demonstration
INSERT INTO Specialties (Name) VALUES ('Natação Adulto'), ('Natação Infantil'), ('Hidroginástica'), ('Zumba Aquática'), ('Funcional Aquático'), ('Natação Avançada');
