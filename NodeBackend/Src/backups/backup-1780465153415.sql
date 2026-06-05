/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: academic_years
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `academic_years` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB AUTO_INCREMENT = 107 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: activity_logs
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `activity_logs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int DEFAULT NULL,
  `Action` text,
  `Module` varchar(100) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB AUTO_INCREMENT = 121 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: backup_settings
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `backup_settings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `AutoBackup` tinyint(1) DEFAULT NULL,
  `Frequency` varchar(50) DEFAULT NULL,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: backups
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `backups` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FileName` varchar(255) DEFAULT NULL,
  `GoogleFileId` varchar(255) DEFAULT NULL,
  `FileSize` varchar(100) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `BackupType` varchar(50) DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB AUTO_INCREMENT = 102 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: classes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `classes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ClassCode` varchar(50) DEFAULT NULL,
  `ClassName` varchar(100) NOT NULL,
  `TeacherId` int DEFAULT NULL,
  `LevelId` int DEFAULT NULL,
  `AcademicYearId` int DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ProgramId` int NOT NULL,
  `Shift` enum('Morning', 'Afternoon', 'Evening') DEFAULT NULL,
  `Room` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ClassCode` (`ClassCode`),
  KEY `TeacherId` (`TeacherId`),
  KEY `LevelId` (`LevelId`),
  KEY `AcademicYearId` (`AcademicYearId`),
  KEY `c_pro` (`ProgramId`),
  CONSTRAINT `c_pro` FOREIGN KEY (`ProgramId`) REFERENCES `programs` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`TeacherId`) REFERENCES `teachers` (`Id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`LevelId`) REFERENCES `levels` (`Id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `classes_ibfk_3` FOREIGN KEY (`AcademicYearId`) REFERENCES `academic_years` (`Id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 107 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enrollments
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `enrollments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentId` int NOT NULL,
  `ClassId` int NOT NULL,
  `AcademicYearId` int NOT NULL,
  `EnrollDate` date DEFAULT NULL,
  `Status` enum('active', 'completed', 'dropped') DEFAULT 'active',
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `StudentId` (`StudentId`, `ClassId`, `AcademicYearId`),
  KEY `ClassId` (`ClassId`),
  KEY `AcademicYearId` (`AcademicYearId`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `students` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`ClassId`) REFERENCES `classes` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`AcademicYearId`) REFERENCES `academic_years` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 106 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: exams
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `exams` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ExamName` varchar(100) NOT NULL,
  `ClassId` int NOT NULL,
  `SubjectId` int DEFAULT NULL,
  `ExamDate` date DEFAULT NULL,
  `TotalScore` decimal(5, 2) DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `ClassId` (`ClassId`),
  KEY `fk_exam_subject` (`SubjectId`),
  CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`ClassId`) REFERENCES `classes` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_exam_subject` FOREIGN KEY (`SubjectId`) REFERENCES `subjects` (`Id`)
) ENGINE = InnoDB AUTO_INCREMENT = 105 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: fee
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `fee` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ClassId` int NOT NULL,
  `FeeName` varchar(255) NOT NULL,
  `ProgramType` enum(
  'English Full Time',
  'English Part Time',
  'Khmer Full Time'
  ) NOT NULL,
  `DurationType` enum('Month', 'Quarter', 'Semester', 'Year') NOT NULL,
  `Amount` decimal(10, 2) NOT NULL,
  `Description` text,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `ClassId` (`ClassId`),
  CONSTRAINT `fee_ibfk_1` FOREIGN KEY (`ClassId`) REFERENCES `classes` (`Id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 104 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: fees
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `fees` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ClassId` int NOT NULL,
  `FeeName` varchar(100) DEFAULT NULL,
  `Amount` decimal(10, 2) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Status` enum('Paid', 'Pending') DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `ClassId` (`ClassId`),
  CONSTRAINT `fees_ibfk_1` FOREIGN KEY (`ClassId`) REFERENCES `classes` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 106 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: leave_requests
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `leave_requests` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Reason` text,
  `Status` enum('pending', 'approved', 'rejected') DEFAULT 'pending',
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 107 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: levels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `levels` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `LevelName` varchar(100) NOT NULL,
  `ProgramId` int NOT NULL,
  `LevelOrder` enum(
  'Pre-K1',
  'Pre-K2',
  'Pre-K3',
  'K1',
  'K2',
  'K3',
  'Starter1',
  'Starter2',
  'Starter3',
  'Level 1',
  'Level 2',
  'Level 3',
  'Level 4',
  'Level 5',
  'Level 6',
  'Level 7',
  'Level 8',
  'Level 9',
  'Level 10',
  'Level 11',
  'Level 12',
  'Kh 1',
  'Kh 2',
  'Kh 3',
  'Kh 4',
  'Kh 5',
  'Kh 6'
  ) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `l_pro` (`ProgramId`),
  CONSTRAINT `l_pro` FOREIGN KEY (`ProgramId`) REFERENCES `programs` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 145 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: logs
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `logs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Action` varchar(100) DEFAULT NULL,
  `Description` text,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 105 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: notifications
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `notifications` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Message` text,
  `Type` varchar(50) DEFAULT NULL,
  `IsRead` tinyint(1) DEFAULT '0',
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 112 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: parents
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `parents` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB AUTO_INCREMENT = 105 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: password_resets
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `password_resets` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `OtpCode` varchar(10) DEFAULT NULL,
  `ExpireAt` datetime DEFAULT NULL,
  `Verified` tinyint(1) DEFAULT '0',
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 128 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: payments
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `payments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentId` int NOT NULL,
  `FeeId` int NOT NULL,
  `Amount` decimal(10, 2) NOT NULL,
  `Currency` varchar(10) DEFAULT NULL,
  `PaymentMethod` enum('cash', 'bakong', 'aba', 'acleda', 'card') DEFAULT NULL,
  `Status` enum('pending', 'paid', 'failed', 'cancelled') DEFAULT 'pending',
  `TransactionId` varchar(255) DEFAULT NULL,
  `ProviderTransactionId` varchar(255) DEFAULT NULL,
  `Md5` varchar(255) DEFAULT NULL,
  `PaymentDate` datetime DEFAULT NULL,
  `ExpireAt` datetime DEFAULT NULL,
  `QrData` text,
  `Remark` text,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `PaymentType` varchar(120) DEFAULT NULL,
  `Months` varchar(120) DEFAULT NULL,
  `ReceiptNo` varchar(100) DEFAULT NULL,
  `PaidBy` enum('staff', 'student') DEFAULT NULL,
  `TelegramSent` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `TransactionId` (`TransactionId`),
  KEY `StudentId` (`StudentId`),
  KEY `FeeId` (`FeeId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `students` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`FeeId`) REFERENCES `fees` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 174 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: programs
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `programs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProgramName` varchar(100) NOT NULL,
  `Description` text,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB AUTO_INCREMENT = 103 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: refresh_tokens
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Token` text NOT NULL,
  `Expiry` datetime NOT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 390 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: roles
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `roles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(100) DEFAULT NULL,
  `Description` text,
  `Permissions` json DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB AUTO_INCREMENT = 100 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: scores
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `scores` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentId` int NOT NULL,
  `ExamId` int NOT NULL,
  `Score` decimal(5, 2) DEFAULT NULL,
  `Grade` varchar(10) DEFAULT NULL,
  `Remark` text,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `StudentId` (`StudentId`, `ExamId`),
  KEY `ExamId` (`ExamId`),
  CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `students` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`ExamId`) REFERENCES `exams` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 105 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: settings
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `settings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SchoolName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SchoolKhName` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Logo` text COLLATE utf8mb4_unicode_ci,
  `SchoolPicture` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Currency` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `EmailNotification` tinyint(1) DEFAULT '0',
  `DarkMode` tinyint(1) DEFAULT '0',
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: staffs
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `staffs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StaffCode` varchar(50) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Position` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `StaffCode` (`StaffCode`)
) ENGINE = InnoDB AUTO_INCREMENT = 105 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: student_attendance
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `student_attendance` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentId` int NOT NULL,
  `ClassId` int NOT NULL,
  `AttendanceDate` date NOT NULL,
  `Status` enum('Present', 'Absent', 'Late', 'Permission') DEFAULT NULL,
  `Remark` text,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `TeacherId_mark` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `StudentId` (`StudentId`, `ClassId`, `AttendanceDate`),
  KEY `ClassId` (`ClassId`),
  KEY `t_sa` (`TeacherId_mark`),
  CONSTRAINT `student_attendance_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `students` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `student_attendance_ibfk_2` FOREIGN KEY (`ClassId`) REFERENCES `classes` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t_sa` FOREIGN KEY (`TeacherId_mark`) REFERENCES `teachers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 111 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: student_parents
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `student_parents` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentId` int NOT NULL,
  `ParentId` int NOT NULL,
  `Relation` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `StudentId` (`StudentId`),
  KEY `ParentId` (`ParentId`),
  CONSTRAINT `student_parents_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `students` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `student_parents_ibfk_2` FOREIGN KEY (`ParentId`) REFERENCES `parents` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 105 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: student_payments
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `student_payments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentId` int NOT NULL,
  `FeeId` int NOT NULL,
  `TotalAmount` decimal(10, 2) DEFAULT NULL,
  `Discount` decimal(10, 2) DEFAULT '0.00',
  `FinalAmount` decimal(10, 2) DEFAULT NULL,
  `PaidAmount` decimal(10, 2) DEFAULT NULL,
  `RemainingAmount` decimal(10, 2) DEFAULT NULL,
  `PaymentMethod` enum('Cash', 'Bakong', 'ABA', 'ACLEDA') DEFAULT NULL,
  `PaymentStatus` enum('Paid', 'Pending', 'Failed') DEFAULT NULL,
  `PaymentDate` date DEFAULT NULL,
  `ReceiptNumber` varchar(100) DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: students
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `students` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentCode` varchar(50) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `KhmerName` varchar(255) DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `DadName` varchar(100) DEFAULT NULL,
  `MomName` varchar(100) DEFAULT NULL,
  `ProgramId` int DEFAULT NULL,
  `ClassId` int DEFAULT NULL,
  `TeacherId` int DEFAULT NULL,
  `LevelId` int DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Image` varchar(500) DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ProgramType` enum(
  'English Full Time',
  'English Part Time',
  'Khmer Full Time'
  ) DEFAULT NULL,
  `CurrentFeeId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `StudentCode` (`StudentCode`),
  KEY `s_c` (`ClassId`),
  KEY `s_t` (`TeacherId`),
  KEY `s_l` (`LevelId`),
  KEY `s_fee` (`CurrentFeeId`),
  KEY `stu_pro` (`ProgramId`),
  CONSTRAINT `s_c` FOREIGN KEY (`ClassId`) REFERENCES `classes` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `s_fee` FOREIGN KEY (`CurrentFeeId`) REFERENCES `fee` (`Id`),
  CONSTRAINT `s_l` FOREIGN KEY (`LevelId`) REFERENCES `levels` (`Id`) ON DELETE
  SET
  NULL,
  CONSTRAINT `s_t` FOREIGN KEY (`TeacherId`) REFERENCES `teachers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stu_pro` FOREIGN KEY (`ProgramId`) REFERENCES `programs` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 122 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: subjects
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `subjects` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SubjectName` varchar(255) NOT NULL,
  `KhmerName` varchar(255) DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB AUTO_INCREMENT = 106 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: teacher_attendance
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `teacher_attendance` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeacherId` int NOT NULL,
  `AttendanceDate` date NOT NULL,
  `CheckInTime` datetime DEFAULT NULL,
  `CheckOutTime` datetime DEFAULT NULL,
  `CheckInLat` decimal(10, 6) DEFAULT NULL,
  `CheckInLng` decimal(10, 6) DEFAULT NULL,
  `CheckOutLat` decimal(10, 6) DEFAULT NULL,
  `CheckOutLng` decimal(10, 6) DEFAULT NULL,
  `Status` enum('OnTime', 'Late', 'Absent', 'Excused') DEFAULT NULL,
  `Remark` text,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `TeacherId` (`TeacherId`, `AttendanceDate`),
  CONSTRAINT `teacher_attendance_ibfk_1` FOREIGN KEY (`TeacherId`) REFERENCES `teachers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 105 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: teacher_class_subjects
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `teacher_class_subjects` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeacherId` int NOT NULL,
  `ClassId` int NOT NULL,
  `SubjectId` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `TeacherId` (`TeacherId`, `ClassId`, `SubjectId`),
  KEY `ClassId` (`ClassId`),
  KEY `SubjectId` (`SubjectId`),
  CONSTRAINT `teacher_class_subjects_ibfk_1` FOREIGN KEY (`TeacherId`) REFERENCES `teachers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teacher_class_subjects_ibfk_2` FOREIGN KEY (`ClassId`) REFERENCES `classes` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teacher_class_subjects_ibfk_3` FOREIGN KEY (`SubjectId`) REFERENCES `subjects` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 105 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: teachers
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `teachers` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeacherCode` varchar(50) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `KhmerName` varchar(255) DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Shift` enum(
  'Morning',
  'Afternoon',
  'Evening',
  'Morning + Afternoon',
  'Morning + Evening',
  'Afternoon + Evening',
  'Morning + Afternoon + Evening'
  ) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Image` varchar(500) DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `TeacherCode` (`TeacherCode`)
) ENGINE = InnoDB AUTO_INCREMENT = 118 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: timetables
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `timetables` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ClassId` int NOT NULL,
  `SubjectId` int NOT NULL,
  `TeacherId` int NOT NULL,
  `DayOfWeek` enum(
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
  ) DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `ClassId` (`ClassId`),
  KEY `SubjectId` (`SubjectId`),
  KEY `TeacherId` (`TeacherId`),
  CONSTRAINT `timetables_ibfk_1` FOREIGN KEY (`ClassId`) REFERENCES `classes` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `timetables_ibfk_2` FOREIGN KEY (`SubjectId`) REFERENCES `subjects` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `timetables_ibfk_3` FOREIGN KEY (`TeacherId`) REFERENCES `teachers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 229 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(120) NOT NULL,
  `Email` varchar(120) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('staff', 'teacher', 'student', 'admin') DEFAULT NULL,
  `TeacherId` int DEFAULT NULL,
  `StudentId` int DEFAULT NULL,
  `StaffId` int DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  `LastLogin` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`),
  KEY `TeacherId` (`TeacherId`),
  KEY `StudentId` (`StudentId`),
  KEY `StaffId` (`StaffId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`TeacherId`) REFERENCES `teachers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`StudentId`) REFERENCES `students` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`StaffId`) REFERENCES `staffs` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 109 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: academic_years
# ------------------------------------------------------------

INSERT INTO
  `academic_years` (`Id`, `Name`, `StartDate`, `EndDate`, `CreateAt`)
VALUES
  (
    100,
    '2025-2026',
    '2025-11-01',
    '2026-10-31',
    '2026-05-06 11:22:15'
  );
INSERT INTO
  `academic_years` (`Id`, `Name`, `StartDate`, `EndDate`, `CreateAt`)
VALUES
  (
    101,
    '2026-2027',
    '2026-11-01',
    '2027-10-31',
    '2026-05-06 11:22:15'
  );
INSERT INTO
  `academic_years` (`Id`, `Name`, `StartDate`, `EndDate`, `CreateAt`)
VALUES
  (
    102,
    '2027-2028',
    '2027-11-01',
    '2028-10-31',
    '2026-05-06 11:22:15'
  );
INSERT INTO
  `academic_years` (`Id`, `Name`, `StartDate`, `EndDate`, `CreateAt`)
VALUES
  (
    103,
    '2028-2029',
    '2028-11-01',
    '2029-10-31',
    '2026-05-06 11:22:15'
  );
INSERT INTO
  `academic_years` (`Id`, `Name`, `StartDate`, `EndDate`, `CreateAt`)
VALUES
  (
    104,
    '2029-2030',
    '2029-11-01',
    '2030-10-31',
    '2026-05-06 11:22:15'
  );
INSERT INTO
  `academic_years` (`Id`, `Name`, `StartDate`, `EndDate`, `CreateAt`)
VALUES
  (
    105,
    '2026-2027',
    '2026-06-01',
    '2027-05-31',
    '2026-05-20 12:56:09'
  );
INSERT INTO
  `academic_years` (`Id`, `Name`, `StartDate`, `EndDate`, `CreateAt`)
VALUES
  (
    106,
    '2027-2028',
    '2027-05-01',
    '2028-05-01',
    '2026-05-22 10:43:54'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: activity_logs
# ------------------------------------------------------------

INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    1,
    101,
    'Logged into system',
    NULL,
    'Success',
    '2026-05-27 14:39:17'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    2,
    102,
    'Logged into system',
    NULL,
    'Success',
    '2026-05-27 14:41:31'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    3,
    102,
    'Logged into system',
    NULL,
    'Success',
    '2026-05-27 14:41:52'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    4,
    102,
    'Created new user: Yin Somphors',
    NULL,
    'Success',
    '2026-05-27 14:50:04'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    5,
    102,
    'Logged into system',
    NULL,
    'Success',
    '2026-05-27 14:54:45'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    6,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-27 15:17:32'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    7,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-27 21:32:17'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    8,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-27 21:49:15'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    9,
    102,
    'Created new user: Meyling',
    NULL,
    'Success',
    '2026-05-27 22:00:19'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    10,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-27 22:00:46'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    11,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-27 22:01:03'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    12,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-27 22:02:00'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    13,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-27 22:21:19'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    14,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-27 23:07:56'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    15,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-28 11:41:24'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    16,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-28 12:03:12'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    17,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-28 12:03:27'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    18,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-28 13:36:38'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    19,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-28 13:37:38'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    20,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-28 13:49:46'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    21,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-28 14:32:40'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    22,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-28 14:55:24'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    23,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-28 15:29:08'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    24,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-28 15:29:24'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    25,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-28 15:42:40'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    26,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-28 21:16:53'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    27,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-28 21:26:04'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    28,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-28 21:29:08'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    29,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-29 15:08:13'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    30,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-29 15:27:14'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    31,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-29 15:50:14'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    32,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-29 17:03:37'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    33,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-29 17:16:59'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    34,
    101,
    'Student payment successful: TXN-1780053375485',
    NULL,
    'Success',
    '2026-05-29 18:16:37'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    35,
    101,
    'Student payment successful: TXN-1780053963704',
    NULL,
    'Success',
    '2026-05-29 18:26:35'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    36,
    101,
    'Student payment successful: TXN-1780054210748',
    NULL,
    'Success',
    '2026-05-29 18:30:31'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    37,
    101,
    'Student payment successful: TXN-1780054635454',
    NULL,
    'Success',
    '2026-05-29 18:37:51'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    38,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-29 21:01:40'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    39,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-29 22:06:15'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    40,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-30 16:33:14'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    41,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-30 16:38:03'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    42,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-30 16:38:23'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    43,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-30 16:59:48'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    44,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-05-30 17:07:34'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    45,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-30 17:08:48'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    46,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-30 17:12:14'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    47,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-30 17:12:26'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    48,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-05-30 17:12:42'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    49,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-30 17:13:16'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    50,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-30 18:01:40'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    51,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-30 18:50:14'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    52,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-30 19:02:52'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    53,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-05-30 19:03:07'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    54,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-30 19:45:51'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    55,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-31 11:13:15'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    56,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-31 11:15:07'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    57,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-31 11:16:50'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    58,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 11:32:28'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    59,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 11:41:44'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    60,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 12:09:35'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    61,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 12:10:31'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    62,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 12:13:43'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    63,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-31 13:27:27'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    64,
    101,
    'Student payment successful: TXN-1780209044812',
    NULL,
    'Success',
    '2026-05-31 13:31:09'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    65,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 13:43:09'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    66,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-31 13:49:06'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    67,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-31 13:56:58'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    68,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-31 14:13:49'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    69,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 14:18:53'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    70,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 14:29:13'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    71,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-31 15:19:38'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    72,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 15:24:52'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    73,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-31 15:28:25'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    74,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 15:29:09'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    75,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 15:52:54'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    76,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 21:15:44'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    77,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-05-31 21:16:03'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    78,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-31 21:16:19'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    79,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-05-31 21:45:10'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    80,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-05-31 21:56:36'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    81,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-06-01 10:15:44'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    82,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-06-01 10:24:14'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    83,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-06-01 13:06:33'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    84,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-06-01 21:12:42'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    85,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-06-01 21:13:40'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    86,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-06-01 21:14:10'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    87,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-06-01 22:03:53'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    88,
    101,
    'Student payment successful: TXN-1780327802609',
    NULL,
    'Success',
    '2026-06-01 22:30:15'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    89,
    101,
    'Student payment successful: TXN-1780328179523',
    NULL,
    'Success',
    '2026-06-01 22:36:41'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    90,
    101,
    'Student payment successful: TXN-1780329230877',
    NULL,
    'Success',
    '2026-06-01 22:54:12'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    91,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-06-02 12:24:21'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    92,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-06-02 12:24:54'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    93,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-02 12:26:08'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    94,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-06-02 12:29:03'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    95,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-02 12:36:11'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    96,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-06-02 13:04:30'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    97,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-06-02 13:04:44'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    98,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-06-02 13:16:13'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    99,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-06-02 13:16:25'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    100,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-06-02 13:16:42'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    101,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-02 15:13:24'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    102,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-02 20:59:18'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    103,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-06-02 21:01:33'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    104,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-02 21:02:10'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    105,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-06-02 21:09:11'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    106,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-02 21:20:25'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    107,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-06-02 21:46:57'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    108,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-02 22:02:44'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    109,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-06-02 22:03:02'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    110,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-03 09:52:31'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    111,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-06-03 09:55:55'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    112,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-06-03 10:35:36'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    113,
    101,
    'Student payment successful: TXN-1780458879183',
    NULL,
    'Success',
    '2026-06-03 10:55:05'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    114,
    100,
    'Staff Phors',
    NULL,
    'Logged into system',
    '2026-06-03 10:59:12'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    115,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-03 10:59:40'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    116,
    101,
    'Student Phors',
    NULL,
    'Logged into system',
    '2026-06-03 11:06:36'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    117,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-06-03 11:08:13'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    118,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-03 11:10:18'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    119,
    103,
    'Teacher Thavy',
    NULL,
    'Logged into system',
    '2026-06-03 11:10:52'
  );
INSERT INTO
  `activity_logs` (
    `Id`,
    `UserId`,
    `Action`,
    `Module`,
    `Status`,
    `CreatedAt`
  )
VALUES
  (
    120,
    102,
    'Admin Phors',
    NULL,
    'Logged into system',
    '2026-06-03 12:17:07'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: backup_settings
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: backups
# ------------------------------------------------------------

INSERT INTO
  `backups` (
    `Id`,
    `FileName`,
    `GoogleFileId`,
    `FileSize`,
    `Status`,
    `BackupType`,
    `CreatedAt`
  )
VALUES
  (
    100,
    'backup-1779811138155.zip',
    '1xjI4VmK0PAhU8OD6ErvFl-r15xjdLdgO',
    '0.02 MB',
    'Completed',
    'Automatic',
    '2026-05-26 22:59:01'
  );
INSERT INTO
  `backups` (
    `Id`,
    `FileName`,
    `GoogleFileId`,
    `FileSize`,
    `Status`,
    `BackupType`,
    `CreatedAt`
  )
VALUES
  (
    101,
    'backup-1780210046246.zip',
    '1QxtK5moPfKA2ho7kZ7aF7RAGsuRvO3EB',
    '0.03 MB',
    'Completed',
    'Automatic',
    '2026-05-31 13:47:30'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: classes
# ------------------------------------------------------------

INSERT INTO
  `classes` (
    `Id`,
    `ClassCode`,
    `ClassName`,
    `TeacherId`,
    `LevelId`,
    `AcademicYearId`,
    `CreateAt`,
    `ProgramId`,
    `Shift`,
    `Room`
  )
VALUES
  (
    100,
    'CLS-100',
    'Pre-k1',
    100,
    100,
    100,
    '2026-05-06 11:22:16',
    100,
    NULL,
    NULL
  );
INSERT INTO
  `classes` (
    `Id`,
    `ClassCode`,
    `ClassName`,
    `TeacherId`,
    `LevelId`,
    `AcademicYearId`,
    `CreateAt`,
    `ProgramId`,
    `Shift`,
    `Room`
  )
VALUES
  (
    101,
    'CLS-101',
    'Pre-k2',
    101,
    100,
    100,
    '2026-05-06 11:22:16',
    100,
    NULL,
    NULL
  );
INSERT INTO
  `classes` (
    `Id`,
    `ClassCode`,
    `ClassName`,
    `TeacherId`,
    `LevelId`,
    `AcademicYearId`,
    `CreateAt`,
    `ProgramId`,
    `Shift`,
    `Room`
  )
VALUES
  (
    102,
    'CLS-102',
    'Pre-k3',
    102,
    101,
    100,
    '2026-05-06 11:22:16',
    100,
    NULL,
    NULL
  );
INSERT INTO
  `classes` (
    `Id`,
    `ClassCode`,
    `ClassName`,
    `TeacherId`,
    `LevelId`,
    `AcademicYearId`,
    `CreateAt`,
    `ProgramId`,
    `Shift`,
    `Room`
  )
VALUES
  (
    103,
    'CLS-103',
    'k1',
    103,
    102,
    100,
    '2026-05-06 11:22:16',
    100,
    NULL,
    NULL
  );
INSERT INTO
  `classes` (
    `Id`,
    `ClassCode`,
    `ClassName`,
    `TeacherId`,
    `LevelId`,
    `AcademicYearId`,
    `CreateAt`,
    `ProgramId`,
    `Shift`,
    `Room`
  )
VALUES
  (
    104,
    'CLS-104',
    'k2',
    104,
    103,
    100,
    '2026-05-06 11:22:16',
    100,
    NULL,
    NULL
  );
INSERT INTO
  `classes` (
    `Id`,
    `ClassCode`,
    `ClassName`,
    `TeacherId`,
    `LevelId`,
    `AcademicYearId`,
    `CreateAt`,
    `ProgramId`,
    `Shift`,
    `Room`
  )
VALUES
  (
    105,
    'CLS-105',
    'k3',
    103,
    104,
    101,
    '2026-05-09 19:41:14',
    100,
    NULL,
    NULL
  );
INSERT INTO
  `classes` (
    `Id`,
    `ClassCode`,
    `ClassName`,
    `TeacherId`,
    `LevelId`,
    `AcademicYearId`,
    `CreateAt`,
    `ProgramId`,
    `Shift`,
    `Room`
  )
VALUES
  (
    106,
    'CLS-106',
    'Starter 1',
    103,
    106,
    101,
    '2026-05-25 11:40:54',
    101,
    'Evening',
    'F001'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enrollments
# ------------------------------------------------------------

INSERT INTO
  `enrollments` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AcademicYearId`,
    `EnrollDate`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    100,
    100,
    100,
    100,
    '2026-01-01',
    'active',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `enrollments` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AcademicYearId`,
    `EnrollDate`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    101,
    101,
    101,
    100,
    '2026-01-01',
    'active',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `enrollments` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AcademicYearId`,
    `EnrollDate`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    102,
    102,
    102,
    100,
    '2026-01-01',
    'active',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `enrollments` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AcademicYearId`,
    `EnrollDate`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    103,
    103,
    103,
    100,
    '2026-01-01',
    'active',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `enrollments` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AcademicYearId`,
    `EnrollDate`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    104,
    104,
    104,
    100,
    '2026-01-01',
    'active',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `enrollments` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AcademicYearId`,
    `EnrollDate`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    105,
    102,
    105,
    101,
    '2026-05-15',
    'active',
    '2026-05-15 12:57:20'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: exams
# ------------------------------------------------------------

INSERT INTO
  `exams` (
    `Id`,
    `ExamName`,
    `ClassId`,
    `SubjectId`,
    `ExamDate`,
    `TotalScore`,
    `CreateAt`
  )
VALUES
  (
    100,
    'Midterm Math',
    100,
    NULL,
    '2026-06-01',
    100.00,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `exams` (
    `Id`,
    `ExamName`,
    `ClassId`,
    `SubjectId`,
    `ExamDate`,
    `TotalScore`,
    `CreateAt`
  )
VALUES
  (
    101,
    'Midterm English',
    101,
    NULL,
    '2026-06-01',
    100.00,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `exams` (
    `Id`,
    `ExamName`,
    `ClassId`,
    `SubjectId`,
    `ExamDate`,
    `TotalScore`,
    `CreateAt`
  )
VALUES
  (
    102,
    'Midterm Physics',
    102,
    NULL,
    '2026-06-02',
    100.00,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `exams` (
    `Id`,
    `ExamName`,
    `ClassId`,
    `SubjectId`,
    `ExamDate`,
    `TotalScore`,
    `CreateAt`
  )
VALUES
  (
    103,
    'Midterm Chemistry',
    103,
    NULL,
    '2026-06-02',
    100.00,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `exams` (
    `Id`,
    `ExamName`,
    `ClassId`,
    `SubjectId`,
    `ExamDate`,
    `TotalScore`,
    `CreateAt`
  )
VALUES
  (
    104,
    'Midterm Khmer',
    104,
    NULL,
    '2026-06-03',
    100.00,
    '2026-05-06 11:22:16'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: fee
# ------------------------------------------------------------

INSERT INTO
  `fee` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `ProgramType`,
    `DurationType`,
    `Amount`,
    `Description`,
    `CreateAt`
  )
VALUES
  (
    100,
    100,
    'Tuition Fee',
    'English Full Time',
    'Month',
    0.01,
    'Pre-K1 Full Time',
    '2026-05-24 22:41:36'
  );
INSERT INTO
  `fee` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `ProgramType`,
    `DurationType`,
    `Amount`,
    `Description`,
    `CreateAt`
  )
VALUES
  (
    101,
    101,
    'Tuition Fee',
    'English Full Time',
    'Quarter',
    0.01,
    'Pre-k2 Full Time',
    '2026-05-24 22:41:36'
  );
INSERT INTO
  `fee` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `ProgramType`,
    `DurationType`,
    `Amount`,
    `Description`,
    `CreateAt`
  )
VALUES
  (
    102,
    102,
    'Tuition Fee',
    'English Full Time',
    'Semester',
    0.50,
    'Pre-k3 Full Time',
    '2026-05-24 22:41:36'
  );
INSERT INTO
  `fee` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `ProgramType`,
    `DurationType`,
    `Amount`,
    `Description`,
    `CreateAt`
  )
VALUES
  (
    103,
    103,
    'Tuition Fee',
    'English Full Time',
    'Year',
    0.00,
    'k1 Full Time',
    '2026-05-24 22:41:36'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: fees
# ------------------------------------------------------------

INSERT INTO
  `fees` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `Amount`,
    `Description`,
    `CreateAt`,
    `Status`
  )
VALUES
  (
    100,
    100,
    'Monthly Fee',
    50.00,
    'ថ្លៃសិក្សាប្រចាំខែ',
    '2026-05-06 11:22:16',
    NULL
  );
INSERT INTO
  `fees` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `Amount`,
    `Description`,
    `CreateAt`,
    `Status`
  )
VALUES
  (
    101,
    101,
    'Monthly Fee',
    55.00,
    'ថ្លៃសិក្សាប្រចាំខែ',
    '2026-05-06 11:22:16',
    NULL
  );
INSERT INTO
  `fees` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `Amount`,
    `Description`,
    `CreateAt`,
    `Status`
  )
VALUES
  (
    102,
    102,
    'Monthly Fee',
    60.00,
    'ថ្លៃសិក្សាប្រចាំខែ',
    '2026-05-06 11:22:16',
    NULL
  );
INSERT INTO
  `fees` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `Amount`,
    `Description`,
    `CreateAt`,
    `Status`
  )
VALUES
  (
    103,
    103,
    'Monthly Fee',
    65.00,
    'ថ្លៃសិក្សាប្រចាំខែ',
    '2026-05-06 11:22:16',
    NULL
  );
INSERT INTO
  `fees` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `Amount`,
    `Description`,
    `CreateAt`,
    `Status`
  )
VALUES
  (
    104,
    104,
    'Monthly Fee',
    70.00,
    'ថ្លៃសិក្សាប្រចាំខែ',
    '2026-05-06 11:22:16',
    NULL
  );
INSERT INTO
  `fees` (
    `Id`,
    `ClassId`,
    `FeeName`,
    `Amount`,
    `Description`,
    `CreateAt`,
    `Status`
  )
VALUES
  (
    105,
    105,
    'Yearly Fee',
    12.00,
    'ការបង់ប្រាក់ប្រចាំឆ្នាំសិក្សា',
    '2026-05-17 12:32:00',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: leave_requests
# ------------------------------------------------------------

INSERT INTO
  `leave_requests` (
    `Id`,
    `UserId`,
    `StartDate`,
    `EndDate`,
    `Reason`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    100,
    102,
    '2026-05-10',
    '2026-05-11',
    'Sick',
    'approved',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `leave_requests` (
    `Id`,
    `UserId`,
    `StartDate`,
    `EndDate`,
    `Reason`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    101,
    101,
    '2026-05-12',
    '2026-05-13',
    'Family event',
    'approved',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `leave_requests` (
    `Id`,
    `UserId`,
    `StartDate`,
    `EndDate`,
    `Reason`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    102,
    103,
    '2026-05-14',
    '2026-05-15',
    'Travel',
    'rejected',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `leave_requests` (
    `Id`,
    `UserId`,
    `StartDate`,
    `EndDate`,
    `Reason`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    103,
    104,
    '2026-05-16',
    '2026-05-17',
    'Medical check',
    'approved',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `leave_requests` (
    `Id`,
    `UserId`,
    `StartDate`,
    `EndDate`,
    `Reason`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    104,
    100,
    '2026-05-18',
    '2026-05-19',
    'Meeting',
    'approved',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `leave_requests` (
    `Id`,
    `UserId`,
    `StartDate`,
    `EndDate`,
    `Reason`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    105,
    103,
    '2026-06-02',
    '2026-06-04',
    'I have a party with my family.',
    'approved',
    '2026-06-02 21:20:10'
  );
INSERT INTO
  `leave_requests` (
    `Id`,
    `UserId`,
    `StartDate`,
    `EndDate`,
    `Reason`,
    `Status`,
    `CreateAt`
  )
VALUES
  (
    106,
    103,
    '2026-06-03',
    '2026-06-04',
    'sick',
    'rejected',
    '2026-06-03 11:09:57'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: levels
# ------------------------------------------------------------

INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (100, 'Pre-K1', 100, 'Pre-K1');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (101, 'Pre-K2', 100, 'Pre-K2');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (102, 'Pre-K3', 100, 'Pre-K3');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (103, 'K1', 100, 'K1');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (104, 'K2', 100, 'K2');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (105, 'K3', 100, 'K3');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (106, 'Starter-1', 101, 'Starter1');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (107, 'Starter-2', 101, 'Starter2');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (108, 'Starter-3', 101, 'Starter3');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (109, 'Level-1', 100, 'Level 1');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (110, 'Level-2', 100, 'Level 2');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (111, 'Level-3', 100, 'Level 3');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (112, 'Level 4', 100, 'Level 4');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (113, 'Level 5', 100, 'Level 5');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (114, 'Level 6', 100, 'Level 5');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (115, 'Level 7', 100, 'Level 7');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (116, 'Level 8', 100, 'Level 8');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (117, 'Level 9', 100, 'Level 9');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (118, 'Level 10', 100, 'Level 10');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (119, 'Level 11', 100, 'Level 11');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (120, 'Level 12', 100, 'Level 12');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (121, 'Level 1', 101, 'Level 1');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (122, 'Level 2', 101, 'Level 2');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (123, 'Level 3', 101, 'Level 3');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (124, 'Level 4', 101, 'Level 4');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (125, 'Level 5', 101, 'Level 5');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (126, 'Level 6', 101, 'Level 6');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (127, 'Level 7', 101, 'Level 7');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (128, 'Level 8', 101, 'Level 8');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (129, 'Level 9', 101, 'Level 9');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (130, 'Level 10', 101, 'Level 10');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (131, 'Level 12', 101, 'Level 12');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (132, 'Kh 1', 102, 'Kh 1');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (133, 'Kh 2', 102, 'Kh 2');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (134, 'Kh 3', 102, 'Kh 3');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (135, 'Kh 4', 102, 'Kh 4');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (136, 'Kh 5', 102, 'Kh 5');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (137, 'Kh 6', 102, 'Kh 6');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (138, 'UnKnow', 101, 'Pre-K1');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (139, 'Unkonw', 101, 'Pre-K2');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (140, 'Unknow', 101, 'Pre-K3');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (141, 'Unkonw', 100, 'K1');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (142, 'Unkonw', 101, 'K2');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (143, 'Unkonw', 101, 'K3');
INSERT INTO
  `levels` (`Id`, `LevelName`, `ProgramId`, `LevelOrder`)
VALUES
  (144, 'Unkonw', 101, 'Kh 1');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: logs
# ------------------------------------------------------------

INSERT INTO
  `logs` (`Id`, `UserId`, `Action`, `Description`, `CreateAt`)
VALUES
  (
    100,
    100,
    'LOGIN',
    'Admin login success',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `logs` (`Id`, `UserId`, `Action`, `Description`, `CreateAt`)
VALUES
  (
    101,
    101,
    'ATTENDANCE',
    'Teacher marked attendance',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `logs` (`Id`, `UserId`, `Action`, `Description`, `CreateAt`)
VALUES
  (
    102,
    102,
    'VIEW_SCORE',
    'Student viewed scores',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `logs` (`Id`, `UserId`, `Action`, `Description`, `CreateAt`)
VALUES
  (
    103,
    103,
    'PAYMENT',
    'Staff recorded payment',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `logs` (`Id`, `UserId`, `Action`, `Description`, `CreateAt`)
VALUES
  (
    104,
    104,
    'RESET_PASSWORD',
    'User reset password',
    '2026-05-06 11:22:16'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: notifications
# ------------------------------------------------------------

INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    100,
    102,
    'Attendance',
    'You are absent today',
    'attendance',
    0,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    101,
    102,
    'Payment',
    'Please pay your fee',
    'payment',
    0,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    102,
    101,
    'Exam',
    'Exam starts tomorrow',
    'exam',
    1,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    103,
    103,
    'Welcome',
    'Welcome to system',
    'system',
    1,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    104,
    104,
    'Reminder',
    'Check your attendance',
    'attendance',
    0,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    105,
    101,
    'Leave Approved',
    'Your leave request has been approved',
    'leave_request',
    0,
    '2026-06-02 21:01:09'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    106,
    102,
    'Teacher Leave Request',
    'Teacher Thavy submitted a leave request from 2026-06-02 to 2026-06-04',
    'leave_request',
    0,
    '2026-06-02 21:20:10'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    107,
    105,
    'Teacher Leave Request',
    'Teacher Thavy submitted a leave request from 2026-06-02 to 2026-06-04',
    'leave_request',
    0,
    '2026-06-02 21:20:10'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    108,
    103,
    'Leave Request Approved',
    'Your leave request from Tue Jun 02 2026 00:00:00 GMT+0700 (Indochina Time) to Thu Jun 04 2026 00:00:00 GMT+0700 (Indochina Time) has been approved.',
    'leave_request',
    1,
    '2026-06-02 22:02:48'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    109,
    102,
    'Teacher Leave Request',
    'Teacher Thavy submitted a leave request from 2026-06-03 to 2026-06-04',
    'leave_request',
    0,
    '2026-06-03 11:09:57'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    110,
    105,
    'Teacher Leave Request',
    'Teacher Thavy submitted a leave request from 2026-06-03 to 2026-06-04',
    'leave_request',
    0,
    '2026-06-03 11:09:57'
  );
INSERT INTO
  `notifications` (
    `Id`,
    `UserId`,
    `Title`,
    `Message`,
    `Type`,
    `IsRead`,
    `CreateAt`
  )
VALUES
  (
    111,
    103,
    'Leave Request Rejected',
    'Your leave request from Wed Jun 03 2026 00:00:00 GMT+0700 (Indochina Time) to Thu Jun 04 2026 00:00:00 GMT+0700 (Indochina Time) has been rejected.',
    'leave_request',
    1,
    '2026-06-03 11:10:41'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: parents
# ------------------------------------------------------------

INSERT INTO
  `parents` (`Id`, `Name`, `Phone`, `Address`, `CreateAt`)
VALUES
  (
    100,
    'លោក វុទ្ធី',
    '015111111',
    'ភ្នំពេញ',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `parents` (`Id`, `Name`, `Phone`, `Address`, `CreateAt`)
VALUES
  (
    101,
    'អ្នកស្រី សុភាព',
    '015222222',
    'កណ្ដាល',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `parents` (`Id`, `Name`, `Phone`, `Address`, `CreateAt`)
VALUES
  (
    102,
    'លោក ចាន់ថា',
    '015333333',
    'តាកែវ',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `parents` (`Id`, `Name`, `Phone`, `Address`, `CreateAt`)
VALUES
  (
    103,
    'អ្នកស្រី លក្ខិណា',
    '015444444',
    'កំពង់ស្ពឺ',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `parents` (`Id`, `Name`, `Phone`, `Address`, `CreateAt`)
VALUES
  (
    104,
    'លោក សាវឿន',
    '015555555',
    'ភ្នំពេញ',
    '2026-05-06 11:22:16'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: password_resets
# ------------------------------------------------------------

INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    100,
    100,
    '111111',
    '2026-05-06 10:00:00',
    1,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    101,
    101,
    '222222',
    '2026-05-06 10:00:00',
    0,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    102,
    102,
    '333333',
    '2026-05-06 10:00:00',
    0,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    103,
    103,
    '444444',
    '2026-05-06 10:00:00',
    1,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    104,
    104,
    '555555',
    '2026-05-06 10:00:00',
    0,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    105,
    101,
    '614900',
    '2026-05-07 11:48:43',
    0,
    '2026-05-07 11:43:42'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    106,
    101,
    '229787',
    '2026-05-07 12:18:02',
    0,
    '2026-05-07 12:13:01'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    107,
    101,
    '522436',
    '2026-05-07 12:18:45',
    0,
    '2026-05-07 12:13:44'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    108,
    101,
    '682989',
    '2026-05-07 12:19:30',
    0,
    '2026-05-07 12:14:29'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    109,
    101,
    '413909',
    '2026-05-07 12:19:41',
    0,
    '2026-05-07 12:14:41'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    110,
    101,
    '844858',
    '2026-05-07 12:19:55',
    0,
    '2026-05-07 12:14:55'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    111,
    101,
    '103039',
    '2026-05-07 12:20:20',
    0,
    '2026-05-07 12:15:20'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    112,
    101,
    '822600',
    '2026-05-07 12:25:58',
    0,
    '2026-05-07 12:20:57'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    113,
    101,
    '225801',
    '2026-05-07 12:33:19',
    0,
    '2026-05-07 12:28:19'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    114,
    101,
    '908227',
    '2026-05-07 13:35:02',
    0,
    '2026-05-07 13:30:02'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    115,
    101,
    '592532',
    '2026-05-07 13:49:17',
    0,
    '2026-05-07 13:44:16'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    116,
    101,
    '448789',
    '2026-05-07 14:13:23',
    1,
    '2026-05-07 14:08:23'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    117,
    101,
    '696744',
    '2026-05-07 14:17:40',
    0,
    '2026-05-07 14:12:39'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    118,
    101,
    '336103',
    '2026-05-07 14:28:42',
    0,
    '2026-05-07 14:23:42'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    119,
    101,
    '348292',
    '2026-05-07 14:35:05',
    0,
    '2026-05-07 14:30:05'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    120,
    101,
    '503873',
    '2026-05-07 14:46:05',
    0,
    '2026-05-07 14:41:05'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    121,
    101,
    '971089',
    '2026-05-07 15:00:23',
    0,
    '2026-05-07 14:55:22'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    122,
    101,
    '315953',
    '2026-05-07 15:07:21',
    1,
    '2026-05-07 15:02:21'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    123,
    101,
    '434662',
    '2026-05-07 15:14:21',
    1,
    '2026-05-07 15:09:21'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    124,
    101,
    '445969',
    '2026-05-22 11:00:57',
    0,
    '2026-05-22 10:55:57'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    125,
    101,
    '936794',
    '2026-05-24 12:33:10',
    1,
    '2026-05-24 12:28:10'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    126,
    101,
    '481675',
    '2026-05-24 13:26:28',
    0,
    '2026-05-24 13:21:27'
  );
INSERT INTO
  `password_resets` (
    `Id`,
    `UserId`,
    `OtpCode`,
    `ExpireAt`,
    `Verified`,
    `CreateAt`
  )
VALUES
  (
    127,
    101,
    '935891',
    '2026-05-24 13:26:30',
    1,
    '2026-05-24 13:21:30'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: payments
# ------------------------------------------------------------

INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    100,
    100,
    100,
    50.00,
    NULL,
    'aba',
    'paid',
    'PAY001',
    NULL,
    NULL,
    '2026-05-01 08:00:00',
    NULL,
    NULL,
    NULL,
    '2026-05-06 11:22:16',
    '2026-05-17 21:48:20',
    'Monthly',
    'March',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    101,
    101,
    101,
    55.00,
    NULL,
    'cash',
    'paid',
    'PAY002',
    NULL,
    NULL,
    '2026-05-01 08:10:00',
    NULL,
    NULL,
    NULL,
    '2026-05-06 11:22:16',
    '2026-05-17 21:48:33',
    'Monthly',
    'April',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    102,
    102,
    102,
    60.00,
    NULL,
    'aba',
    'pending',
    'PAY003',
    NULL,
    NULL,
    '2026-05-01 08:20:00',
    NULL,
    NULL,
    NULL,
    '2026-05-06 11:22:16',
    '2026-05-17 21:48:39',
    'Monthly',
    'April',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    103,
    103,
    103,
    65.00,
    NULL,
    'card',
    'paid',
    'PAY004',
    NULL,
    NULL,
    '2026-05-01 08:30:00',
    NULL,
    NULL,
    NULL,
    '2026-05-06 11:22:16',
    '2026-05-17 21:48:50',
    'Monthly',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    104,
    104,
    104,
    70.00,
    NULL,
    'aba',
    'failed',
    'PAY005',
    NULL,
    NULL,
    '2026-05-01 08:40:00',
    NULL,
    NULL,
    NULL,
    '2026-05-06 11:22:16',
    '2026-05-17 21:49:37',
    'Monthly',
    'Feb',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    106,
    100,
    100,
    120.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779440900549',
    NULL,
    'f6956f859f5a7f87ace8e4f24d69366a',
    '2026-05-22 16:08:21',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5919Bright Brain School6010Phnom Penh63044435',
    NULL,
    '2026-05-22 16:08:20',
    '2026-05-22 16:08:20',
    'Tuition Fee',
    'January',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    107,
    100,
    100,
    50.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779441437954',
    NULL,
    'f6956f859f5a7f87ace8e4f24d69366a',
    '2026-05-22 16:17:19',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5919Bright Brain School6010Phnom Penh63044435',
    NULL,
    '2026-05-22 16:17:18',
    '2026-05-22 16:17:18',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    108,
    100,
    100,
    50.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779441851010',
    NULL,
    'f6956f859f5a7f87ace8e4f24d69366a',
    '2026-05-22 16:24:12',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5919Bright Brain School6010Phnom Penh63044435',
    NULL,
    '2026-05-22 16:24:12',
    '2026-05-22 16:24:12',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    109,
    100,
    100,
    120.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1779442095007',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-22 16:28:16',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-22 16:28:15',
    '2026-05-27 22:32:23',
    'Tuition Fee',
    'January',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    110,
    100,
    100,
    50.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779442149406',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-22 16:29:10',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-22 16:29:10',
    '2026-05-22 16:29:10',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    111,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779442736825',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-22 16:39:09',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-22 16:39:08',
    '2026-05-22 16:39:08',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    112,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779442766652',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-22 16:39:27',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-22 16:39:26',
    '2026-05-22 16:39:26',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    113,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779459585054',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-22 21:19:45',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-22 21:19:45',
    '2026-05-22 21:19:45',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    114,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779459780175',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-22 21:23:00',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-22 21:23:00',
    '2026-05-22 21:23:00',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    115,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779459983824',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-22 21:26:24',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-22 21:26:23',
    '2026-05-22 21:26:23',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    116,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779598585163',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-24 11:56:26',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-24 11:56:26',
    '2026-05-24 11:56:26',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    117,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779719334991',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-25 21:28:56',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-25 21:28:56',
    '2026-05-25 21:28:56',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    118,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779811275995',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-26 23:01:18',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-26 23:01:18',
    '2026-05-26 23:01:18',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    119,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779811595114',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-26 23:06:37',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-26 23:06:37',
    '2026-05-26 23:06:37',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    120,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779811686141',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-26 23:08:08',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-26 23:08:08',
    '2026-05-26 23:08:08',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    121,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779811718775',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-26 23:08:41',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-26 23:08:40',
    '2026-05-26 23:08:40',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    122,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779811782502',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-26 23:09:45',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-26 23:09:44',
    '2026-05-26 23:09:44',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    123,
    100,
    100,
    10.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779814550077',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-26 23:55:52',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-26 23:55:51',
    '2026-05-26 23:55:51',
    'Tuition Fee',
    'January',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    124,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779895286801',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 22:21:28',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 22:21:28',
    '2026-05-27 22:21:28',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    125,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779895613646',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 22:26:56',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 22:26:55',
    '2026-05-27 22:26:55',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    126,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1779895959587',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 22:32:41',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 22:32:40',
    '2026-05-27 22:35:08',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    127,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779896731418',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 22:45:32',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 22:45:32',
    '2026-05-27 22:45:32',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    128,
    100,
    100,
    120.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779898105762',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 23:08:27',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 23:08:27',
    '2026-05-27 23:08:27',
    'Tuition Fee',
    'January',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    129,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779898124776',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 23:08:46',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 23:08:46',
    '2026-05-27 23:08:46',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    130,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779899178255',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 23:26:20',
    NULL,
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 23:26:20',
    '2026-05-27 23:26:20',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    131,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779899838260',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 23:37:21',
    '2026-05-27 23:42:21',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 23:37:20',
    '2026-05-27 23:37:20',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    132,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779900219260',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 23:43:40',
    '2026-05-27 23:48:40',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 23:43:39',
    '2026-05-27 23:43:39',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    133,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779900335740',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 23:45:37',
    '2026-05-27 23:50:37',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 23:45:36',
    '2026-05-27 23:45:36',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    134,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779900556326',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-27 23:49:17',
    '2026-05-27 23:54:17',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-27 23:49:17',
    '2026-05-27 23:49:17',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    135,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779943432198',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-28 11:43:53',
    '2026-05-28 11:48:53',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-28 11:43:52',
    '2026-05-28 11:43:52',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    136,
    100,
    100,
    120.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779954935488',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-28 14:55:37',
    '2026-05-28 15:00:37',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-28 14:55:36',
    '2026-05-28 14:55:36',
    'Tuition Fee',
    'January',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    137,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779955088141',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-28 14:58:09',
    '2026-05-28 15:03:09',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-28 14:58:08',
    '2026-05-28 14:58:08',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    138,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779956996953',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-28 15:29:58',
    '2026-05-28 15:34:58',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-28 15:29:57',
    '2026-05-28 15:29:57',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    139,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1779978677425',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-28 21:31:19',
    '2026-05-28 21:36:19',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-28 21:31:19',
    '2026-05-28 21:31:19',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    140,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780042181020',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-29 15:09:41',
    '2026-05-29 15:14:41',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-29 15:09:41',
    '2026-05-29 15:09:41',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    141,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780043239837',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-29 15:27:21',
    '2026-05-29 15:32:21',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-29 15:27:21',
    '2026-05-29 15:27:21',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    142,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780044482493',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-29 15:48:04',
    '2026-05-29 15:53:04',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-29 15:48:03',
    '2026-05-29 15:48:03',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    143,
    100,
    100,
    120.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780044624011',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-29 15:50:25',
    '2026-05-29 15:55:25',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-29 15:50:25',
    '2026-05-29 15:50:25',
    'Tuition Fee',
    'January',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    144,
    100,
    100,
    120.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780044993899',
    NULL,
    '03a3c467b65f16af770751f22a9022d2',
    '2026-05-29 15:56:35',
    '2026-05-29 16:01:35',
    '00020101021129210017sreyleak_mey@bkrt5204599953031165802KH5912Sreyleak Mey6010Svay Reing6304DB71',
    NULL,
    '2026-05-29 15:56:35',
    '2026-05-29 15:56:35',
    'Tuition Fee',
    'January',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    145,
    100,
    100,
    120.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780049487727',
    NULL,
    '5e7f66d8ba44c24bddce613206f1da3e',
    '2026-05-29 17:11:29',
    '2026-05-29 17:16:28',
    '00020101021229210017sreyleak_mey@bkrt52045999530384054031205802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800494877270711Tuition Fee9934001317800494882990113178013588829963043E9B',
    NULL,
    '2026-05-29 17:11:28',
    '2026-05-29 17:11:28',
    'Tuition Fee',
    'January',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    146,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780049824189',
    NULL,
    '914fc4f8b894c315b88397fa9a75b254',
    '2026-05-29 17:17:05',
    '2026-05-29 17:22:04',
    '00020101021229210017sreyleak_mey@bkrt52045999530384054035005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800498241890711Monthly Fee9934001317800498245000113178013622450063041590',
    NULL,
    '2026-05-29 17:17:04',
    '2026-05-29 17:17:04',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    147,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780050330778',
    NULL,
    '25a096971f0e17cfe32d7dcab6b01402',
    '2026-05-29 17:25:32',
    '2026-05-29 17:30:31',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800503307780711Monthly Fee993400131780050331450011317801367314506304567F',
    NULL,
    '2026-05-29 17:25:31',
    '2026-05-29 17:25:31',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    148,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780051568663',
    NULL,
    '844fa6c582ea0da8a3efe0bc94c85559',
    '2026-05-29 17:46:09',
    '2026-05-29 17:51:09',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800515686630711Monthly Fee9934001317800515691240113178013796912463047804',
    NULL,
    '2026-05-29 17:46:09',
    '2026-05-29 17:46:09',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    149,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780052694656',
    NULL,
    '39ac364265d42bd8a0393e8c92481288',
    '2026-05-29 18:04:55',
    '2026-05-29 18:09:55',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800526946560711Monthly Fee9934001317800526951780113178013909517863041D78',
    NULL,
    '2026-05-29 18:04:55',
    '2026-05-29 18:04:55',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    150,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1780053375485',
    'd0dd65ebb43c7b491f1f2353e4cd73205b5f44680bd73dd7f76a7e6ade1a91e1',
    '32fb10551a412f3bbb06828cf2402be6',
    '2026-05-29 18:16:36',
    '2026-05-29 18:21:15',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800533754850711Monthly Fee9934001317800533760080113178013977600863040E5C',
    NULL,
    '2026-05-29 18:16:16',
    '2026-05-29 18:16:36',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    151,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1780053963704',
    '1fc45326263231698ed6ab3ce9c21a38192888fd093a8eca158afdcd38d9902f',
    '3abb94d3d6baf89813c1236c4d116308',
    '2026-05-29 18:26:35',
    '2026-05-29 18:31:04',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800539637040711Monthly Fee993400131780053964220011317801403642206304361E',
    NULL,
    '2026-05-29 18:26:04',
    '2026-05-29 18:26:35',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    152,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780054090086',
    NULL,
    '2cffe51a5f61e69eb3ea8b7590dfb61b',
    '2026-05-29 18:28:11',
    '2026-05-29 18:33:10',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800540900860711Monthly Fee9934001317800540904470113178014049044763048E87',
    NULL,
    '2026-05-29 18:28:10',
    '2026-05-29 18:28:10',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    153,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780054110861',
    NULL,
    'ce2236c6214bd4f77bfc08f55d8e1cda',
    '2026-05-29 18:28:31',
    '2026-05-29 18:33:31',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800541108610711Monthly Fee9934001317800541111460113178014051114663048F21',
    NULL,
    '2026-05-29 18:28:31',
    '2026-05-29 18:28:31',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    154,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1780054210748',
    '43ac448ec93071184317c5ac29aeb5c19850acc9cf3e13696b92c3a546021db5',
    '157928b01efcc7109bf71d8d430ae796',
    '2026-05-29 18:30:31',
    '2026-05-29 18:35:11',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800542107480711Monthly Fee9934001317800542110750113178014061107563042EC9',
    NULL,
    '2026-05-29 18:30:11',
    '2026-05-29 18:30:31',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    155,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780054353360',
    NULL,
    '8fe5fd6236b8821e470fa13c2a117227',
    '2026-05-29 18:32:34',
    '2026-05-29 18:37:33',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800543533600711Monthly Fee9934001317800543538140113178014075381463040940',
    NULL,
    '2026-05-29 18:32:33',
    '2026-05-29 18:32:33',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    156,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780054373126',
    NULL,
    'd6fc2e1154cba7e67e2254726a1151ec',
    '2026-05-29 18:32:53',
    '2026-05-29 18:37:53',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800543731260711Monthly Fee9934001317800543733940113178014077339463044F04',
    NULL,
    '2026-05-29 18:32:53',
    '2026-05-29 18:32:53',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    157,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780054423716',
    NULL,
    '6b13d5023a34599e79fbdd62688bbaa2',
    '2026-05-29 18:33:44',
    '2026-05-29 18:38:44',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800544237160711Monthly Fee99340013178005442399601131780140823996630438D5',
    NULL,
    '2026-05-29 18:33:44',
    '2026-05-29 18:33:44',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    158,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780054445806',
    NULL,
    '80933cd3d3c5a51fea008c7e7e24256c',
    '2026-05-29 18:34:06',
    '2026-05-29 18:39:06',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800544458060711Monthly Fee9934001317800544460620113178014084606263042E7F',
    NULL,
    '2026-05-29 18:34:06',
    '2026-05-29 18:34:06',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    159,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1780054635454',
    '7989effa4d13f7f9da1b0c6480829619077b3636766d3a7866a4985452e4837d',
    '6978ad925b377102c12738f6b74851df',
    '2026-05-29 18:37:51',
    '2026-05-29 18:42:15',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17800546354540711Monthly Fee993400131780054635853011317801410358536304F490',
    NULL,
    '2026-05-29 18:37:15',
    '2026-05-29 18:37:51',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    160,
    101,
    102,
    500.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780145167185',
    NULL,
    '0caaa56dc00624ae338a6c5de65532a7',
    '2026-05-30 19:46:08',
    '2026-05-30 19:51:07',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17801451671850711Monthly Fee993400131780145167750011317802315677506304DAA6',
    NULL,
    '2026-05-30 19:46:07',
    '2026-05-30 19:46:07',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    161,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780145249936',
    NULL,
    '157f1b354202d2039c58d0f776710acf',
    '2026-05-30 19:47:30',
    '2026-05-30 19:52:30',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17801452499360711Monthly Fee993400131780145250336011317802316503366304B01B',
    NULL,
    '2026-05-30 19:47:30',
    '2026-05-30 19:47:30',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    162,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780200840882',
    NULL,
    '6d1172080d9d16a253c3b7be616d0932',
    '2026-05-31 11:14:02',
    '2026-05-31 11:19:01',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17802008408820711Monthly Fee993400131780200839766011317802872397666304FFAC',
    NULL,
    '2026-05-31 11:14:01',
    '2026-05-31 11:14:01',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    163,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1780209044812',
    '19c09acf30a3a62f7647860cb638c9e924ec4860de5c33ca59cf8165afdd7168',
    '0f9172b324308da0dac2731ace23797b',
    '2026-05-31 13:31:09',
    '2026-05-31 13:35:45',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17802090448120711Monthly Fee9934001317802090439640113178029544396463048A6F',
    NULL,
    '2026-05-31 13:30:47',
    '2026-05-31 13:31:09',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    164,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780209206504',
    NULL,
    '218b4315a9b59e8b6a87c5c1dbbb02f5',
    '2026-05-31 13:33:27',
    '2026-05-31 13:38:27',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17802092065040711Monthly Fee9934001317802092051920113178029560519263047376',
    NULL,
    '2026-05-31 13:33:27',
    '2026-05-31 13:33:27',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    165,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780210179882',
    NULL,
    '6d8f4c9967880811d3aac378eaae849a',
    '2026-05-31 13:49:41',
    '2026-05-31 13:54:40',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17802101798820711Monthly Fee993400131780210180747011317802965807476304FE77',
    NULL,
    '2026-05-31 13:49:40',
    '2026-05-31 13:49:40',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    166,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780215587937',
    NULL,
    '4f87cd416b5ac45cde5a779d23471c3c',
    '2026-05-31 15:19:54',
    '2026-05-31 15:24:48',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17802155879370711Monthly Fee9934001317802155919920113178030199199263040491',
    NULL,
    '2026-05-31 15:19:53',
    '2026-05-31 15:19:53',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    167,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1780327802609',
    'ceec75671cfdb79a9e652c64615f44d4edfa6de452fc966d69e5658d7a83e107',
    'fa596855f78c60b984340a439b9e25f3',
    '2026-06-01 22:30:15',
    '2026-06-01 22:35:03',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17803278026090711Monthly Fee993400131780327802789011317804142027896304F5CB',
    NULL,
    '2026-06-01 22:30:03',
    '2026-06-01 22:30:15',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    168,
    101,
    102,
    100.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1780328179523',
    'b097c58d65facc9e8d4d3f39c1c0586911b5e3a5f7a3d6832e8a2f93f23308cd',
    'aac8ebf01f391bf9eb7be548f4f46fd5',
    '2026-06-01 22:36:41',
    '2026-06-01 22:41:20',
    '00020101021229210017sreyleak_mey@bkrt52045999530311654031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17803281795230711Monthly Fee9934001317803281797390113178041457973963042BB5',
    NULL,
    '2026-06-01 22:36:20',
    '2026-06-01 22:36:47',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    1
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    169,
    101,
    100,
    35.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780329084913',
    NULL,
    'b2a91b87a125993bddc0f520d17afbbc',
    '2026-06-01 22:51:26',
    '2026-06-01 22:56:25',
    '00020101021229210017sreyleak_mey@bkrt5204599953038405402355802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17803290849130711Monthly Fee9934001317803290852230113178041548522363049D5D',
    NULL,
    '2026-06-01 22:51:25',
    '2026-06-01 22:51:25',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    170,
    101,
    100,
    0.00,
    'USD',
    'bakong',
    'paid',
    'TXN-1780329230877',
    'f82137b43c8dd2eeb25b46b351d99850f1e1d1139a8d6c9096e6aa7411574cba',
    'cf698189af577232152a3eccd2b888e7',
    '2026-06-01 22:54:12',
    '2026-06-01 22:58:51',
    '00020101021129210017sreyleak_mey@bkrt5204599953038405802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17803292308770711Monthly Fee99170013178032923103363049CB2',
    NULL,
    '2026-06-01 22:53:51',
    '2026-06-01 22:54:13',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    1
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    171,
    101,
    100,
    0.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780458161082',
    NULL,
    'f9b194672ac7f781954a50c1d14cc281',
    '2026-06-03 10:42:42',
    '2026-06-03 10:47:41',
    '00020101021129210017sreyleak_mey@bkrt5204599953038405802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17804581610820711Monthly Fee9917001317804581614256304513E',
    NULL,
    '2026-06-03 10:42:41',
    '2026-06-03 10:42:41',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    172,
    101,
    100,
    100.00,
    'USD',
    'bakong',
    'pending',
    'TXN-1780458731966',
    NULL,
    'eb1dab876f28dd285b669146ae37ef87',
    '2026-06-03 10:52:12',
    '2026-06-03 10:57:12',
    '00020101021229210017sreyleak_mey@bkrt52045999530384054031005802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17804587319660711Monthly Fee9934001317804587322720113178054513227263044CBE',
    NULL,
    '2026-06-03 10:52:12',
    '2026-06-03 10:52:12',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    0
  );
INSERT INTO
  `payments` (
    `Id`,
    `StudentId`,
    `FeeId`,
    `Amount`,
    `Currency`,
    `PaymentMethod`,
    `Status`,
    `TransactionId`,
    `ProviderTransactionId`,
    `Md5`,
    `PaymentDate`,
    `ExpireAt`,
    `QrData`,
    `Remark`,
    `CreateAt`,
    `UpdatedAt`,
    `PaymentType`,
    `Months`,
    `ReceiptNo`,
    `PaidBy`,
    `TelegramSent`
  )
VALUES
  (
    173,
    101,
    100,
    0.01,
    'USD',
    'bakong',
    'paid',
    'TXN-1780458879183',
    'f554804457392f66a38a91eb47470626e8d43b8c9d50e0de87e1a0cc04fc844a',
    'af9885fdcd9089620d8ea115243c8b4e',
    '2026-06-03 10:55:05',
    '2026-06-03 10:59:39',
    '00020101021229210017sreyleak_mey@bkrt52045999530384054040.015802KH5912Sreyleak Mey6010Svay Reing62590319Bright Brain School0117INV-17804588791830711Monthly Fee993400131780458879659011317805452796596304F9D1',
    NULL,
    '2026-06-03 10:54:40',
    '2026-06-03 10:55:06',
    'Monthly Fee',
    'May',
    NULL,
    NULL,
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: programs
# ------------------------------------------------------------

INSERT INTO
  `programs` (`Id`, `ProgramName`, `Description`, `CreateAt`)
VALUES
  (
    100,
    'English Full Time',
    NULL,
    '2026-05-24 22:11:13'
  );
INSERT INTO
  `programs` (`Id`, `ProgramName`, `Description`, `CreateAt`)
VALUES
  (
    101,
    'English Part Time',
    NULL,
    '2026-05-24 22:11:13'
  );
INSERT INTO
  `programs` (`Id`, `ProgramName`, `Description`, `CreateAt`)
VALUES
  (102, 'Khmer Full Time', NULL, '2026-05-24 22:11:13');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: refresh_tokens
# ------------------------------------------------------------

INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    100,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgxMjg0MjksImV4cCI6MTc3ODczMzIyOX0.LyD2Vtix3K0WCXWfq128Aku8eIyTLQ8yIaM0i30OgEQ',
    '2026-05-08 11:33:50',
    '2026-05-07 11:33:49'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    101,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgxMjg2MTEsImV4cCI6MTc3ODczMzQxMX0.JuL4dFIzMoPZLaAb01-gjrKxn8TRELU57vOXE6WGfgc',
    '2026-05-08 11:36:51',
    '2026-05-07 11:36:51'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    102,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgxMjg2ODUsImV4cCI6MTc3ODczMzQ4NX0.dEcs1CMQ6cwSx0bK1hFyaIbOA_McWK2DL7pPpC5bylc',
    '2026-05-08 11:38:05',
    '2026-05-07 11:38:05'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    103,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODEzMTY3MCwiZXhwIjoxNzc4NzM2NDcwfQ.q2qNsgvoEb6zGqHwu2JfDe-c2hP9P0-IOL7WVnerNQc',
    '2026-05-08 12:27:50',
    '2026-05-07 12:27:50'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    104,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODEzNTE3OCwiZXhwIjoxNzc4NzM5OTc4fQ.a27JFQHf4sTdJd1zDNT1lPzJ4HHvX58M46OUaqD7s8A',
    '2026-05-08 13:26:19',
    '2026-05-07 13:26:18'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    105,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODEzNTIwOCwiZXhwIjoxNzc4NzQwMDA4fQ.NkSHQw2YLO685iQl9SZcBBjw2iU0pM2Jp_t6KR4rSQc',
    '2026-05-08 13:26:49',
    '2026-05-07 13:26:48'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    106,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODEzNTM1MiwiZXhwIjoxNzc4NzQwMTUyfQ.wnMzXUrcMfPoX8LWBJsAQfi4I7JW6InRPOU3My_WvxM',
    '2026-05-08 13:29:13',
    '2026-05-07 13:29:13'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    107,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODE0MTM0MywiZXhwIjoxNzc4NzQ2MTQzfQ.IF5Fa1ZTHZ_7gmzrV9f049fptE9NkTGxHhHfOGKbJNY',
    '2026-05-08 15:09:04',
    '2026-05-07 15:09:03'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    108,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgxNDE1MDAsImV4cCI6MTc3ODc0NjMwMH0.KgPjuMwNw4V-R5kRmSpRbDRQVsItjDF0SBIFJDP4OAE',
    '2026-05-08 15:11:40',
    '2026-05-07 15:11:40'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    109,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgxNjIzNjUsImV4cCI6MTc3ODc2NzE2NX0.BvAV58Mzx3lysaBzQefzIqYsda_qQgfm4QJVcFI7nj0',
    '2026-05-08 20:59:25',
    '2026-05-07 20:59:25'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    110,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgxNjM5NDUsImV4cCI6MTc3ODc2ODc0NX0.fMWW5tKo7F3_37yNZFgivhlNfJ8DlMBoZ6QUtqE0y6k',
    '2026-05-08 21:25:46',
    '2026-05-07 21:25:45'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    111,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgyMTM1NDMsImV4cCI6MTc3ODgxODM0M30.VJw7c6WDEhUmLeZBm7TTOq4Yj5ZWsA5eE2tDHfRWOMQ',
    '2026-05-09 11:12:23',
    '2026-05-08 11:12:23'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    112,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgyMTU0MDYsImV4cCI6MTc3ODgyMDIwNn0.ErbKIWHNP-kwQr0vAhSvqlmIX3U9V2VMISX7Y5vfCCQ',
    '2026-05-09 11:43:26',
    '2026-05-08 11:43:26'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    113,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgyMTcwMTEsImV4cCI6MTc3ODgyMTgxMX0.q-gRJVEPcOYzw8ySdg3yYyzQ0c0AFv0PgJyniPTX_NA',
    '2026-05-09 12:10:11',
    '2026-05-08 12:10:11'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    114,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgyMTkzMDEsImV4cCI6MTc3ODgyNDEwMX0.KHawfp3U3sLapW0vmD9txFpqLDWzJUeZYaRh9qJ4o4E',
    '2026-05-09 12:48:22',
    '2026-05-08 12:48:21'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    115,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgyMjIyNDAsImV4cCI6MTc3ODgyNzA0MH0.J0RNVhi6cqxvA4JArFk8M--GJ32tVSJLqq4FxBjuHkA',
    '2026-05-09 13:37:20',
    '2026-05-08 13:37:20'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    116,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgyMjUzNjQsImV4cCI6MTc3ODgzMDE2NH0.6uro6Iq1RxYSeo0myMxCp96s9se2tKz_-M6DxOqd7Y0',
    '2026-05-09 14:29:25',
    '2026-05-08 14:29:24'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    117,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgzMTQ3MDgsImV4cCI6MTc3ODkxOTUwOH0.RVJpZ87VCBQgZFXsIQdjoZYaFW22KEek9eS4JsgrUqw',
    '2026-05-10 15:18:28',
    '2026-05-09 15:18:28'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    118,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgzMTgyNDMsImV4cCI6MTc3ODkyMzA0M30.gH1jXeam2k2Tcpc2n4rXshjwq8wXyaHCKr3T4ZMGbAs',
    '2026-05-10 16:17:24',
    '2026-05-09 16:17:23'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    119,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgzMTgzMzUsImV4cCI6MTc3ODkyMzEzNX0.MLvn5WZIUuMD_Jvh8K6wwj2RTjepdXIoCEhWnDyEab0',
    '2026-05-10 16:18:56',
    '2026-05-09 16:18:55'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    120,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgzMTkwMTksImV4cCI6MTc3ODkyMzgxOX0.TZMm3y-qeI2fffSpM4_Hc0qeNtGvMbdHCU7bUd89sZY',
    '2026-05-10 16:30:20',
    '2026-05-09 16:30:19'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    121,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODMyMjMyNywiZXhwIjoxNzc4OTI3MTI3fQ.nWODQkLNYxkPcPJl2Z2Dyc_QkEOtqOgqep1DqFaYFU4',
    '2026-05-10 17:25:27',
    '2026-05-09 17:25:27'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    122,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgzMjk5NTcsImV4cCI6MTc3ODkzNDc1N30.F5B4LFLxPzLPsFeYYZYt-BWqhlt3ygtSi4hfH10xp-c',
    '2026-05-10 19:32:37',
    '2026-05-09 19:32:37'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    123,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgzNjkzNDMsImV4cCI6MTc3ODk3NDE0M30.YX_HAbTxR4fFT1t6oXYA0a1hau94c8g7gMnGv1ZwcD0',
    '2026-05-11 06:29:03',
    '2026-05-10 06:29:03'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    124,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgzNjk3NzYsImV4cCI6MTc3ODk3NDU3Nn0.j5m-TI3KD3oVzG0ovV_M881_WdWf9HaVKQyWac3kdWk',
    '2026-05-11 06:36:17',
    '2026-05-10 06:36:16'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    125,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgzNzA5NTMsImV4cCI6MTc3ODk3NTc1M30.IZXibCkhiCmg-2_tDUdBdu8_zIfRG2N9bvA4krtJKps',
    '2026-05-11 06:55:54',
    '2026-05-10 06:55:53'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    126,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODM4OTk2NywiZXhwIjoxNzc4OTk0NzY3fQ.Vi1OaZOc055VkA9N5UhmX1uPsfemNopGcj9ED2FaGdQ',
    '2026-05-11 12:12:47',
    '2026-05-10 12:12:47'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    127,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODM5MDEyOCwiZXhwIjoxNzc4OTk0OTI4fQ.QJAZSu2GWtTWSBKcfiHQQqfh0pwpS_mdThMIfIiETIE',
    '2026-05-11 12:15:28',
    '2026-05-10 12:15:28'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    128,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzgzOTAxOTgsImV4cCI6MTc3ODk5NDk5OH0.5gjkwLzvQrspEZDAxm96Osmq9z5tIgDo60Ww7b_Za74',
    '2026-05-11 12:16:38',
    '2026-05-10 12:16:38'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    129,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODQ3ODQ5NSwiZXhwIjoxNzc5MDgzMjk1fQ.KACRATpMkJRQnhkUQZC36V2BwY9-rb-Ljn1ShrJ1X7s',
    '2026-05-12 12:48:16',
    '2026-05-11 12:48:15'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    130,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODQ3ODU0MiwiZXhwIjoxNzc5MDgzMzQyfQ.c2OSzyUeobV3Tv7GyPYNv35APuOyfjSwGB4pjNoJErQ',
    '2026-05-12 12:49:02',
    '2026-05-11 12:49:02'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    131,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODQ4Mjg5OSwiZXhwIjoxNzc5MDg3Njk5fQ.dNWIbv3Qmu9yU5uxFZPKc1pKk92xsUKoDctBW_rlAhI',
    '2026-05-12 14:01:40',
    '2026-05-11 14:01:39'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    132,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg0ODI5NTcsImV4cCI6MTc3OTA4Nzc1N30.Dhv8T8rtySfTN-cvhJwfc7dys0ToCo7SxYduwiipMKA',
    '2026-05-12 14:02:38',
    '2026-05-11 14:02:37'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    133,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg0ODQ2NjAsImV4cCI6MTc3OTA4OTQ2MH0.wOWYkuBmVPjxysySlm91aONkGx4yOlCyf1VwqZqkRds',
    '2026-05-12 14:31:01',
    '2026-05-11 14:31:00'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    134,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg0ODQ2OTAsImV4cCI6MTc3OTA4OTQ5MH0.XzBPANJw9amf-g9v76imIOUvqhyt9E4_XphAWVO5bCw',
    '2026-05-12 14:31:30',
    '2026-05-11 14:31:30'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    135,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg0ODYyMzUsImV4cCI6MTc3OTA5MTAzNX0.yK39d4CBfNzOUGf27c52rkT0wOQbHwPekIqUX1LURd0',
    '2026-05-12 14:57:15',
    '2026-05-11 14:57:15'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    136,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg0ODc3NzksImV4cCI6MTc3OTA5MjU3OX0.gEYGYJVeWQfaDLa4Oq1jQ67DjlQxzEW0r12U4pzSplE',
    '2026-05-12 15:23:00',
    '2026-05-11 15:22:59'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    137,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODQ5NTYwNywiZXhwIjoxNzc5MTAwNDA3fQ.SpRzuKJvSDTvwFzrZ8FGWo9zevke3IWv_q1BXWzQqLo',
    '2026-05-12 17:33:28',
    '2026-05-11 17:33:27'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    138,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg0OTU2NzAsImV4cCI6MTc3OTEwMDQ3MH0.ibfOjHZF-2CxA3s92SrSlTMLXMwM4qELjiEZYw-1ks4',
    '2026-05-12 17:34:31',
    '2026-05-11 17:34:30'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    139,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODQ5NTY5NSwiZXhwIjoxNzc5MTAwNDk1fQ.bXQ1_1ggs8U-qork40i3xHI4Qe43aDndzvnaLmJSNfc',
    '2026-05-12 17:34:55',
    '2026-05-11 17:34:55'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    140,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg0OTg5NjEsImV4cCI6MTc3OTEwMzc2MX0.-ITU_c4poduWezEnT_fLpdoMscSyKGK1EeXFJZkYoAI',
    '2026-05-12 18:29:22',
    '2026-05-11 18:29:22'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    141,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODUwMDAxNywiZXhwIjoxNzc5MTA0ODE3fQ.05EE2u0_8KHWpySDPjLhHzV-wpV04mNcHNO-j6nqgls',
    '2026-05-12 18:46:57',
    '2026-05-11 18:46:57'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    142,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg1MDAyOTQsImV4cCI6MTc3OTEwNTA5NH0.mRgi2X4TX2v14ko0R781CLJNMv36vjKA7V0-7m6lyik',
    '2026-05-12 18:51:35',
    '2026-05-11 18:51:34'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    143,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg1MDkzMDYsImV4cCI6MTc3OTExNDEwNn0.tpINq5gnMputIymfItZJO4gYfbsYNG2mX2p4QZGBKto',
    '2026-05-12 21:21:47',
    '2026-05-11 21:21:46'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    144,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODUxMDU3MiwiZXhwIjoxNzc5MTE1MzcyfQ.0CSIql4FXqjmxwRycNkEzkLrU4c-9XG6hcs1dENZPkI',
    '2026-05-12 21:42:53',
    '2026-05-11 21:42:52'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    145,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODUxMDU4OCwiZXhwIjoxNzc5MTE1Mzg4fQ.o9PuJbYf6C0vAQm3bwuB1zTHMN7VdjXWGOf8XTDPiEo',
    '2026-05-12 21:43:08',
    '2026-05-11 21:43:08'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    146,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg1MTA3MDQsImV4cCI6MTc3OTExNTUwNH0.cHtUYVQhe92ANsvwwQi7aQICt6ScemZ4upSNPU35MLM',
    '2026-05-12 21:45:05',
    '2026-05-11 21:45:04'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    147,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg3MjY3NzcsImV4cCI6MTc3OTMzMTU3N30.2v4evBPKyOY-BM7LuYfFKd7XIED1ja9jVFB0sl9-eSU',
    '2026-05-15 09:46:18',
    '2026-05-14 09:46:17'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    148,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzg3MjcxMDUsImV4cCI6MTc3OTMzMTkwNX0.c0U1ioTNeOzucYeuccDsL62uknt6gwH4VKDDxslbRtY',
    '2026-05-15 09:51:45',
    '2026-05-14 09:51:45'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    149,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg3MzQ2NDUsImV4cCI6MTc3OTMzOTQ0NX0.3JGDrCSco0CHnHywO8snNSsRUP0smcphl8JxRo6KjFw',
    '2026-05-15 11:57:26',
    '2026-05-14 11:57:25'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    150,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODczNjg4OCwiZXhwIjoxNzc5MzQxNjg4fQ.UiKI3OQs64lmDeuQksdQNvHKkkuKYku5OLlSrEa9rTs',
    '2026-05-15 12:34:48',
    '2026-05-14 12:34:48'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    151,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODczNjkwMiwiZXhwIjoxNzc5MzQxNzAyfQ.yoYrmAvE6p9hUQAnLwSmHMVcPkZQdN0b--LzkcgtIhY',
    '2026-05-15 12:35:03',
    '2026-05-14 12:35:02'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    152,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg3MzY5NDQsImV4cCI6MTc3OTM0MTc0NH0.m4pg7R6bdf71Zk8fQmoQaRcMuQExdZROA72uIzklW-8',
    '2026-05-15 12:35:45',
    '2026-05-14 12:35:44'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    153,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg3NDIyMzAsImV4cCI6MTc3OTM0NzAzMH0.wcEXhGLQQA6_IAO-86xmmt5DkEskaQL1SeXoBRjL_tc',
    '2026-05-15 14:03:50',
    '2026-05-14 14:03:50'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    154,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg3NDIyNTcsImV4cCI6MTc3OTM0NzA1N30.rg0pbZKRzL6kw76g9eM_BGOPBR6UkoJgAxTMpwEAPXk',
    '2026-05-15 14:04:18',
    '2026-05-14 14:04:17'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    155,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg3NDM4NjgsImV4cCI6MTc3OTM0ODY2OH0.YL3t-8jVFaf6dU1eJCfgtVvbw-wDiX3b2KgyVMl5-cA',
    '2026-05-15 14:31:08',
    '2026-05-14 14:31:08'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    156,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg3NjkyOTQsImV4cCI6MTc3OTM3NDA5NH0.imVYH3ji3hRZ2j2w8C8rx2t3mxR52n-yM28JKh664PI',
    '2026-05-15 21:34:55',
    '2026-05-14 21:34:54'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    157,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg4MTYzMDksImV4cCI6MTc3OTQyMTEwOX0.NXRxDlWCHtuA3JJJfeZAG4Xv2OtfxPh-mQE1c35zLbo',
    '2026-05-16 10:38:29',
    '2026-05-15 10:38:29'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    158,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg4MTY1MjUsImV4cCI6MTc3OTQyMTMyNX0.27FpHgG6V09-0gf_d-ALyznlsxzNoGO7-uGMXZdGPII',
    '2026-05-16 10:42:06',
    '2026-05-15 10:42:05'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    159,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODgyMDcxMiwiZXhwIjoxNzc5NDI1NTEyfQ.va_99bJNm6ULUBAHbwDjGQmTH4d5TQoVOTtby9rgle4',
    '2026-05-16 11:51:53',
    '2026-05-15 11:51:52'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    160,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3ODgyMDc0MywiZXhwIjoxNzc5NDI1NTQzfQ.AMLf3FyIgwwsJIqeAnPBgJp8BLlZCS2U1a8AaIqtFoA',
    '2026-05-16 11:52:23',
    '2026-05-15 11:52:23'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    161,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzg4MjA3ODYsImV4cCI6MTc3OTQyNTU4Nn0.XWOZIp-kjivYxUvxZ6uX76vihVIyXweVpy-L-bHdP8U',
    '2026-05-16 11:53:07',
    '2026-05-15 11:53:06'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    162,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODgyMTMzMywiZXhwIjoxNzc5NDI2MTMzfQ.xc2UsLAU8phuS9OzVGLHilS7DPvn6-8T1P_usKn4zRc',
    '2026-05-16 12:02:13',
    '2026-05-15 12:02:13'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    163,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3ODgyMjMxOCwiZXhwIjoxNzc5NDI3MTE4fQ.mJuMYdB85YpPZDCEvt6_KUssAxUDWNYmz_WMfyOk9MQ',
    '2026-05-16 12:18:39',
    '2026-05-15 12:18:38'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    164,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg4MjIzNzAsImV4cCI6MTc3OTQyNzE3MH0.5A1drSS9V-85L4Me_V0koVx7hDNhxP1VMF-lREt1hsY',
    '2026-05-16 12:19:31',
    '2026-05-15 12:19:30'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    165,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg4MjI3NzksImV4cCI6MTc3OTQyNzU3OX0.hYe1MZqt0ZSPnWkke1dhukP3yYMkHtnY6suCprpAey0',
    '2026-05-16 12:26:20',
    '2026-05-15 12:26:19'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    166,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg4MjQwMTQsImV4cCI6MTc3OTQyODgxNH0.KNIHqHWdCOHoQuQeZ9MqXzwem0nTepfnn0JXzGOA1Ho',
    '2026-05-16 12:46:55',
    '2026-05-15 12:46:54'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    167,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg4Mjk3NDUsImV4cCI6MTc3OTQzNDU0NX0.qR_-QnPWR0XhvOcTXzs5-O26dQPo61UbMll9wvfM3Rk',
    '2026-05-16 14:22:25',
    '2026-05-15 14:22:25'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    168,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg5Mzk0MjcsImV4cCI6MTc3OTU0NDIyN30.3nPxZr7oc9x7_5U1Kb201xZUrd0_2VdfQZiQ0dLzNE0',
    '2026-05-17 20:50:28',
    '2026-05-16 20:50:27'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    169,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg5OTQwODMsImV4cCI6MTc3OTU5ODg4M30.aD__JADOa1om7H0IlDLxqYJ7DH2_1brUuCuHlKQ7REM',
    '2026-05-18 12:01:23',
    '2026-05-17 12:01:23'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    170,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzg5OTUyOTEsImV4cCI6MTc3OTYwMDA5MX0.KiPACU31MVLmmRWQs8WBY2Er81UoR0bJLU7N7nqnJ2A',
    '2026-05-18 12:21:32',
    '2026-05-17 12:21:31'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    171,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkwMDgzMDEsImV4cCI6MTc3OTYxMzEwMX0.6TwloxKzF3YvOSfPpHQbCfpG5dicBRqiock7BMxAuDQ',
    '2026-05-18 15:58:22',
    '2026-05-17 15:58:21'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    172,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkwMDg4NTksImV4cCI6MTc3OTYxMzY1OX0.iACTGLhcI8BFb48i-SvP8bNceBb3sqPWz_U9OgxvBlM',
    '2026-05-18 16:07:40',
    '2026-05-17 16:07:39'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    173,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkwMDkwMDIsImV4cCI6MTc3OTYxMzgwMn0.I_gSqX79KsQlFZ4IWSUQeba6Rmt7Ojuf4GbxmvILgm8',
    '2026-05-18 16:10:02',
    '2026-05-17 16:10:02'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    174,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkwMDkwNzksImV4cCI6MTc3OTYxMzg3OX0.WZs8AzKcaPco9-x1wjRUZfIb0kkmEdHbZHxe_0mydwg',
    '2026-05-18 16:11:19',
    '2026-05-17 16:11:19'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    175,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3OTAwOTA5MiwiZXhwIjoxNzc5NjEzODkyfQ.xGEMh1D9icx-hBbRt-lF6KwxmQjqmZLyuzw8MpJ-7R0',
    '2026-05-18 16:11:32',
    '2026-05-17 16:11:32'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    176,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkwMDkzMDgsImV4cCI6MTc3OTYxNDEwOH0.9vNmsJzW9wSrIMf4mBRcG5R6y5qUgKTyRvne4hrS9mU',
    '2026-05-18 16:15:09',
    '2026-05-17 16:15:08'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    177,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkwMjkwNzEsImV4cCI6MTc3OTYzMzg3MX0.5vrPCzRL6G5TdL7wfgNrXGtyBsCtQyFLDCxMKpeHcDs',
    '2026-05-18 21:44:32',
    '2026-05-17 21:44:31'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    178,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3OTAyOTc5NSwiZXhwIjoxNzc5NjM0NTk1fQ.MHs9aI8SlRC4zwhPNpg4Gtiocs9VaGqpRHc77wGyFho',
    '2026-05-18 21:56:36',
    '2026-05-17 21:56:35'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    179,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3OTExMjI2NywiZXhwIjoxNzc5NzE3MDY3fQ.cM7I8fSmRrKsBMwEGeXkIwpMETsR35Xefd6G4CzIwE4',
    '2026-05-19 20:51:07',
    '2026-05-18 20:51:07'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    180,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkxMTIyNzUsImV4cCI6MTc3OTcxNzA3NX0.WJJcgCCWzZS6udiSBkNAS1z-mAT_Vrfpvsw0WBuNNJA',
    '2026-05-19 20:51:15',
    '2026-05-18 20:51:15'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    181,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkxMTQzMzcsImV4cCI6MTc3OTcxOTEzN30.qZvyMmdFLlTXfu2Q18o4H1VUWnol6ARmoRKAfI3eciQ',
    '2026-05-19 21:25:37',
    '2026-05-18 21:25:37'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    182,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkxNzE5MTUsImV4cCI6MTc3OTc3NjcxNX0.TlGVueZQhRbTERiF-t74cBuAFqMUazEf3Zzf5jvDbLA',
    '2026-05-20 13:25:15',
    '2026-05-19 13:25:15'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    183,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkxNzY0MDMsImV4cCI6MTc3OTc4MTIwM30.5rIF2V9y0BrWr6jdgzS2oqJx5Dl1RqkOJQvKokKKdlc',
    '2026-05-20 14:40:03',
    '2026-05-19 14:40:03'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    184,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkxODQzNDcsImV4cCI6MTc3OTc4OTE0N30.mcP6HJlj9RFRHh6LTH8tFLfmM-FtTsBKWh5FFxUIdo0',
    '2026-05-20 16:52:28',
    '2026-05-19 16:52:27'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    185,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkxODQ4MzAsImV4cCI6MTc3OTc4OTYzMH0.N0i0bVt1qeZbvdqgeOkvBt50lujCX5hJKduw3S6fGCk',
    '2026-05-20 17:00:31',
    '2026-05-19 17:00:30'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    186,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkxOTk5MzMsImV4cCI6MTc3OTgwNDczM30.Sv4At-45N2wgF3EVnudHQU8MPBVZIw0FvGEVGQrZHoM',
    '2026-05-20 21:12:14',
    '2026-05-19 21:12:13'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    187,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3NzkyMDI3ODQsImV4cCI6MTc3OTgwNzU4NH0.Hfbvp0YgEg0Evt_WX4gUrZC6cHCEh8vwaiYbTbRL14A',
    '2026-05-20 21:59:44',
    '2026-05-19 21:59:44'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    188,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3OTIwMjgxNCwiZXhwIjoxNzc5ODA3NjE0fQ.SAKnv1l-P05J1uuKIR1zLiYx7tfK-9X7nLKGew2cL-Q',
    '2026-05-20 22:00:15',
    '2026-05-19 22:00:14'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    189,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkyMDMzNzIsImV4cCI6MTc3OTgwODE3Mn0.O9YObT5EUOEjILb2CA1_RO1J5Kz2jfoR2bICuo2Dx0s',
    '2026-05-20 22:09:33',
    '2026-05-19 22:09:32'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    190,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTIwMzM4NywiZXhwIjoxNzc5ODA4MTg3fQ.2Aez4erIuaeISoofelO-kt1PsXcPUTvg7fTGUasp1og',
    '2026-05-20 22:09:47',
    '2026-05-19 22:09:47'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    191,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTI0Mjk1OCwiZXhwIjoxNzc5ODQ3NzU4fQ._KuI_CIwH2Z76Tn4G46JcRbgrZzS2YsDZcszTap9-ug',
    '2026-05-21 09:09:19',
    '2026-05-20 09:09:18'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    192,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkyNDI5ODQsImV4cCI6MTc3OTg0Nzc4NH0.fpg0-XCTvyTTJWhB5gbHo7I3MGmS-SCS0L_6-C6--BQ',
    '2026-05-21 09:09:45',
    '2026-05-20 09:09:44'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    193,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkyNTM1MTgsImV4cCI6MTc3OTg1ODMxOH0.01XTOPuQ9Xb086izZSevPn3sPQ2be7QJWxkOu_5mH8E',
    '2026-05-21 12:05:18',
    '2026-05-20 12:05:18'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    194,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkyODUzNDEsImV4cCI6MTc3OTg5MDE0MX0.yNR_1A7NDvFW2kTJfhmcGEMf96wQ-Bi17p39XPkaV_g',
    '2026-05-21 20:55:41',
    '2026-05-20 20:55:41'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    195,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkzMzQwNDMsImV4cCI6MTc3OTkzODg0M30.wvhXQ0inBwq0z8E1iOdIpsKx1YaGR6GG9aVAR162bzU',
    '2026-05-22 10:27:24',
    '2026-05-21 10:27:23'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    196,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkzNDY1ODIsImV4cCI6MTc3OTk1MTM4Mn0.8h-nzbBAl5s3U6hxbZFNIR6Frp6XBkkcNTRTamFqhII',
    '2026-05-22 13:56:22',
    '2026-05-21 13:56:22'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    197,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk0MjEzODIsImV4cCI6MTc4MDAyNjE4Mn0.kmOJRXe3i0YEn-EHC5CSnXKlFiEPg2Mc8TWhK3c89Vo',
    '2026-05-23 10:43:02',
    '2026-05-22 10:43:02'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    198,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk0MjE2NDAsImV4cCI6MTc4MDAyNjQ0MH0.z0ASmYlZk6yss7AH3jhqBn893KtKoqMtsQbYLknbvck',
    '2026-05-23 10:47:20',
    '2026-05-22 10:47:20'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    199,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTQyMTk0NSwiZXhwIjoxNzgwMDI2NzQ1fQ.VCakG-PHPqwh_Ur4Q_XYQuWkI_VSXp07ypq9oHwTWiA',
    '2026-05-23 10:52:25',
    '2026-05-22 10:52:25'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    200,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3OTQyMTk1NCwiZXhwIjoxNzgwMDI2NzU0fQ.ki81iDcwoqn8UBRda79qCOk8qSjpoXfypCP-APGb77Q',
    '2026-05-23 10:52:35',
    '2026-05-22 10:52:34'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    201,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk0Mjc4NjYsImV4cCI6MTc4MDAzMjY2Nn0.ruZHcylKqJBMyWacDWxlxQso75BqrB6KH1pvOn4ePI4',
    '2026-05-23 12:31:07',
    '2026-05-22 12:31:06'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    202,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk0MjgwNzgsImV4cCI6MTc4MDAzMjg3OH0.wdDfHxqVVZAGn2TuLjDjJY_VIQYT55UPG6s0RamweGg',
    '2026-05-23 12:34:39',
    '2026-05-22 12:34:38'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    203,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk0MzEwMTAsImV4cCI6MTc4MDAzNTgxMH0.GnLJn5XlK9tb6Wa9Zj2YFvoGorh2QY4eu3HaJgmUzrY',
    '2026-05-23 13:23:30',
    '2026-05-22 13:23:30'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    204,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk0MzExNDIsImV4cCI6MTc4MDAzNTk0Mn0.fbxd8UDNyZXRz--9M6HPSj-ZNPPmJosRiEQUn8pI3aE',
    '2026-05-23 13:25:42',
    '2026-05-22 13:25:42'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    205,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTQzMTE4NiwiZXhwIjoxNzgwMDM1OTg2fQ.JdhsnC_EolwaJttA3yYB1yvfnHQi75WMJSs2H343CWo',
    '2026-05-23 13:26:26',
    '2026-05-22 13:26:26'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    206,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTQzNzAwNywiZXhwIjoxNzgwMDQxODA3fQ.QzNNkkSvpQOzsD8Yp8dYelhUiq34EXundeWj2z_SSro',
    '2026-05-23 15:03:28',
    '2026-05-22 15:03:27'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    207,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTQ0MTIyMywiZXhwIjoxNzgwMDQ2MDIzfQ.luL6gusVy2UY9-SpcGO3P1LC-K8JXMnQh11ovudUpSQ',
    '2026-05-23 16:13:43',
    '2026-05-22 16:13:43'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    208,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTQ1OTU3MSwiZXhwIjoxNzgwMDY0MzcxfQ.vGr_3QTlX4TLNGAiIY5s-cT9YI31TQL4_h3sOga_V9I',
    '2026-05-23 21:19:32',
    '2026-05-22 21:19:31'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    209,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk0NjAzMjAsImV4cCI6MTc4MDA2NTEyMH0.xpiSDU5ZF1UwxacVG5jYvj9fGW8p1oOjepj_bkNN4DM',
    '2026-05-23 21:32:00',
    '2026-05-22 21:32:00'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    210,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk0NjA1MDEsImV4cCI6MTc4MDA2NTMwMX0.FkWS73cm45i9JrEgy5nHUGV8KIHKQwdqDNsslNl1PIM',
    '2026-05-23 21:35:01',
    '2026-05-22 21:35:01'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    211,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk0NjMxMjAsImV4cCI6MTc4MDA2NzkyMH0.bZievfgwGTj1gHR-L2A5-CSbEH6fBROrb8xEoEX0nHk',
    '2026-05-23 22:18:40',
    '2026-05-22 22:18:40'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    212,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTQ2MzEzOCwiZXhwIjoxNzgwMDY3OTM4fQ.yknbP6wmjicCsAlK9ebstlXH7xgSHlnoMSzpeiFU_Ms',
    '2026-05-23 22:18:59',
    '2026-05-22 22:18:58'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    213,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1MTI3MTgsImV4cCI6MTc4MDExNzUxOH0.dHdAGrvF-Hg_TpPzMdAsQX4JBf_RBRuQ1Nf7ofyKJ-w',
    '2026-05-24 12:05:18',
    '2026-05-23 12:05:18'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    214,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1MTQxMjQsImV4cCI6MTc4MDExODkyNH0.mNCaFM-Fz_gz-xT9aRSzMSMiUTjLDRpF5MVjF1_KoW8',
    '2026-05-24 12:28:45',
    '2026-05-23 12:28:44'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    215,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1MTU4NjEsImV4cCI6MTc4MDEyMDY2MX0.poRnpGS0MdPWAIooglJFCxu-4kfffrBoMNRM1MTSjes',
    '2026-05-24 12:57:42',
    '2026-05-23 12:57:41'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    216,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1Mzk2NjgsImV4cCI6MTc4MDE0NDQ2OH0.lw2NqeNly4YqtF9y0psbmeLVhx2bTzTo4R1vUxd18RE',
    '2026-05-24 19:34:29',
    '2026-05-23 19:34:28'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    217,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1NDY5NTMsImV4cCI6MTc4MDE1MTc1M30.yzyHMQi9wgXGF91b-jX5DFmn_vy7Nl7gnGqSCdg6Wsc',
    '2026-05-24 21:35:54',
    '2026-05-23 21:35:53'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    218,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk1NDk2NTEsImV4cCI6MTc4MDE1NDQ1MX0.eI8ixyeNH87stgYpCEBDzvLCy4vEyVXHSUVqR2ECZ9k',
    '2026-05-24 22:20:52',
    '2026-05-23 22:20:51'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    219,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk1OTYyNTgsImV4cCI6MTc4MDIwMTA1OH0.F76ei4EFwgYXLdVmqkpftk99OrYRB7SwVtE6Kr05ExI',
    '2026-05-25 11:17:39',
    '2026-05-24 11:17:38'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    220,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1OTY1NDIsImV4cCI6MTc4MDIwMTM0Mn0.VDbyyvlQM_hmCH1QPVrOWfXKlyOwxZ2VDC-RQpsZY5w',
    '2026-05-25 11:22:22',
    '2026-05-24 11:22:22'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    221,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk1OTcyNjIsImV4cCI6MTc4MDIwMjA2Mn0.Spfc1sFiXlqdMhEV_3nJYgEsV2-24MfOb0dGRVL67M8',
    '2026-05-25 11:34:23',
    '2026-05-24 11:34:22'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    222,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1OTczNzIsImV4cCI6MTc4MDIwMjE3Mn0.w9G9r7nYyahZadeeGFm4L4Yh9V8YgWPvc_mgELXp2ZU',
    '2026-05-25 11:36:13',
    '2026-05-24 11:36:12'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    223,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk1OTc0NjcsImV4cCI6MTc4MDIwMjI2N30.7-ntchOBsMVXJCGqxVtkD-PJD2hV6sC7Rjr5Q8iVn_c',
    '2026-05-25 11:37:48',
    '2026-05-24 11:37:47'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    224,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1OTg0ODUsImV4cCI6MTc4MDIwMzI4NX0.nXYmWtLHbAvkO3OoJ8cEKyq2gfYpV0QsNCCR643gZ8g',
    '2026-05-25 11:54:46',
    '2026-05-24 11:54:45'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    225,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk1OTg1MTQsImV4cCI6MTc4MDIwMzMxNH0.5nyeFEzkkQG8fibIFXzx5H8QHAfYfWOicCLQL-KoDLE',
    '2026-05-25 11:55:14',
    '2026-05-24 11:55:14'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    226,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTU5ODU1MiwiZXhwIjoxNzgwMjAzMzUyfQ.v-hNzcBv9eDKxp3YUSvzV_zgYWS7OP_CK-jjXlfHJWU',
    '2026-05-25 11:55:53',
    '2026-05-24 11:55:52'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    227,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1OTg4NzgsImV4cCI6MTc4MDIwMzY3OH0.lGRHdtgyzxHI5sXrSeiJZSPEbga0XDkrVATLPMxxnxA',
    '2026-05-25 12:01:19',
    '2026-05-24 12:01:18'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    228,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk1OTg4OTQsImV4cCI6MTc4MDIwMzY5NH0.Xi1p2fRZ3s1gLCv36giPkCAvHxMvNDYMe_uWzUSqH_8',
    '2026-05-25 12:01:34',
    '2026-05-24 12:01:34'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    229,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk1OTg5MDYsImV4cCI6MTc4MDIwMzcwNn0.X_vhhJF4zD5WfemjT0ZyjjEmrD_9NDzBRkiepo3b1_E',
    '2026-05-25 12:01:46',
    '2026-05-24 12:01:46'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    230,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3OTYwMjI0OCwiZXhwIjoxNzgwMjA3MDQ4fQ.2w_9X5wjMNa6x6XHuu6BFUQhUhzeh1KT_CzGoPVbeMg',
    '2026-05-25 12:57:28',
    '2026-05-24 12:57:28'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    231,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTYwMzc4NywiZXhwIjoxNzgwMjA4NTg3fQ.5_DEPT745DI9nttDsNLH8wijrfHznPzjC_lrlcACDag',
    '2026-05-25 13:23:08',
    '2026-05-24 13:23:07'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    232,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3OTYwMzgwMiwiZXhwIjoxNzgwMjA4NjAyfQ.nBEuLMdYr0Nj_gwLjPNIiP9eW7I4bvnnE65u1wphi24',
    '2026-05-25 13:23:23',
    '2026-05-24 13:23:22'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    233,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3OTYwNDgxMCwiZXhwIjoxNzgwMjA5NjEwfQ._mdTdptdAGPkRSppBV9GXr_BLGCX__tXorcMZE6sS1g',
    '2026-05-25 13:40:10',
    '2026-05-24 13:40:10'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    234,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk2MDQ4MjEsImV4cCI6MTc4MDIwOTYyMX0.tqLNVyS1lPWTF32ec0gEqIhM7pTeA5nX68nOKlWnU2g',
    '2026-05-25 13:40:22',
    '2026-05-24 13:40:21'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    235,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk2MDQ4NzEsImV4cCI6MTc4MDIwOTY3MX0.YVgByNhnM1ducrO5-s08kzoHLauMRUUNZ8cxjJgsdgw',
    '2026-05-25 13:41:11',
    '2026-05-24 13:41:11'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    236,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTYwNzY5OSwiZXhwIjoxNzgwMjEyNDk5fQ.r2H0T7ri9PfU_YlvWj0Zl7L3lwm9AaLAvNVo8jf9fnw',
    '2026-05-25 14:28:19',
    '2026-05-24 14:28:19'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    237,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk2MDc3ODIsImV4cCI6MTc4MDIxMjU4Mn0.G9AmOsQaY0Hx9zoWDBnvTzjdafB0jjlQiajSjlytxPQ',
    '2026-05-25 14:29:42',
    '2026-05-24 14:29:42'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    238,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTYwODI5MCwiZXhwIjoxNzgwMjEzMDkwfQ.yvdwYqFfO95ZExNK0W5jLDpCNWHWsBIkSOgIYuQ83dM',
    '2026-05-25 14:38:10',
    '2026-05-24 14:38:10'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    239,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTYwODMwMSwiZXhwIjoxNzgwMjEzMTAxfQ.qgqfGtwj3m_cY3RYek76UszV4MHPmIJPDizeVYX_64g',
    '2026-05-25 14:38:21',
    '2026-05-24 14:38:21'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    240,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk2MDgzMTIsImV4cCI6MTc4MDIxMzExMn0.C5fcA22faH9C7aVJZclfnZ-CNS7gPpmvQa5KDcU67-E',
    '2026-05-25 14:38:33',
    '2026-05-24 14:38:32'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    241,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk2MTIxNDEsImV4cCI6MTc4MDIxNjk0MX0.QbF7MXn1ka1glgHPSgkMZPjYSmwzVHAZ9Ry4BxwFzOM',
    '2026-05-25 15:42:22',
    '2026-05-24 15:42:21'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    242,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk2MzI2ODgsImV4cCI6MTc4MDIzNzQ4OH0.VfZd8ssiaGyRuiX7LAzXtu9w78pTIVQ3UdKYfIxUr-s',
    '2026-05-25 21:24:49',
    '2026-05-24 21:24:48'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    243,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk2NzA4NTQsImV4cCI6MTc4MDI3NTY1NH0.wJ4y9SKFu5Z5Ua53kajVNAceNSRWH4jExQ2Edmw-duY',
    '2026-05-26 08:00:55',
    '2026-05-25 08:00:54'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    244,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk2NzE5NDIsImV4cCI6MTc4MDI3Njc0Mn0.BmmCU04qiH5j5aQHH2tIGEG0UemYBiczsXN9Nfj4MX4',
    '2026-05-26 08:19:02',
    '2026-05-25 08:19:02'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    245,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk2ODE5NzIsImV4cCI6MTc4MDI4Njc3Mn0.NQ6lAxdcRYyx1kkQFJQEsLllrzcrtlNpibEglRqoCy0',
    '2026-05-26 11:06:13',
    '2026-05-25 11:06:12'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    246,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk2ODIxOTAsImV4cCI6MTc4MDI4Njk5MH0.BPSYsKNxkcHoY8Ph4jzhuW6KXIbG1Yj1wcywD8JfD1g',
    '2026-05-26 11:09:50',
    '2026-05-25 11:09:50'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    247,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk2ODQxODQsImV4cCI6MTc4MDI4ODk4NH0.Q4lFH5OAOfSw_jG9z-k0ExxlKdJjbaludoqpnP6elfM',
    '2026-05-26 11:43:05',
    '2026-05-25 11:43:04'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    248,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk2OTM2NjYsImV4cCI6MTc4MDI5ODQ2Nn0.xA84OaAks8b4SND3GiogdWur3bz1YKEYlB5I-K0NCPI',
    '2026-05-26 14:21:06',
    '2026-05-25 14:21:06'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    249,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk2OTYxMzYsImV4cCI6MTc4MDMwMDkzNn0.2WFhYIjwn-rrOrxt2pPfZVS1swj2uJgyh1omZELnjvg',
    '2026-05-26 15:02:16',
    '2026-05-25 15:02:16'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    250,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk2OTY3NzUsImV4cCI6MTc4MDMwMTU3NX0.1xvUbRjr_ka6yaMMxMV84OIAdg9UPGqQiP-U1SdlMKU',
    '2026-05-26 15:12:56',
    '2026-05-25 15:12:55'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    251,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk3MDcwMDMsImV4cCI6MTc4MDMxMTgwM30.CpwGLrGcumtq1NIfmCN3O5SMz1UgQ0OumtWh66kYbyQ',
    '2026-05-26 18:03:24',
    '2026-05-25 18:03:23'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    252,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk3MTY4MDksImV4cCI6MTc4MDMyMTYwOX0.Qtk6UOFv3YG-8daTblBN7mbaXnglBz3pfjY87w7PgdM',
    '2026-05-26 20:46:50',
    '2026-05-25 20:46:49'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    253,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3MjI3MjUsImV4cCI6MTc4MDMyNzUyNX0.4aPFpsgnk1nYkV-ybzD-sHypJXWmyD34VJ7R1QPUlaE',
    '2026-05-26 22:25:26',
    '2026-05-25 22:25:25'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    254,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3NjczMDksImV4cCI6MTc4MDM3MjEwOX0.6qKQgCBM2RLRWyeRcA7Gs0_IPOofLUWRy7ili5O_aww',
    '2026-05-27 10:48:30',
    '2026-05-26 10:48:29'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    255,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3Njk3OTEsImV4cCI6MTc4MDM3NDU5MX0.L0m3J4935AYZM_1BMRRl5sKntUNg_43a6VCqkBw-CpY',
    '2026-05-27 11:29:52',
    '2026-05-26 11:29:51'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    256,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3NzE4NDgsImV4cCI6MTc4MDM3NjY0OH0.vJ98ptKSHv4toQiEciJgTd1k9LVzUEgwMdYQBkhOHRU',
    '2026-05-27 12:04:08',
    '2026-05-26 12:04:08'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    257,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3NzMwMDksImV4cCI6MTc4MDM3NzgwOX0.UN4867Pzz19cxrys33bNX1irAIkz7Fcs-5rAHQta6Zs',
    '2026-05-27 12:23:29',
    '2026-05-26 12:23:29'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    258,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3NzM0NDIsImV4cCI6MTc4MDM3ODI0Mn0.Rj3g51DDr5VGiGt9h2vvgNFm-aZTZpMwhgrCoPdzDrA',
    '2026-05-27 12:30:43',
    '2026-05-26 12:30:42'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    259,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3NzUwMjIsImV4cCI6MTc4MDM3OTgyMn0.uV0LyyhScDUz2LKYmf8evKhOVrxC5AnMKW0WKKzBG7A',
    '2026-05-27 12:57:03',
    '2026-05-26 12:57:02'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    260,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3NzUzOTQsImV4cCI6MTc4MDM4MDE5NH0.kWkO5OhkKFuExZfu8AO6fIaGir9Xsk3exO1sqH4iFSo',
    '2026-05-27 13:03:14',
    '2026-05-26 13:03:14'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    261,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3NzY0NzcsImV4cCI6MTc4MDM4MTI3N30.McAqR7bxnuXNa1fbnZRmHIEPZWMZRa353NOydD_mwPU',
    '2026-05-27 13:21:18',
    '2026-05-26 13:21:17'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    262,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3NzY3NzcsImV4cCI6MTc4MDM4MTU3N30.TyyxzhpytG3j8slAEhuMt4VuMXj1EcpPOjZAUq6YzK4',
    '2026-05-27 13:26:17',
    '2026-05-26 13:26:17'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    263,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk3Nzg1MjEsImV4cCI6MTc4MDM4MzMyMX0.HFIB6PlqchrhsfD_h_noGp1b7m0AXtO7pB8Hq-UfhNI',
    '2026-05-27 13:55:22',
    '2026-05-26 13:55:21'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    264,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3Nzg1NTQsImV4cCI6MTc4MDM4MzM1NH0.gLLJ2r1lzV4EOwF1atQ6Lg5EJEu_v5fziicl8MmYp0c',
    '2026-05-27 13:55:55',
    '2026-05-26 13:55:54'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    265,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3Nzg3MDQsImV4cCI6MTc4MDM4MzUwNH0.iS-Mb9QRaPNo4dzDF3-G68aNsP0pw3Lj5eUGDbkQ_MY',
    '2026-05-27 13:58:24',
    '2026-05-26 13:58:24'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    266,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3Nzk3MzcsImV4cCI6MTc4MDM4NDUzN30.eXofjKsxOKAe-GfePAKjMc3wqmxAIWrf_B_f8Vx3h1U',
    '2026-05-27 14:15:37',
    '2026-05-26 14:15:37'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    267,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk3Nzk5NzEsImV4cCI6MTc4MDM4NDc3MX0.23ainb6ep-9d_CLUnW_DtC5LILYgEjiAB9m-UEH6XmM',
    '2026-05-27 14:19:31',
    '2026-05-26 14:19:31'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    268,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4MDMzNzAsImV4cCI6MTc4MDQwODE3MH0.H8ppwTkCxUvBo4mVdiw0aaFr8eRaxjlB8E_5642XMe8',
    '2026-05-27 20:49:30',
    '2026-05-26 20:49:30'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    269,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4MDM2NzIsImV4cCI6MTc4MDQwODQ3Mn0.E3UNVPIu8i5F8PGhKEoGnHA_irwiYlAqgEFITw2QuhY',
    '2026-05-27 20:54:33',
    '2026-05-26 20:54:32'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    270,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4MDQ1MzYsImV4cCI6MTc4MDQwOTMzNn0.M_NQ-NV9qfY3unSuLPUzfZ42fp2hNEHvUKY_URdB65g',
    '2026-05-27 21:08:57',
    '2026-05-26 21:08:56'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    271,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTgxMTI3MCwiZXhwIjoxNzgwNDE2MDcwfQ.3kI1xv7jD-SkLJnWU5E3eCOjQRcnnpQjqwaiw9dXgWE',
    '2026-05-27 23:01:11',
    '2026-05-26 23:01:10'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    272,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4MTQ0OTYsImV4cCI6MTc4MDQxOTI5Nn0.rSsGKp7v5D0wO5J1FZ8AoORqNakzgpDC-VqGEpzr80M',
    '2026-05-27 23:54:57',
    '2026-05-26 23:54:56'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    273,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTgxNDUyNiwiZXhwIjoxNzgwNDE5MzI2fQ.kPqBi_kHN3u0KeI_q7NuLgA_8rfUpqLU5lmv_pnpiBg',
    '2026-05-27 23:55:26',
    '2026-05-26 23:55:26'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    274,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4NTQ0NDEsImV4cCI6MTc4MDQ1OTI0MX0.kn-abEFLdbDh6A8flCYruk9AnRYeWwt9ivDGYOIqhlQ',
    '2026-05-28 11:00:41',
    '2026-05-27 11:00:41'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    275,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4NTY3NzgsImV4cCI6MTc4MDQ2MTU3OH0.hKin6YgmrCNvhKP_d1yS_JxCSnOOnQ5eYE3_E0w5mQ4',
    '2026-05-28 11:39:39',
    '2026-05-27 11:39:38'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    276,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk4NTY5MTIsImV4cCI6MTc4MDQ2MTcxMn0.iGBvTRA7raDsm81krshOc6N7Eo8PU_xzf9zY0AHsw4k',
    '2026-05-28 11:41:53',
    '2026-05-27 11:41:52'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    277,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4NTgxOTYsImV4cCI6MTc4MDQ2Mjk5Nn0.21Iz2ENgn-9SEDOOymNWS0NUQMR-6I73peonNPwtmVw',
    '2026-05-28 12:03:16',
    '2026-05-27 12:03:16'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    278,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk4NTgyMjAsImV4cCI6MTc4MDQ2MzAyMH0.hIWuCMkJVhuWkar4VeNcpIwJfNg7-qulYqybiGnWufI',
    '2026-05-28 12:03:40',
    '2026-05-27 12:03:40'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    279,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3Nzk4NTgyNjgsImV4cCI6MTc4MDQ2MzA2OH0.onpX84AgRraeebcv_3DV4qCSGWCyHtIGPzZP5IRSzOk',
    '2026-05-28 12:04:28',
    '2026-05-27 12:04:28'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    280,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4NTgyODUsImV4cCI6MTc4MDQ2MzA4NX0.CmES_KmKdPhW-e_WtefJRVz6kaHz0Gkhe2gsptvVFHY',
    '2026-05-28 12:04:45',
    '2026-05-27 12:04:45'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    281,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiVGVhY2hlciBEYXJhIiwiRW1haWwiOiJtZXlzcmV5bGVhazA4QGdtYWlsLmNvbSIsIlJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzc5ODY3NTU3LCJleHAiOjE3ODA0NzIzNTd9.nYPg46l8IFg7OFYB11oEoqUOx6aH-ODqVG1FL0lYKFo',
    '2026-05-28 14:39:18',
    '2026-05-27 14:39:17'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    282,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiU3R1ZGVudCBEYXJhIiwiRW1haWwiOiJtZXlsaW5nMDgxN0BnbWFpbC5jb20iLCJSb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4Njc2OTEsImV4cCI6MTc4MDQ3MjQ5MX0.md1VQyBQcSe9VQ4KnnKxBt8Z2tDA5UJEDeNcwCRML34',
    '2026-05-28 14:41:31',
    '2026-05-27 14:41:31'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    283,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiU3R1ZGVudCBEYXJhIiwiRW1haWwiOiJtZXlsaW5nMDgxN0BnbWFpbC5jb20iLCJSb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4Njc3MTIsImV4cCI6MTc4MDQ3MjUxMn0.X4TnpJgNc49ks_nqF177vlG-6YsK-wqD-J1iXvzBFj8',
    '2026-05-28 14:41:52',
    '2026-05-27 14:41:52'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    284,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiU3R1ZGVudCBEYXJhIiwiRW1haWwiOiJtZXlsaW5nMDgxN0BnbWFpbC5jb20iLCJSb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzk4Njg0ODUsImV4cCI6MTc4MDQ3MzI4NX0.uJDpTLydeX05QkIx2xsPQLNvbdrItL0lR9r3cTXvGAA',
    '2026-05-28 14:54:45',
    '2026-05-27 14:54:45'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    285,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc3OTg2OTg1MiwiZXhwIjoxNzgwNDc0NjUyfQ.6nfdEalb_PhkvLy9ngvgI-31dJJdliJc0sF1nZHfgCQ',
    '2026-05-28 15:17:32',
    '2026-05-27 15:17:32'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    286,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc3OTg5MjMzNywiZXhwIjoxNzgwNDk3MTM3fQ.ps6s_onAiOl81gH9oiQoxFPbLoWnRJPNV6k1C3lvSoc',
    '2026-05-28 21:32:17',
    '2026-05-27 21:32:17'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    287,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc3OTg5MzM1NSwiZXhwIjoxNzgwNDk4MTU1fQ.DOf7jUfxYZMokC-kh_29ePQMQwDmV-61bMnDu3BR4Oo',
    '2026-05-28 21:49:15',
    '2026-05-27 21:49:15'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    288,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzc5ODk0MDQ2LCJleHAiOjE3ODA0OTg4NDZ9.39ALHx3SUrdBId4HJjO5SqvYmngr3SFwvX8Sl_CMbG4',
    '2026-05-28 22:00:46',
    '2026-05-27 22:00:46'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    289,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc3OTg5NDA2MywiZXhwIjoxNzgwNDk4ODYzfQ.55GVAHEAK4OBY1aCW4BJA4wy3bu4yIzGzUp6WQuoOuE',
    '2026-05-28 22:01:03',
    '2026-05-27 22:01:03'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    291,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTg5NTI3OSwiZXhwIjoxNzgwNTAwMDc5fQ.zUQorZIuVXsx7rHoceTkugPVtXMLHPupikDidTpDIrg',
    '2026-05-28 22:21:19',
    '2026-05-27 22:21:19'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    292,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTg5ODA3NiwiZXhwIjoxNzgwNTAyODc2fQ.JdTytBivLMTouAP_5hZDm3vMOEMhyX3OdaO6p1RF778',
    '2026-05-28 23:07:56',
    '2026-05-27 23:07:56'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    294,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzc5OTQ0NTkyLCJleHAiOjE3ODA1NDkzOTJ9.mZzdg0JL0abBmut9hbyJ-msY586K2drap5mjd5KpaaU',
    '2026-05-29 12:03:12',
    '2026-05-28 12:03:12'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    295,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc3OTk0NDYwNiwiZXhwIjoxNzgwNTQ5NDA2fQ.tPBtiKGMyILvaZoPc0tvOF3vA6u9BGG0ub6MO4HDc6Y',
    '2026-05-29 12:03:27',
    '2026-05-28 12:03:27'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    296,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc3OTk1MDE5OCwiZXhwIjoxNzgwNTU0OTk4fQ.8bPTvxgvZNeGfElyi-q9gPKJgk8ru2NEFgHVKWVob6U',
    '2026-05-29 13:36:39',
    '2026-05-28 13:36:38'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    297,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc3OTk1MDI1OCwiZXhwIjoxNzgwNTU1MDU4fQ.g3rO1GrV2meCoAIgjktUBSMZLJZnI4HtlnG8H92RlyM',
    '2026-05-29 13:37:39',
    '2026-05-28 13:37:38'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    298,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc3OTk1MDk4NiwiZXhwIjoxNzgwNTU1Nzg2fQ.UnblvdCaQcZMBAR6iJqtGgojp11zzoTP6NpXFwqlf0M',
    '2026-05-29 13:49:46',
    '2026-05-28 13:49:46'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    299,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTk1MzU2MCwiZXhwIjoxNzgwNTU4MzYwfQ.QnodNgFvLY_45K8YZ0Sj758_4Ilbelp3hkPaH0VxswY',
    '2026-05-29 14:32:41',
    '2026-05-28 14:32:40'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    300,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTk1NDkyNCwiZXhwIjoxNzgwNTU5NzI0fQ.61BA68ELDBjSvKiCMZJjutp9xtwVxs2fdCt3TvTgocA',
    '2026-05-29 14:55:24',
    '2026-05-28 14:55:24'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    301,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTk1Njk0OCwiZXhwIjoxNzgwNTYxNzQ4fQ.Npb82ir8dLc3clXbYkIVDL6oVz3yxg05YXt8U309aBU',
    '2026-05-29 15:29:08',
    '2026-05-28 15:29:08'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    302,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTk1Njk2NCwiZXhwIjoxNzgwNTYxNzY0fQ.IocnC30_XIvvRPQnaOf2QGE01Q9I_htvTqb2kbg_lws',
    '2026-05-29 15:29:25',
    '2026-05-28 15:29:24'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    303,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3OTk1Nzc2MCwiZXhwIjoxNzgwNTYyNTYwfQ.7SDOWhe44XUtX9kvPQW9_RG0rhVhu-9TyB0BfL8eSpk',
    '2026-05-29 15:42:40',
    '2026-05-28 15:42:40'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    306,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzc5OTc4NTQ4LCJleHAiOjE3ODA1ODMzNDh9.WDpBnRa02DhedQJzL1HDQnr_z5c27fcOyJsWkAPCK90',
    '2026-05-29 21:29:08',
    '2026-05-28 21:29:08'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    307,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMDQyMDkzLCJleHAiOjE3ODA2NDY4OTN9.M2TJHYfsd72lcES1g1FjrFHqecV6eHtzbEhDwvdowG4',
    '2026-05-30 15:08:13',
    '2026-05-29 15:08:13'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    308,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMDQzMjM0LCJleHAiOjE3ODA2NDgwMzR9.MmrV_6byaqtIpKNWxh5MKaZIqCjCzj3VMC2FNqrhxlg',
    '2026-05-30 15:27:14',
    '2026-05-29 15:27:14'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    309,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4MDA0NDYxNCwiZXhwIjoxNzgwNjQ5NDE0fQ.elooQGyxDz4GXGQgnbnjGNbbt8JHV1xlkzFJW4buhDo',
    '2026-05-30 15:50:14',
    '2026-05-29 15:50:14'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    310,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4MDA0OTAxNywiZXhwIjoxNzgwNjUzODE3fQ.imLPCXFaNoA-RTAI59S6_3IUpt1GilbLlT1AZNQukyg',
    '2026-05-30 17:03:38',
    '2026-05-29 17:03:37'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    311,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMDQ5ODE5LCJleHAiOjE3ODA2NTQ2MTl9.D3mUll1_QN7H4mhLeKh4zdQ6Oheb8UYidrznq7-jeMs',
    '2026-05-30 17:17:00',
    '2026-05-29 17:16:59'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    312,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMDYzMzAwLCJleHAiOjE3ODA2NjgxMDB9.NFi6sSQOssfzOdgK3GVGgzQd6ZgDylYCfrphN736Ev8',
    '2026-05-30 21:01:40',
    '2026-05-29 21:01:40'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    313,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4MDA2NzE3NSwiZXhwIjoxNzgwNjcxOTc1fQ.VNJ7Z6DwYEXDMVnE3fNr-wxf87swpfTqf0yN_PV3fGM',
    '2026-05-30 22:06:16',
    '2026-05-29 22:06:15'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    315,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMTMzODgzLCJleHAiOjE3ODA3Mzg2ODN9.GJzkGTKx00XGu6hG7LUj4mxRFosPgsJLzEggHc_nw7c',
    '2026-05-31 16:38:03',
    '2026-05-30 16:38:03'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    318,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwMTM1NjU0LCJleHAiOjE3ODA3NDA0NTR9.9ySdnp8fKwy64ONu0ggtqLHCBU1INrhMLaZUBW9Hjqc',
    '2026-05-31 17:07:35',
    '2026-05-30 17:07:34'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    319,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDEzNTcyOCwiZXhwIjoxNzgwNzQwNTI4fQ.H9jp0g0-pzSRb_JaZxLWdPbsR5ZCuJcic0_nmwxLBbw',
    '2026-05-31 17:08:48',
    '2026-05-30 17:08:48'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    320,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDEzNTkzNCwiZXhwIjoxNzgwNzQwNzM0fQ.RUKPwXqlkw9_W50LstV79592ZmjjurpMcVcyYORfC1w',
    '2026-05-31 17:12:15',
    '2026-05-30 17:12:14'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    322,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwMTM1OTYyLCJleHAiOjE3ODA3NDA3NjJ9.v6c7YjWZ9tn6_Oe0QYZnmW4x-nycqM7p45mKT-LOpUg',
    '2026-05-31 17:12:42',
    '2026-05-30 17:12:42'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    323,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMTM1OTk2LCJleHAiOjE3ODA3NDA3OTZ9.3ixVB8RsdVeruV-qI_ioQaxvIifqv7iyDOHhW1YMfeI',
    '2026-05-31 17:13:16',
    '2026-05-30 17:13:16'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    324,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMTM4OTAwLCJleHAiOjE3ODA3NDM3MDB9.4RQLpONTLoAjYGiHC4MOyT_d5rvYAE_qniiz50KcTZQ',
    '2026-05-31 18:01:40',
    '2026-05-30 18:01:40'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    325,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDE0MTgxNCwiZXhwIjoxNzgwNzQ2NjE0fQ.yt0eZtDiz_L1VHI_n17DrryLJY-q_zqUvMkQxbb0Nhs',
    '2026-05-31 18:50:14',
    '2026-05-30 18:50:14'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    326,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMTQyNTcyLCJleHAiOjE3ODA3NDczNzJ9.nXUhC3iSnJZ7FWJyGlDnxE2K3H5prfXuvCCkgRnc73M',
    '2026-05-31 19:02:53',
    '2026-05-30 19:02:52'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    327,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwMTQyNTg3LCJleHAiOjE3ODA3NDczODd9.ijisHei_14xeHPgT_woygNXLN0e40EXLXCknAGh9Qy8',
    '2026-05-31 19:03:07',
    '2026-05-30 19:03:07'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    328,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4MDE0NTE1MSwiZXhwIjoxNzgwNzQ5OTUxfQ.JYhvwgX3T1UPJDcYZIdzajTGJ6BOlkqNZFYMAU8jKzk',
    '2026-05-31 19:45:52',
    '2026-05-30 19:45:51'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    330,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMjAwOTA3LCJleHAiOjE3ODA4MDU3MDd9.k5Q-1nYsjGjQhvyGqsPKj5qAca78dnLIKtuFNKXuwgg',
    '2026-06-01 11:15:08',
    '2026-05-31 11:15:07'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    331,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMjAxMDEwLCJleHAiOjE3ODA4MDU4MTB9.QgYppd1LNzS4-ZQZstqcDHeFWzEP_F8Sm310uDoQR9Y',
    '2026-06-01 11:16:50',
    '2026-05-31 11:16:50'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    332,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIwMTk0OCwiZXhwIjoxNzgwODA2NzQ4fQ.XIGGxHxY79exVP7njw8cXOeMC8odoMYk1AyuMrg3i_A',
    '2026-06-01 11:32:29',
    '2026-05-31 11:32:28'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    333,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIwMjUwNCwiZXhwIjoxNzgwODA3MzA0fQ.oRxE0Ygl7JNZxk7iFKEBUpA3c32aO-ehZshOtDU_4n8',
    '2026-06-01 11:41:44',
    '2026-05-31 11:41:44'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    334,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIwNDE3NSwiZXhwIjoxNzgwODA4OTc1fQ.t7utcXDnYkoUl-eLEJwsoU09PGfNrjlD5dZmZIyXq_Y',
    '2026-06-01 12:09:36',
    '2026-05-31 12:09:35'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    335,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIwNDIzMSwiZXhwIjoxNzgwODA5MDMxfQ._srFtk8ihpqg-DvUbdfNiViytC9bQAEA53GTmp5dqN8',
    '2026-06-01 12:10:31',
    '2026-05-31 12:10:31'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    336,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIwNDQyMywiZXhwIjoxNzgwODA5MjIzfQ.xSzE9qH1m3q4p2f23r2xM4cUcHINTz3UQ6hAsi0FdB0',
    '2026-06-01 12:13:43',
    '2026-05-31 12:13:43'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    337,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMjA4ODQ3LCJleHAiOjE3ODA4MTM2NDd9.oAxRthZXTVLr3ip4Zzc0VLuMgfDrGbm5EhZIT2Xayjk',
    '2026-06-01 13:27:27',
    '2026-05-31 13:27:27'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    338,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIwOTc4OSwiZXhwIjoxNzgwODE0NTg5fQ.pfHL8WfsAUq_stVikPq917FzUnWUc5oFHq2WR0Ti-no',
    '2026-06-01 13:43:09',
    '2026-05-31 13:43:09'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    339,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMjEwMTQ2LCJleHAiOjE3ODA4MTQ5NDZ9.UGIDg5AvBVrqFU7pSsGNVXpXzcZCPM-KGVe9rDxrDaA',
    '2026-06-01 13:49:06',
    '2026-05-31 13:49:06'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    340,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMjEwNjE4LCJleHAiOjE3ODA4MTU0MTh9.krTMT5rSZD8efQc2-MKxJEBzGQKCNgnLURpg_Ihl36g',
    '2026-06-01 13:56:58',
    '2026-05-31 13:56:58'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    341,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMjExNjI5LCJleHAiOjE3ODA4MTY0Mjl9.gDnkImvXmWBANHfxWZF4MbB8IcP69flqx-9KFl0ntLo',
    '2026-06-01 14:13:50',
    '2026-05-31 14:13:49'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    342,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIxMTkzMywiZXhwIjoxNzgwODE2NzMzfQ.tl9Dj3l-wq996wWFiNw3M8lZ1apdnA-Gvg5K6tdJOAI',
    '2026-06-01 14:18:54',
    '2026-05-31 14:18:53'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    343,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIxMjU1MywiZXhwIjoxNzgwODE3MzUzfQ.tMQxYQbPIUaN8JCCGkDixYQdu66UvA6_tqsCbmKXKOc',
    '2026-06-01 14:29:13',
    '2026-05-31 14:29:13'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    344,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMjE1NTc4LCJleHAiOjE3ODA4MjAzNzh9.S7njpzq2GIPmqYtp6z6JiuY2kIsrlAeFxVNub0XTZNU',
    '2026-06-01 15:19:39',
    '2026-05-31 15:19:38'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    345,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIxNTg5MiwiZXhwIjoxNzgwODIwNjkyfQ.U50EK69MoG9PeILWx8WQi7QbMwS255pPj6m6S7QGoYg',
    '2026-06-01 15:24:52',
    '2026-05-31 15:24:52'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    346,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMjE2MTA1LCJleHAiOjE3ODA4MjA5MDV9.5OYBVD1PptqRPdhqJvkcqBxw9Eps97Snp64Spd_af1c',
    '2026-06-01 15:28:26',
    '2026-05-31 15:28:25'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    347,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIxNjE0OSwiZXhwIjoxNzgwODIwOTQ5fQ.aWxuyIZEnrzITwd5-7N59Jr0RONK7ZErp1qKHBWsSCc',
    '2026-06-01 15:29:10',
    '2026-05-31 15:29:09'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    348,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIxNzU3NCwiZXhwIjoxNzgwODIyMzc0fQ.Tkt8sdtJTuXJHi4M-tpsi9N0eek5ljF1CdaeLpv5Px4',
    '2026-06-01 15:52:54',
    '2026-05-31 15:52:54'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    349,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIzNjk0NCwiZXhwIjoxNzgwODQxNzQ0fQ.UBpDdCQRprFIOdGNqylFQ9q7Sxu8epRhhUrcwc65MBE',
    '2026-06-01 21:15:44',
    '2026-05-31 21:15:44'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    350,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMjM2OTYzLCJleHAiOjE3ODA4NDE3NjN9.SCGZXraO65qbGwjbYLdqpqghH4fGsrdGYLt8B3Go-ag',
    '2026-06-01 21:16:04',
    '2026-05-31 21:16:03'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    352,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDIzODcxMCwiZXhwIjoxNzgwODQzNTEwfQ.F89FEs4xYR0ZRbynkSx3YcUjbA9DbzmPVsCxkXxYJPk',
    '2026-06-01 21:45:11',
    '2026-05-31 21:45:10'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    353,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4MDIzOTM5NiwiZXhwIjoxNzgwODQ0MTk2fQ.a1qk16nSrlkBR5MBq-jYL-vkDhDDSY_LyMITXD_da_E',
    '2026-06-01 21:56:36',
    '2026-05-31 21:56:36'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    355,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4MDI4NDI1NCwiZXhwIjoxNzgwODg5MDU0fQ.UB7EIw86ChMshUIMBf1rWwaVKug8Tmc6-rDidXLvuLE',
    '2026-06-02 10:24:14',
    '2026-06-01 10:24:14'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    356,
    101,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAxLCJOYW1lIjoiU3R1ZGVudCBQaG9ycyIsIkVtYWlsIjoibWV5c3JleWxlYWswOEBnbWFpbC5jb20iLCJSb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4MDI5Mzk5MywiZXhwIjoxNzgwODk4NzkzfQ.d6Qngc8cggl50JdnnBEYmysq8RbrBxRp3e-YqB-aJU8',
    '2026-06-02 13:06:33',
    '2026-06-01 13:06:33'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    358,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMzIzMjIwLCJleHAiOjE3ODA5MjgwMjB9.U14vJUVSQh9ODBZcoKxzGzA_aSxViYrQzbgPog_A4z8',
    '2026-06-02 21:13:41',
    '2026-06-01 21:13:40'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    360,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMzI2MjMzLCJleHAiOjE3ODA5MzEwMzN9.XXycfNFgxRg8MqBLHFJXlTKRHl0PWqcdftzmUs1RiVw',
    '2026-06-02 22:03:53',
    '2026-06-01 22:03:53'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    361,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMzc3ODYxLCJleHAiOjE3ODA5ODI2NjF9.SgQCcKT_yp-fg7EDL31gdcIpJgo294x2Sbz250rWXKM',
    '2026-06-03 12:24:21',
    '2026-06-02 12:24:21'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    363,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDM3Nzk2OCwiZXhwIjoxNzgwOTgyNzY4fQ.DCVJIOa0lau-iJeAKKEPca1hepzzddfDT86k5Iz2XiE',
    '2026-06-03 12:26:09',
    '2026-06-02 12:26:08'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    364,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwMzc4MTQzLCJleHAiOjE3ODA5ODI5NDN9.A2ywJySbfpyqm00dPE0XrV5S2tE3aVFw-QpIAgzF7Ig',
    '2026-06-03 12:29:03',
    '2026-06-02 12:29:03'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    365,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDM3ODU3MSwiZXhwIjoxNzgwOTgzMzcxfQ.MyOsO_LEu_G3z7rdAKgw_V42O5KkpnBrDRFuJ4sqP_Q',
    '2026-06-03 12:36:12',
    '2026-06-02 12:36:11'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    366,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwMzgwMjcwLCJleHAiOjE3ODA5ODUwNzB9.EJeQVl3lsicehiwPIcqKlH1WNqWbKVx_9qiAWJfMhxI',
    '2026-06-03 13:04:31',
    '2026-06-02 13:04:30'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    367,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMzgwMjg0LCJleHAiOjE3ODA5ODUwODR9.j0NxOtT2Rdtb1y6ictWm4GgYWhbazwIo7_cqHTNWkgo',
    '2026-06-03 13:04:44',
    '2026-06-02 13:04:44'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    369,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMzgwOTg1LCJleHAiOjE3ODA5ODU3ODV9.84b3TFxnCQLmIXQtrMxlpEbkHtzSsLXeFxPpvozdokI',
    '2026-06-03 13:16:25',
    '2026-06-02 13:16:25'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    370,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwMzgxMDAyLCJleHAiOjE3ODA5ODU4MDJ9.e568SeaG5uZ2otkNFxoNVMNNkL2nb4LtieoNZX-zEys',
    '2026-06-03 13:16:43',
    '2026-06-02 13:16:42'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    371,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDM4ODAwNCwiZXhwIjoxNzgwOTkyODA0fQ.Qy5WrnwBdA_eWcUH-ILzYP4walg9UFKoQGdNx-Gv1wM',
    '2026-06-03 15:13:25',
    '2026-06-02 15:13:24'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    372,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQwODc1OCwiZXhwIjoxNzgxMDEzNTU4fQ.i03rZeD-wMEJCaXi3UWAxcQNon8HnRhyy5tJLv1kZF4',
    '2026-06-03 20:59:18',
    '2026-06-02 20:59:18'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    373,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwNDA4ODkzLCJleHAiOjE3ODEwMTM2OTN9.YJkjFC3S2swk1dsFReFvTilVrOsgras4W5rRyza8eXQ',
    '2026-06-03 21:01:34',
    '2026-06-02 21:01:33'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    374,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQwODkzMCwiZXhwIjoxNzgxMDEzNzMwfQ.x7J34TRxUeAYyxmrDWzq2r_pn5Bwb5x7ZDpFyEEublY',
    '2026-06-03 21:02:11',
    '2026-06-02 21:02:10'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    375,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwNDA5MzUxLCJleHAiOjE3ODEwMTQxNTF9.madUnqazTPxaxE_OZyUBmS-6iMDJUSgMns2MfGo6tDY',
    '2026-06-03 21:09:12',
    '2026-06-02 21:09:11'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    376,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQxMDAyNSwiZXhwIjoxNzgxMDE0ODI1fQ.5dhOmVN1TMmFDNF4zFSd1JRF6WerptwjUfLQFrhkV_c',
    '2026-06-03 21:20:25',
    '2026-06-02 21:20:25'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    377,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwNDExNjE3LCJleHAiOjE3ODEwMTY0MTd9.LDGVtEg_3o0niL4eqZ_T4Kue7Aev6eAfy0e_GJ12gAQ',
    '2026-06-03 21:46:57',
    '2026-06-02 21:46:57'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    378,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQxMjU2NCwiZXhwIjoxNzgxMDE3MzY0fQ.U4VDHPlP5DZjuhZyXeIeoXa9lK_4X7NTHVwthdAt-rk',
    '2026-06-03 22:02:44',
    '2026-06-02 22:02:44'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    379,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwNDEyNTgyLCJleHAiOjE3ODEwMTczODJ9.XevOoCz1hj9kSB7r8GhcDWy1evHTnoMjv67EiUr_-9s',
    '2026-06-03 22:03:03',
    '2026-06-02 22:03:02'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    380,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQ1NTE1MSwiZXhwIjoxNzgxMDU5OTUxfQ._NDUXG67dX5IQazFUrkwQDdz7eBZDLynMx6gJM6UUHM',
    '2026-06-04 09:52:32',
    '2026-06-03 09:52:31'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    381,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwNDU1MzU1LCJleHAiOjE3ODEwNjAxNTV9.E7Q-aKImV7mJaxGlE11TkqdNGXsi8UZfkTGJIcS9Q7A',
    '2026-06-04 09:55:55',
    '2026-06-03 09:55:55'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    382,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwNDU3NzM3LCJleHAiOjE3ODEwNjI1Mzd9.p3RKRdE8M-Jo_CuopaZ9lvEDZoM-oiQriTLbNEnZomU',
    '2026-06-04 10:35:38',
    '2026-06-03 10:35:36'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    383,
    100,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAwLCJOYW1lIjoiU3RhZmYgUGhvcnMiLCJFbWFpbCI6ImFjcm9iZWpvaG5AZ21haWwuY29tIiwiUm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwNDU5MTUyLCJleHAiOjE3ODEwNjM5NTJ9.qLhYqwWxSWW7f65s9oJL8ilkXVv4w8rQM2vypNVBdNk',
    '2026-06-04 10:59:13',
    '2026-06-03 10:59:12'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    384,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQ1OTE4MCwiZXhwIjoxNzgxMDYzOTgwfQ.qEh1V_Qkt7uDP6Pe_8r_P5-6Z1UnFqag6ahbC9T4qMc',
    '2026-06-04 10:59:40',
    '2026-06-03 10:59:40'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    386,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwNDU5NjkzLCJleHAiOjE3ODEwNjQ0OTN9.fa1FM5WGC_-sBstfx35Uso1ndrU94cStzJj22g0hyYo',
    '2026-06-04 11:08:14',
    '2026-06-03 11:08:13'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    387,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQ1OTgxOCwiZXhwIjoxNzgxMDY0NjE4fQ.KEUIzXW2AKvVAgyLZjvmdJjJvBPjyGXVMxC49_2FceA',
    '2026-06-04 11:10:19',
    '2026-06-03 11:10:18'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    388,
    103,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAzLCJOYW1lIjoiVGVhY2hlciBUaGF2eSIsIkVtYWlsIjoieWluc29tcGhvcnMyMjEyQGdtYWlsLmNvbSIsIlJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzgwNDU5ODUyLCJleHAiOjE3ODEwNjQ2NTJ9.BfT9zgjjIzi49unev2v_3IVL6B_Pk5yjnsJpiYrSSx0',
    '2026-06-04 11:10:52',
    '2026-06-03 11:10:52'
  );
INSERT INTO
  `refresh_tokens` (`Id`, `UserId`, `Token`, `Expiry`, `CreateAt`)
VALUES
  (
    389,
    102,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTAyLCJOYW1lIjoiQWRtaW4gUGhvcnMiLCJFbWFpbCI6Im1leWxpbmcwODE3QGdtYWlsLmNvbSIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQ2MzgyNywiZXhwIjoxNzgxMDY4NjI3fQ.ZFa74KduTUfBnYJ7No8IR5wo3vE-JaiytMpwhmmUNPE',
    '2026-06-04 12:17:07',
    '2026-06-03 12:17:07'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: roles
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: scores
# ------------------------------------------------------------

INSERT INTO
  `scores` (
    `Id`,
    `StudentId`,
    `ExamId`,
    `Score`,
    `Grade`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (100, 100, 100, 95.00, 'A', NULL, '2026-05-06 11:22:16');
INSERT INTO
  `scores` (
    `Id`,
    `StudentId`,
    `ExamId`,
    `Score`,
    `Grade`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (101, 101, 101, 88.00, 'B', NULL, '2026-05-06 11:22:16');
INSERT INTO
  `scores` (
    `Id`,
    `StudentId`,
    `ExamId`,
    `Score`,
    `Grade`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (102, 102, 102, 76.00, 'C', NULL, '2026-05-06 11:22:16');
INSERT INTO
  `scores` (
    `Id`,
    `StudentId`,
    `ExamId`,
    `Score`,
    `Grade`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (103, 103, 103, 90.00, 'A', NULL, '2026-05-06 11:22:16');
INSERT INTO
  `scores` (
    `Id`,
    `StudentId`,
    `ExamId`,
    `Score`,
    `Grade`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (104, 104, 104, 85.00, 'B', NULL, '2026-05-06 11:22:16');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: settings
# ------------------------------------------------------------

INSERT INTO
  `settings` (
    `Id`,
    `SchoolName`,
    `SchoolKhName`,
    `Logo`,
    `SchoolPicture`,
    `Country`,
    `Currency`,
    `Phone`,
    `Email`,
    `EmailNotification`,
    `DarkMode`,
    `UpdatedAt`
  )
VALUES
  (
    1,
    ' Bright Brain School',
    'សាលាប្រាយប្រ៊ែន​',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1779776441/settings/1779776437608-bb-removebg-preview.png.png',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1779803511/settings/1779803509840-school-removebg-preview%20%281%29.png.png',
    'Cambodia',
    'KHR',
    '0712255858',
    'info@brightbrain.edu.kh',
    1,
    1,
    '2026-05-26 21:08:10'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: staffs
# ------------------------------------------------------------

INSERT INTO
  `staffs` (
    `Id`,
    `StaffCode`,
    `Name`,
    `Gender`,
    `Phone`,
    `Position`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    100,
    'STF001',
    'ស្រី ពិសី',
    'Female',
    '012111111',
    'Accountant',
    'ភ្នំពេញ',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `staffs` (
    `Id`,
    `StaffCode`,
    `Name`,
    `Gender`,
    `Phone`,
    `Position`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    101,
    'STF002',
    'លី សុភា',
    'Male',
    '012222222',
    'Receptionist',
    'កណ្ដាល',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `staffs` (
    `Id`,
    `StaffCode`,
    `Name`,
    `Gender`,
    `Phone`,
    `Position`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    102,
    'STF003',
    'ហេង ដារ៉ា',
    'Male',
    '012333333',
    'Office Staff',
    'តាកែវ',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `staffs` (
    `Id`,
    `StaffCode`,
    `Name`,
    `Gender`,
    `Phone`,
    `Position`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    103,
    'STF004',
    'គឹម ស្រីនាង',
    'Female',
    '012444444',
    'Cashier',
    'កំពង់ស្ពឺ',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `staffs` (
    `Id`,
    `StaffCode`,
    `Name`,
    `Gender`,
    `Phone`,
    `Position`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    104,
    'STF005',
    'ជា វណ្ណា',
    'Male',
    '012555555',
    'Administrator',
    'ភ្នំពេញ',
    NULL,
    '2026-05-06 11:22:16'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: student_attendance
# ------------------------------------------------------------

INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    100,
    100,
    100,
    '2026-05-01',
    'Present',
    NULL,
    '2026-05-06 11:22:16',
    NULL
  );
INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    102,
    102,
    102,
    '2026-05-01',
    'Absent',
    NULL,
    '2026-05-06 11:22:16',
    NULL
  );
INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    103,
    103,
    103,
    '2026-05-01',
    'Present',
    NULL,
    '2026-05-06 11:22:16',
    NULL
  );
INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    104,
    104,
    104,
    '2026-05-01',
    'Permission',
    NULL,
    '2026-05-06 11:22:16',
    NULL
  );
INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    105,
    102,
    101,
    '2026-05-01',
    'Absent',
    NULL,
    '2026-05-22 10:53:33',
    101
  );
INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    106,
    102,
    101,
    '2026-05-02',
    'Permission',
    NULL,
    '2026-05-22 10:53:33',
    101
  );
INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    107,
    109,
    101,
    '2026-05-01',
    'Permission',
    NULL,
    '2026-05-22 10:53:33',
    101
  );
INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    108,
    114,
    101,
    '2026-05-01',
    'Present',
    NULL,
    '2026-05-22 10:53:33',
    101
  );
INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    109,
    101,
    105,
    '2026-05-01',
    'Absent',
    NULL,
    '2026-05-24 13:33:34',
    103
  );
INSERT INTO
  `student_attendance` (
    `Id`,
    `StudentId`,
    `ClassId`,
    `AttendanceDate`,
    `Status`,
    `Remark`,
    `CreateAt`,
    `TeacherId_mark`
  )
VALUES
  (
    110,
    104,
    103,
    '2026-06-01',
    'Permission',
    NULL,
    '2026-06-03 11:09:04',
    103
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: student_parents
# ------------------------------------------------------------

INSERT INTO
  `student_parents` (`Id`, `StudentId`, `ParentId`, `Relation`)
VALUES
  (100, 100, 100, 'Father');
INSERT INTO
  `student_parents` (`Id`, `StudentId`, `ParentId`, `Relation`)
VALUES
  (101, 101, 101, 'Mother');
INSERT INTO
  `student_parents` (`Id`, `StudentId`, `ParentId`, `Relation`)
VALUES
  (102, 102, 102, 'Father');
INSERT INTO
  `student_parents` (`Id`, `StudentId`, `ParentId`, `Relation`)
VALUES
  (103, 103, 103, 'Mother');
INSERT INTO
  `student_parents` (`Id`, `StudentId`, `ParentId`, `Relation`)
VALUES
  (104, 104, 104, 'Guardian');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: student_payments
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: students
# ------------------------------------------------------------

INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    100,
    'STU-2026-0001',
    'Dara',
    'ដារ៉ា',
    'Male',
    '2010-01-01',
    'sokha',
    'Neat',
    100,
    100,
    100,
    100,
    '011111111',
    'ភ្នំពេញ',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1779701132/student_images/1779701127346-Thavy1.JPG.jpg',
    '2026-05-06 11:22:16',
    NULL,
    101
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    101,
    'STU-2026-0002',
    'Sokha',
    'សុខា',
    'Male',
    '2010-02-05',
    'Jonh',
    'Momo',
    101,
    105,
    102,
    102,
    '011222222',
    'កណ្ដាល',
    NULL,
    '2026-05-06 11:22:16',
    NULL,
    100
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    102,
    'STU-2026-0003',
    'Sreyleak',
    'ស្រីល័ក្ខ',
    'Female',
    '2011-03-10',
    NULL,
    NULL,
    NULL,
    101,
    101,
    101,
    '011333333',
    'តាកែវ',
    NULL,
    '2026-05-06 11:22:16',
    NULL,
    101
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    103,
    'STU-2026-0004',
    'Piseth',
    'ពិសិដ្ឋ',
    'Male',
    '2010-04-15',
    'Jonh',
    'Momo',
    100,
    102,
    104,
    104,
    '011444444',
    'កំពង់ស្ពឺ',
    NULL,
    '2026-05-06 11:22:16',
    NULL,
    101
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    104,
    'STU-2026-0005',
    'Rathana',
    'រតនា',
    'Female',
    '2011-05-20',
    'Jonh',
    'Momo',
    102,
    103,
    103,
    103,
    '011555555',
    'ភ្នំពេញ',
    NULL,
    '2026-05-06 11:22:16',
    NULL,
    101
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    105,
    'STU-2026-0006',
    'Mey Sreyleak',
    'Leak',
    'Male',
    '2024-05-07',
    'សុភាព',
    'នីតា',
    100,
    103,
    101,
    100,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778372241973-236488022',
    '2026-05-10 07:17:22',
    NULL,
    101
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    106,
    'STU-2026-0007',
    'Mey Sreyleak',
    'Leak',
    'Female',
    '2019-05-01',
    'សុភាព',
    'នីតា',
    100,
    102,
    103,
    102,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778372756748-851987971',
    '2026-05-10 07:25:56',
    NULL,
    100
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    107,
    'STU-2026-0008',
    'Mey Sreyleak',
    'Leak',
    'Other',
    '2024-05-01',
    'សុភាព',
    'នីតា',
    101,
    102,
    104,
    100,
    '099897899',
    'PP',
    NULL,
    '2026-05-10 07:28:26',
    NULL,
    100
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    108,
    'STU-2026-0009',
    'Mey Sreyleak',
    'Leak',
    'Female',
    '2020-05-03',
    'សុភាព',
    'នីតា',
    100,
    105,
    103,
    101,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778373001563-804519141',
    '2026-05-10 07:30:01',
    NULL,
    102
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    109,
    'STU-2026-00010',
    'Yen Somphors',
    'Leak',
    'Female',
    '2023-05-01',
    'សុភាព',
    'នីតា',
    100,
    101,
    101,
    103,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778373300171-49376385',
    '2026-05-10 07:35:00',
    NULL,
    103
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    110,
    'STU-2026-00011',
    'Y',
    'Leak',
    'Female',
    '2026-04-26',
    'សុភាព',
    'នីតា',
    100,
    102,
    101,
    100,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778373455082-515730746',
    '2026-05-10 07:37:35',
    NULL,
    101
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    111,
    'STU-2026-00012',
    'Yaya',
    'Leak',
    'Male',
    '2026-04-27',
    'សុភាព',
    'នីតា',
    102,
    103,
    101,
    102,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778390790896-707061218',
    '2026-05-10 12:26:31',
    NULL,
    100
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    112,
    'STU-2026-00013',
    'Mey Sreyleak',
    'Leak',
    'Female',
    '2026-04-27',
    'sokha',
    'Mey Sreyleak',
    100,
    103,
    103,
    102,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778391367469-917811493',
    '2026-05-10 12:36:07',
    NULL,
    100
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    113,
    'STU-2026-00014',
    'Mey Sreyleak',
    'Leak',
    'Female',
    '2026-04-28',
    'sokha',
    'Mey Sreyleak',
    101,
    103,
    102,
    101,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778391487500-36950088',
    '2026-05-10 12:38:07',
    NULL,
    103
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    114,
    'STU-2026-00015',
    'sn',
    ' កូកូ',
    'Female',
    '2026-04-26',
    'សុភាព',
    'នីតា',
    100,
    101,
    101,
    103,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778483773354-859475485',
    '2026-05-11 14:16:13',
    NULL,
    103
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    115,
    'STU-2026-00016',
    'sn',
    ' កូកូ',
    'Other',
    '2017-05-01',
    'សុភាព',
    'នីតា',
    100,
    100,
    102,
    100,
    '099897899',
    'ស្វាយរៀង',
    'Image-1778484946589-384372141',
    '2026-05-11 14:35:46',
    NULL,
    NULL
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    116,
    'STU-2026-00017',
    'Kou Sopeap',
    'គូ សុភាព',
    'Male',
    '2006-05-06',
    'ទីទី',
    'កនិកា',
    100,
    100,
    102,
    102,
    '099897899',
    'ស្វាយរៀង',
    'Image-1779009758430-297113976',
    '2026-05-17 16:22:38',
    NULL,
    NULL
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    117,
    'STU-2026-00018',
    'Phors',
    'ភាស់',
    'Male',
    '2022-01-06',
    'sokha',
    'Neat',
    100,
    105,
    103,
    NULL,
    '099897899',
    'SR',
    'Image-1779605062575-996582423',
    '2026-05-24 13:44:22',
    NULL,
    NULL
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    118,
    'STU-2026-00019',
    'Dara',
    'ម៉ី ស្រីល័ក្ខ',
    'Female',
    '2026-04-26',
    'sokha',
    'Neat',
    100,
    102,
    102,
    NULL,
    '099897899',
    'ភ្នំពេញ',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1779701864/student_images/1779701860842-Somphors.jpg.jpg',
    '2026-05-25 16:37:45',
    NULL,
    NULL
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    119,
    'STU-2026-00020',
    'Dara',
    'ម៉ី ស្រីល័ក្ខ',
    'Female',
    '2026-05-04',
    'sokha',
    'Neat',
    102,
    100,
    101,
    NULL,
    '099897899',
    'ភ្នំពេញ',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1780211858/student_images/1780211853049-%C3%A1%C2%9E%C2%9C%C3%A1%C2%9F%C2%89%C3%A1%C2%9E%C2%BB%C3%A1%C2%9E%C2%93%20%C3%A1%C2%9E%C2%85%C3%A1%C2%9E%C2%B6%C3%A1%C2%9E%C2%93%C3%A1%C2%9F%C2%8B%C3%A1%C2%9E%C2%90%C3%A1%C2%9E%C2%B6%C3%A1%C2%9E%C2%9C%C3%A1%C2%9E%C2%B8%281%29.JPG.jpg',
    '2026-05-31 14:17:39',
    NULL,
    NULL
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    120,
    'STU-2026-010',
    'Mey Sreyleak',
    'ម៉ី ស្រីល័ក្ខ',
    'Female',
    '2026-06-02',
    'sokha',
    'Neat',
    NULL,
    102,
    104,
    NULL,
    '0884842837',
    'ស្វាយរៀង',
    'undefined',
    '2026-06-03 10:40:28',
    NULL,
    NULL
  );
INSERT INTO
  `students` (
    `Id`,
    `StudentCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `DadName`,
    `MomName`,
    `ProgramId`,
    `ClassId`,
    `TeacherId`,
    `LevelId`,
    `Phone`,
    `Address`,
    `Image`,
    `CreateAt`,
    `ProgramType`,
    `CurrentFeeId`
  )
VALUES
  (
    121,
    'STU-2026-011',
    'Mey Sreyleak',
    'ម៉ី ស្រីល័ក្ខ',
    'Male',
    '2026-06-02',
    'sokha',
    'Neat',
    NULL,
    100,
    104,
    NULL,
    '0884842837',
    'ស្វាយរៀង',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1780458029/student_images/1780458024280-%C3%A1%C2%9E%C2%99%C3%A1%C2%9E%C2%B7%C3%A1%C2%9E%C2%93%C3%A2%C2%80%C2%8B%20%C3%A1%C2%9E%C2%9F%C3%A1%C2%9F%C2%86%C3%A1%C2%9E%C2%97%C3%A1%C2%9E%C2%B6%C3%A1%C2%9E%C2%9F%C3%A1%C2%9F%C2%8B%20%281%29.jpg.jpg',
    '2026-06-03 10:40:30',
    NULL,
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: subjects
# ------------------------------------------------------------

INSERT INTO
  `subjects` (`Id`, `SubjectName`, `KhmerName`, `CreateAt`)
VALUES
  (
    100,
    'Mathematics',
    'គណិតវិទ្យា',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `subjects` (`Id`, `SubjectName`, `KhmerName`, `CreateAt`)
VALUES
  (
    101,
    'English',
    'ភាសាអង់គ្លេស',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `subjects` (`Id`, `SubjectName`, `KhmerName`, `CreateAt`)
VALUES
  (102, 'Physics', 'រូបវិទ្យា', '2026-05-06 11:22:16');
INSERT INTO
  `subjects` (`Id`, `SubjectName`, `KhmerName`, `CreateAt`)
VALUES
  (
    103,
    'Chemistry',
    'គីមីវិទ្យា',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `subjects` (`Id`, `SubjectName`, `KhmerName`, `CreateAt`)
VALUES
  (104, 'Khmer', 'ភាសាខ្មែរ', '2026-05-06 11:22:16');
INSERT INTO
  `subjects` (`Id`, `SubjectName`, `KhmerName`, `CreateAt`)
VALUES
  (105, 'Khmer', 'ភាសាខ្មែរ', '2026-05-20 21:25:16');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: teacher_attendance
# ------------------------------------------------------------

INSERT INTO
  `teacher_attendance` (
    `Id`,
    `TeacherId`,
    `AttendanceDate`,
    `CheckInTime`,
    `CheckOutTime`,
    `CheckInLat`,
    `CheckInLng`,
    `CheckOutLat`,
    `CheckOutLng`,
    `Status`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (
    100,
    100,
    '2026-05-01',
    '2026-05-01 06:50:00',
    '2026-05-01 16:00:00',
    NULL,
    NULL,
    NULL,
    NULL,
    'OnTime',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `teacher_attendance` (
    `Id`,
    `TeacherId`,
    `AttendanceDate`,
    `CheckInTime`,
    `CheckOutTime`,
    `CheckInLat`,
    `CheckInLng`,
    `CheckOutLat`,
    `CheckOutLng`,
    `Status`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (
    101,
    101,
    '2026-05-01',
    '2026-05-01 07:10:00',
    '2026-05-01 16:00:00',
    NULL,
    NULL,
    NULL,
    NULL,
    'Late',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `teacher_attendance` (
    `Id`,
    `TeacherId`,
    `AttendanceDate`,
    `CheckInTime`,
    `CheckOutTime`,
    `CheckInLat`,
    `CheckInLng`,
    `CheckOutLat`,
    `CheckOutLng`,
    `Status`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (
    102,
    102,
    '2026-05-01',
    '2026-05-01 06:55:00',
    '2026-05-01 16:00:00',
    NULL,
    NULL,
    NULL,
    NULL,
    'OnTime',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `teacher_attendance` (
    `Id`,
    `TeacherId`,
    `AttendanceDate`,
    `CheckInTime`,
    `CheckOutTime`,
    `CheckInLat`,
    `CheckInLng`,
    `CheckOutLat`,
    `CheckOutLng`,
    `Status`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (
    103,
    103,
    '2026-05-01',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Absent',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `teacher_attendance` (
    `Id`,
    `TeacherId`,
    `AttendanceDate`,
    `CheckInTime`,
    `CheckOutTime`,
    `CheckInLat`,
    `CheckInLng`,
    `CheckOutLat`,
    `CheckOutLng`,
    `Status`,
    `Remark`,
    `CreateAt`
  )
VALUES
  (
    104,
    104,
    '2026-05-01',
    '2026-05-01 06:45:00',
    '2026-05-01 16:00:00',
    NULL,
    NULL,
    NULL,
    NULL,
    'OnTime',
    NULL,
    '2026-05-06 11:22:16'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: teacher_class_subjects
# ------------------------------------------------------------

INSERT INTO
  `teacher_class_subjects` (`Id`, `TeacherId`, `ClassId`, `SubjectId`)
VALUES
  (100, 100, 100, 100);
INSERT INTO
  `teacher_class_subjects` (`Id`, `TeacherId`, `ClassId`, `SubjectId`)
VALUES
  (101, 101, 101, 101);
INSERT INTO
  `teacher_class_subjects` (`Id`, `TeacherId`, `ClassId`, `SubjectId`)
VALUES
  (102, 102, 102, 102);
INSERT INTO
  `teacher_class_subjects` (`Id`, `TeacherId`, `ClassId`, `SubjectId`)
VALUES
  (103, 103, 103, 103);
INSERT INTO
  `teacher_class_subjects` (`Id`, `TeacherId`, `ClassId`, `SubjectId`)
VALUES
  (104, 104, 104, 104);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: teachers
# ------------------------------------------------------------

INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    100,
    'T-2026-001',
    'Sok Dara',
    'សុខ ដារ៉ា',
    'Male',
    '2026-05-01',
    '010111111',
    'Morning',
    'ភ្នំពេញ',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1779700244/teacher_images/1779700238553-Somphors1.jpg.jpg',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    101,
    'T-2026-002',
    'Chan Rithy',
    'ចាន់ រិទ្ធី',
    'Male',
    '1988-05-15',
    '010222222',
    'Morning',
    'កណ្ដាល',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    102,
    'T-2026-003',
    'Kim Sreypov',
    'គឹម ស្រីពៅ',
    'Female',
    '1992-07-20',
    '010333333',
    'Afternoon',
    'តាកែវ',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    103,
    'T-2026-004',
    'Lay Vanna',
    'ឡាយ វណ្ណា',
    'Male',
    '1985-03-25',
    '010444444',
    'Evening',
    'កំពង់ចាម',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    104,
    'T-2026-005',
    'Noun Sopheak',
    'នួន សុភ័ក្រ',
    'Male',
    '1991-09-18',
    '010555555',
    'Morning',
    'ភ្នំពេញ',
    NULL,
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    105,
    'T-2026-006',
    'Mey Sreyleak',
    'ម៉ី ស្រីល័ក្ខ',
    'Other',
    '2026-05-04',
    NULL,
    'Evening',
    'ស្វាយរៀង',
    'Image-1778491069387-894220386',
    '2026-05-11 16:17:49'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    106,
    'T-2026-007',
    'Yen Somphors',
    'យិន សំភាស់',
    'Male',
    '2026-05-03',
    NULL,
    'Afternoon',
    'ភ្នំពេញ',
    'Image-1778491437420-204309958',
    '2026-05-11 16:23:57'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    107,
    'T-2026-008',
    'Von Chanthavy',
    'វ៉ុន ចាន់ថាវី',
    'Female',
    '2021-04-26',
    '087678900',
    'Morning',
    'PP',
    'Image-1778491906527-275493899',
    '2026-05-11 16:31:46'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    108,
    'T-2026-009',
    'Vy Savit',
    'វី សាវីត',
    'Male',
    '2026-03-05',
    '0972810396',
    'Morning',
    'PP',
    'Image-1779009913726-875814487',
    '2026-05-17 16:25:13'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    109,
    'T-2026-010',
    'Mey Sreyleak',
    'ម៉ី ស្រីល័ក្ខ',
    'Other',
    '2026-05-04',
    '0884842837',
    'Evening',
    'ស្វាយរៀង',
    NULL,
    '2026-05-25 14:41:42'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    110,
    'T-2026-011',
    'Mey Mey',
    'ម៉ី ម៉ី',
    'Male',
    '2026-04-29',
    '0884842837',
    'Evening',
    'ស្វាយរៀង',
    'Image-1779697370041-335355285',
    '2026-05-25 15:22:50'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    111,
    'T-2026-012',
    'Mana',
    'ម៉ី ម៉ី',
    'Male',
    '2026-04-26',
    '0884842837',
    'Morning + Afternoon + Evening',
    'ស្វាយរៀង',
    'Image-1779697414620-250086342',
    '2026-05-25 15:23:34'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    112,
    'T-2026-013',
    'Mey Sreyleak',
    'ម៉ី ស្រីល័ក្ខ',
    'Other',
    '2026-05-04',
    '09978987',
    'Afternoon + Evening',
    'ស្វាយរៀង',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1779700166/teacher_images/1779700159115-Sreyleak.JPG.jpg',
    '2026-05-25 16:09:27'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    113,
    'T-2026-014',
    'Mey Sreyleak',
    'ម៉ី ស្រីល័ក្ខ',
    'Other',
    '2026-05-04',
    '09978987',
    'Afternoon + Evening',
    'ស្វាយរៀង',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1779700172/teacher_images/1779700165221-Sreyleak.JPG.jpg',
    '2026-05-25 16:09:32'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    114,
    'T-2026-015',
    'Mey Sreyleak',
    'ម៉ី ស្រីល័ក្ខ',
    'Other',
    '2026-05-04',
    '09978987',
    'Afternoon + Evening',
    'ស្វាយរៀង',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1779700176/teacher_images/1779700161313-Sreyleak.JPG.jpg',
    '2026-05-25 16:09:36'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    115,
    'T-2026-016',
    'Mey Sreyleak',
    'ម៉ី ស្រីល័ក្ខ',
    'Other',
    '2026-05-04',
    '09978987',
    'Afternoon + Evening',
    'ស្វាយរៀង',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1779700179/teacher_images/1779700162511-Sreyleak.JPG.jpg',
    '2026-05-25 16:09:39'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    116,
    'T-2026-017',
    'Yin Somephors',
    'យិន សំភាស់',
    'Female',
    '2026-06-01',
    '09978987',
    'Morning + Afternoon + Evening',
    'ស្វាយរៀង',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1780458530/teacher_images/1780458524897-%C3%A1%C2%9E%C2%9C%C3%A1%C2%9F%C2%89%C3%A1%C2%9E%C2%BB%C3%A1%C2%9E%C2%93%20%C3%A1%C2%9E%C2%85%C3%A1%C2%9E%C2%B6%C3%A1%C2%9E%C2%93%C3%A1%C2%9F%C2%8B%C3%A1%C2%9E%C2%90%C3%A1%C2%9E%C2%B6%C3%A1%C2%9E%C2%9C%C3%A1%C2%9E%C2%B8.JPG.jpg',
    '2026-06-03 10:48:50'
  );
INSERT INTO
  `teachers` (
    `Id`,
    `TeacherCode`,
    `Name`,
    `KhmerName`,
    `Gender`,
    `DOB`,
    `Phone`,
    `Shift`,
    `Address`,
    `Image`,
    `CreateAt`
  )
VALUES
  (
    117,
    'T-2026-018',
    'Yin Somephors',
    'យិន សំភាស់',
    'Female',
    '2026-06-01',
    '09978987',
    'Morning + Afternoon + Evening',
    'ស្វាយរៀង',
    'https://res.cloudinary.com/dlwqbx8f4/image/upload/v1780458533/teacher_images/1780458527243-%C3%A1%C2%9E%C2%9C%C3%A1%C2%9F%C2%89%C3%A1%C2%9E%C2%BB%C3%A1%C2%9E%C2%93%20%C3%A1%C2%9E%C2%85%C3%A1%C2%9E%C2%B6%C3%A1%C2%9E%C2%93%C3%A1%C2%9F%C2%8B%C3%A1%C2%9E%C2%90%C3%A1%C2%9E%C2%B6%C3%A1%C2%9E%C2%9C%C3%A1%C2%9E%C2%B8.JPG.jpg',
    '2026-06-03 10:48:54'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: timetables
# ------------------------------------------------------------

INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    100,
    100,
    100,
    100,
    'Monday',
    '07:00:00',
    '08:00:00',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    101,
    101,
    101,
    101,
    'Tuesday',
    '08:00:00',
    '09:00:00',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    102,
    102,
    102,
    102,
    'Wednesday',
    '09:00:00',
    '10:00:00',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    103,
    103,
    103,
    103,
    'Thursday',
    '10:00:00',
    '11:00:00',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    104,
    104,
    104,
    104,
    'Friday',
    '11:00:00',
    '12:00:00',
    '2026-05-06 11:22:16'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    177,
    100,
    100,
    100,
    'Monday',
    '07:00:00',
    '08:00:00',
    '2026-05-31 21:53:53'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    178,
    101,
    101,
    101,
    'Monday',
    '08:00:00',
    '09:00:00',
    '2026-05-31 21:53:53'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    179,
    102,
    102,
    100,
    'Monday',
    '09:00:00',
    '10:00:00',
    '2026-05-31 21:53:53'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    180,
    103,
    102,
    101,
    'Monday',
    '10:00:00',
    '11:00:00',
    '2026-05-31 21:53:53'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    181,
    104,
    103,
    102,
    'Monday',
    '11:00:00',
    '12:00:00',
    '2026-05-31 21:53:53'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    182,
    105,
    100,
    101,
    'Monday',
    '13:00:00',
    '14:00:00',
    '2026-05-31 21:53:53'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    195,
    100,
    102,
    102,
    'Tuesday',
    '07:00:00',
    '08:00:00',
    '2026-05-31 21:55:09'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    196,
    101,
    100,
    103,
    'Tuesday',
    '08:00:00',
    '09:00:00',
    '2026-05-31 21:55:09'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    197,
    102,
    101,
    104,
    'Tuesday',
    '09:00:00',
    '10:00:00',
    '2026-05-31 21:55:09'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    198,
    103,
    103,
    105,
    'Tuesday',
    '10:00:00',
    '11:00:00',
    '2026-05-31 21:55:09'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    199,
    104,
    104,
    110,
    'Tuesday',
    '11:00:00',
    '12:00:00',
    '2026-05-31 21:55:09'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    200,
    105,
    100,
    111,
    'Tuesday',
    '13:00:00',
    '14:00:00',
    '2026-05-31 21:55:09'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    201,
    100,
    100,
    101,
    'Wednesday',
    '07:00:00',
    '08:00:00',
    '2026-05-31 21:55:42'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    202,
    101,
    102,
    102,
    'Wednesday',
    '08:00:00',
    '09:00:00',
    '2026-05-31 21:55:42'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    203,
    102,
    104,
    100,
    'Wednesday',
    '09:00:00',
    '10:00:00',
    '2026-05-31 21:55:42'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    204,
    103,
    101,
    102,
    'Wednesday',
    '10:00:00',
    '11:00:00',
    '2026-05-31 21:55:42'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    205,
    104,
    105,
    110,
    'Wednesday',
    '11:00:00',
    '12:00:00',
    '2026-05-31 21:55:42'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    206,
    105,
    103,
    107,
    'Wednesday',
    '13:00:00',
    '14:00:00',
    '2026-05-31 21:55:42'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    207,
    100,
    100,
    111,
    'Thursday',
    '07:00:00',
    '08:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    208,
    101,
    103,
    106,
    'Thursday',
    '08:00:00',
    '09:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    209,
    102,
    101,
    109,
    'Thursday',
    '09:00:00',
    '10:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    210,
    103,
    100,
    107,
    'Thursday',
    '10:00:00',
    '11:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    211,
    104,
    104,
    102,
    'Thursday',
    '11:00:00',
    '12:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    212,
    105,
    103,
    103,
    'Thursday',
    '13:00:00',
    '14:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    213,
    100,
    104,
    105,
    'Friday',
    '07:00:00',
    '08:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    214,
    101,
    100,
    108,
    'Friday',
    '08:00:00',
    '09:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    215,
    102,
    103,
    102,
    'Friday',
    '09:00:00',
    '10:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    216,
    103,
    103,
    110,
    'Friday',
    '10:00:00',
    '11:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    217,
    104,
    100,
    103,
    'Friday',
    '11:00:00',
    '12:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    218,
    105,
    104,
    101,
    'Friday',
    '13:00:00',
    '14:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    219,
    100,
    105,
    100,
    'Saturday',
    '07:00:00',
    '08:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    220,
    101,
    102,
    104,
    'Saturday',
    '08:00:00',
    '09:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    221,
    102,
    103,
    102,
    'Saturday',
    '09:00:00',
    '10:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    222,
    103,
    101,
    103,
    'Saturday',
    '10:00:00',
    '11:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    223,
    104,
    104,
    104,
    'Saturday',
    '11:00:00',
    '12:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    224,
    105,
    105,
    115,
    'Saturday',
    '13:00:00',
    '14:00:00',
    '2026-05-31 21:56:04'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    225,
    100,
    102,
    100,
    'Monday',
    '08:30:00',
    '09:00:00',
    '2026-06-01 10:54:25'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    226,
    100,
    100,
    111,
    'Monday',
    '10:00:00',
    '11:30:00',
    '2026-06-01 10:54:25'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    227,
    100,
    103,
    102,
    'Monday',
    '01:00:00',
    '02:30:00',
    '2026-06-01 10:54:25'
  );
INSERT INTO
  `timetables` (
    `Id`,
    `ClassId`,
    `SubjectId`,
    `TeacherId`,
    `DayOfWeek`,
    `StartTime`,
    `EndTime`,
    `CreateAt`
  )
VALUES
  (
    228,
    100,
    104,
    104,
    'Monday',
    '03:00:00',
    '04:30:00',
    '2026-06-01 10:54:25'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (
    `Id`,
    `Name`,
    `Email`,
    `Password`,
    `Role`,
    `TeacherId`,
    `StudentId`,
    `StaffId`,
    `IsActive`,
    `LastLogin`,
    `CreateAt`,
    `UpdatedAt`
  )
VALUES
  (
    100,
    'Staff Phors',
    'acrobejohn@gmail.com',
    '$2b$10$TUalPledYxFpfshlcl8xX.0YqvCRuxoXIC9JqkWcxhGkhU0UqVayK',
    'staff',
    NULL,
    NULL,
    103,
    1,
    '2026-06-01 10:46:52',
    '2026-05-06 11:22:16',
    '2026-06-01 10:46:52'
  );
INSERT INTO
  `users` (
    `Id`,
    `Name`,
    `Email`,
    `Password`,
    `Role`,
    `TeacherId`,
    `StudentId`,
    `StaffId`,
    `IsActive`,
    `LastLogin`,
    `CreateAt`,
    `UpdatedAt`
  )
VALUES
  (
    101,
    'Student Phors',
    'meysreyleak08@gmail.com',
    '$2b$10$kQXPzNQwaCoX2XEDtZzCxOrE8sfEEuj8xTf5zk48OEMq5pj.LEDEK',
    'student',
    NULL,
    100,
    100,
    1,
    '2026-06-01 10:45:27',
    '2026-05-06 11:22:16',
    '2026-06-01 10:45:27'
  );
INSERT INTO
  `users` (
    `Id`,
    `Name`,
    `Email`,
    `Password`,
    `Role`,
    `TeacherId`,
    `StudentId`,
    `StaffId`,
    `IsActive`,
    `LastLogin`,
    `CreateAt`,
    `UpdatedAt`
  )
VALUES
  (
    102,
    'Admin Phors',
    'meyling0817@gmail.com',
    '$2b$10$TUalPledYxFpfshlcl8xX.0YqvCRuxoXIC9JqkWcxhGkhU0UqVayK',
    'admin',
    NULL,
    NULL,
    NULL,
    1,
    '2026-06-01 10:45:27',
    '2026-05-06 11:22:16',
    '2026-06-01 10:45:27'
  );
INSERT INTO
  `users` (
    `Id`,
    `Name`,
    `Email`,
    `Password`,
    `Role`,
    `TeacherId`,
    `StudentId`,
    `StaffId`,
    `IsActive`,
    `LastLogin`,
    `CreateAt`,
    `UpdatedAt`
  )
VALUES
  (
    103,
    'Teacher Thavy',
    'yinsomphors2212@gmail.com',
    '$2b$10$TUalPledYxFpfshlcl8xX.0YqvCRuxoXIC9JqkWcxhGkhU0UqVayK',
    'teacher',
    102,
    NULL,
    NULL,
    1,
    '2026-06-01 10:45:27',
    '2026-05-06 11:22:16',
    '2026-06-01 10:45:27'
  );
INSERT INTO
  `users` (
    `Id`,
    `Name`,
    `Email`,
    `Password`,
    `Role`,
    `TeacherId`,
    `StudentId`,
    `StaffId`,
    `IsActive`,
    `LastLogin`,
    `CreateAt`,
    `UpdatedAt`
  )
VALUES
  (
    104,
    'Student Sreyleak',
    'test@gmail.com',
    '$2b$10$TUalPledYxFpfshlcl8xX.0YqvCRuxoXIC9JqkWcxhGkhU0UqVayK',
    'student',
    NULL,
    102,
    NULL,
    1,
    '2026-06-01 10:45:27',
    '2026-05-06 11:22:16',
    '2026-06-01 10:45:27'
  );
INSERT INTO
  `users` (
    `Id`,
    `Name`,
    `Email`,
    `Password`,
    `Role`,
    `TeacherId`,
    `StudentId`,
    `StaffId`,
    `IsActive`,
    `LastLogin`,
    `CreateAt`,
    `UpdatedAt`
  )
VALUES
  (
    105,
    'Admin Sreyleak',
    'sreyleakmey376@gmail.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin',
    NULL,
    NULL,
    NULL,
    1,
    '2026-05-28 12:26:39',
    '2026-05-06 11:27:30',
    '2026-05-28 12:25:40'
  );
INSERT INTO
  `users` (
    `Id`,
    `Name`,
    `Email`,
    `Password`,
    `Role`,
    `TeacherId`,
    `StudentId`,
    `StaffId`,
    `IsActive`,
    `LastLogin`,
    `CreateAt`,
    `UpdatedAt`
  )
VALUES
  (
    107,
    'Staff Sreyleak',
    'phors007@gmail.com ',
    '$2b$10$KwqUkuzPVq22DIYCOh6DR.VBdQSm/Pd3Sl2cifrspPA83d7PQ606i',
    'staff',
    NULL,
    NULL,
    100,
    1,
    '2026-06-01 10:45:27',
    '2026-05-27 14:50:04',
    '2026-06-01 10:45:27'
  );
INSERT INTO
  `users` (
    `Id`,
    `Name`,
    `Email`,
    `Password`,
    `Role`,
    `TeacherId`,
    `StudentId`,
    `StaffId`,
    `IsActive`,
    `LastLogin`,
    `CreateAt`,
    `UpdatedAt`
  )
VALUES
  (
    108,
    'Meyling',
    'meyling17@gmail.com',
    '$2b$10$7lX.ZxiePKtKXxAwt7Txiu9YpE5Co0G7WFgc0GUOH/6s5IT.AJW2G',
    'teacher',
    101,
    NULL,
    NULL,
    1,
    '2026-05-28 12:26:39',
    '2026-05-27 22:00:19',
    '2026-05-28 12:25:40'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
