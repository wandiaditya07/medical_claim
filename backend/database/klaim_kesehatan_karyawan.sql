-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 26, 2025 at 10:28 AM
-- Server version: 8.0.30
-- PHP Version: 7.4.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `klaim_kesehatan_karyawan`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int NOT NULL,
  `user_id` int NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `details` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `action_type`, `details`, `created_at`) VALUES
(14, 1, 'CREATE_EMPLOYEE', 'Menambahkan karyawan baru: Wandi Aditya (NIK: 230444180019)', '2025-07-25 17:02:02'),
(15, 1, 'UPDATE_EMPLOYEE', 'Memperbarui data karyawan: Wandi Aditya (NIK: 230444180019)', '2025-07-25 17:07:03'),
(16, 1, 'ACTIVATE_ACCOUNT', 'Mengaktivasi akun dan status karyawan untuk Wandi Aditya', '2025-07-25 17:07:30'),
(17, 1, 'APPROVE_CLAIM', 'Menyetujui klaim #3 untuk Wandi Aditya', '2025-07-25 22:40:09'),
(18, 2, 'PAY_CLAIM', 'Membayarkan klaim #3 Wandi Aditya sejumlah Rp 150000.00', '2025-07-26 01:56:01'),
(19, 1, 'REJECT_CLAIM', 'Menolak klaim #1 untuk karyawan \"Budi Santoso\"', '2025-07-26 02:25:02'),
(20, 15, 'CREATE_CLAIM', 'Karyawan \"Wandi Aditya\" mengajukan klaim baru #4 sejumlah Rp 200000', '2025-07-26 02:48:51'),
(21, 1, 'CREATE_EMPLOYEE', 'Menambahkan karyawan baru: Wandi Aditya (NIK: 230444180019)', '2025-07-26 05:28:08'),
(22, 1, 'ACTIVATE_ACCOUNT', 'Mengaktivasi akun dan status karyawan untuk Wandi Aditya', '2025-07-26 05:29:12'),
(23, 16, 'CREATE_CLAIM', 'Karyawan \"Wandi Aditya\" mengajukan klaim baru #5 sejumlah Rp 1500000', '2025-07-26 05:30:29'),
(24, 1, 'APPROVE_CLAIM', 'Menyetujui klaim #5 untuk karyawan \"Wandi Aditya\"', '2025-07-26 05:32:01'),
(25, 2, 'PAY_CLAIM', 'Membayarkan klaim #5 untuk Wandi Aditya sejumlah Rp 1500000.00', '2025-07-26 05:32:31'),
(26, 1, 'CREATE_EMPLOYEE', 'Menambahkan karyawan baru: Rusdi (NIK: 20230034)', '2025-07-26 07:06:04'),
(27, 1, 'ACTIVATE_ACCOUNT', 'Mengaktivasi akun dan status karyawan untuk Rusdi', '2025-07-26 07:07:03'),
(28, 17, 'CREATE_CLAIM', 'Karyawan \"Rusdi\" mengajukan klaim baru #6 sejumlah Rp 2000000', '2025-07-26 07:08:43'),
(29, 1, 'APPROVE_CLAIM', 'Menyetujui klaim #6 untuk karyawan \"Rusdi\"', '2025-07-26 07:09:11'),
(30, 2, 'PAY_CLAIM', 'Membayarkan klaim #6 untuk Rusdi sejumlah Rp 2000000.00', '2025-07-26 07:09:46'),
(31, 17, 'CREATE_CLAIM', 'Karyawan \"Rusdi\" mengajukan klaim baru #7 sejumlah Rp 200000', '2025-07-26 07:30:51'),
(32, 1, 'APPROVE_CLAIM', 'Menyetujui klaim #7 untuk karyawan \"Rusdi\"', '2025-07-26 07:34:29'),
(33, 2, 'PAY_CLAIM', 'Membayarkan klaim #7 untuk Rusdi sejumlah Rp 200000.00', '2025-07-26 07:40:10'),
(34, 1, 'CREATE_EMPLOYEE', 'Menambahkan karyawan baru: Ramdan Baut (NIK: 999666)', '2025-07-26 09:01:13'),
(35, 1, 'DELETE_EMPLOYEE', 'Menghapus karyawan: Ramdan Baut (NIK: 999666)', '2025-07-26 09:07:41'),
(36, 1, 'CREATE_EMPLOYEE', 'Menambahkan karyawan baru: Andini Julita (NIK: 20230039)', '2025-07-26 09:18:28'),
(37, 1, 'CREATE_EMPLOYEE', 'Menambahkan karyawan baru: Rudi Hartono (NIK: 2023003)', '2025-07-26 09:22:43'),
(38, 1, 'CREATE_EMPLOYEE', 'Menambahkan karyawan baru: Rudi Hartono (NIK: 2023001)', '2025-07-26 09:27:31'),
(39, 1, 'DELETE_EMPLOYEE', 'Menghapus karyawan: Rudi Hartono (NIK: 2023003)', '2025-07-26 09:27:54'),
(40, 1, 'DELETE_EMPLOYEE', 'Menghapus karyawan: Rudi Hartono (NIK: 2023001)', '2025-07-26 09:27:57'),
(41, 1, 'DELETE_EMPLOYEE', 'Menghapus karyawan: Rusdi (NIK: 20230034)', '2025-07-26 09:45:12'),
(42, 1, 'DELETE_EMPLOYEE', 'Menghapus karyawan: Andini Julita (NIK: 20230039)', '2025-07-26 09:45:39'),
(43, 1, 'CREATE_EMPLOYEE', 'Menambahkan karyawan baru: Andini Julita (NIK: E002)', '2025-07-26 09:47:04'),
(44, 1, 'DELETE_EMPLOYEE', 'Menghapus karyawan: Andini Julita (NIK: E002)', '2025-07-26 09:51:26'),
(45, 1, 'DELETE_EMPLOYEE', 'Menghapus karyawan: Wandi Aditya (NIK: 230444180019)', '2025-07-26 09:51:30'),
(46, 1, 'CREATE_EMPLOYEE', 'Menambahkan karyawan baru: Wandi Aditya (NIK: 230444180019)', '2025-07-26 09:51:57'),
(47, 1, 'ACTIVATE_ACCOUNT', 'Mengaktivasi akun dan status karyawan untuk Wandi Aditya', '2025-07-26 09:52:41'),
(48, 23, 'CREATE_CLAIM', 'Karyawan \"Wandi Aditya\" mengajukan klaim baru #8 sejumlah Rp 2000000', '2025-07-26 09:54:22'),
(49, 1, 'APPROVE_CLAIM', 'Menyetujui klaim #8 untuk karyawan \"Wandi Aditya\"', '2025-07-26 09:54:49'),
(50, 2, 'PAY_CLAIM', 'Membayarkan klaim #8 untuk Wandi Aditya sejumlah Rp 2000000.00', '2025-07-26 09:57:10');

-- --------------------------------------------------------

--
-- Table structure for table `claim_approvals`
--

CREATE TABLE `claim_approvals` (
  `approval_id` int NOT NULL,
  `claim_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `approver_id` int NOT NULL,
  `approval_role` enum('HRD','KEUANGAN') NOT NULL,
  `status` enum('APPROVED','REJECTED') NOT NULL,
  `note` text,
  `approval_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `claim_limits`
--

CREATE TABLE `claim_limits` (
  `limit_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `year` year NOT NULL,
  `max_claim_amount` decimal(12,2) DEFAULT '0.00',
  `used_amount` decimal(12,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dependents`
--

CREATE TABLE `dependents` (
  `dependent_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `relationship` enum('SUAMI','ISTRI','ANAK','AYAH','IBU','SAUDARA') NOT NULL,
  `birth_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `employee_nik` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `position` varchar(50) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `base_salary` decimal(12,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_insurance_policies`
--

CREATE TABLE `employee_insurance_policies` (
  `policy_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `insurance_provider_name` varchar(100) DEFAULT NULL,
  `policy_number` varchar(100) DEFAULT NULL,
  `policy_type` enum('KESEHATAN_UMUM','RAWAT_INAP','RAWAT_JALAN') DEFAULT NULL,
  `coverage_start_date` date DEFAULT NULL,
  `coverage_end_date` date DEFAULT NULL,
  `coverage_details` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medical_claims`
--

CREATE TABLE `medical_claims` (
  `claim_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `dependent_id` int DEFAULT NULL,
  `claim_date` date NOT NULL,
  `claim_amount` decimal(12,2) NOT NULL,
  `claim_description` text,
  `receipt_file` varchar(255) DEFAULT NULL,
  `status` enum('PENGAJUAN','DISETUJUI_HRD','DITOLAK_HRD','DIBAYARKAN_KEUANGAN','DITOLAK_KEUANGAN') DEFAULT 'PENGAJUAN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('HRD','KARYAWAN','KEUANGAN') NOT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `full_name`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'hrd.admin@kantor.com', '$2a$10$xUAjcS6QqTOpfwGHoc4h..S07dBrfGOLizt1L39ppG9G2BVqlradK', 'Admin HRD', 'HRD', 1, '2025-07-23 09:01:13', '2025-07-23 09:48:26'),
(2, 'keuangan.staff@kantor.com', '$2a$10$xUAjcS6QqTOpfwGHoc4h..S07dBrfGOLizt1L39ppG9G2BVqlradK', 'Staff Keuangan', 'KEUANGAN', 1, '2025-07-23 09:01:13', '2025-07-23 09:48:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `claim_approvals`
--
ALTER TABLE `claim_approvals`
  ADD PRIMARY KEY (`approval_id`),
  ADD KEY `approver_id` (`approver_id`),
  ADD KEY `fk_approvals_employee` (`employee_id`),
  ADD KEY `claim_approvals_ibfk_1` (`claim_id`);

--
-- Indexes for table `claim_limits`
--
ALTER TABLE `claim_limits`
  ADD PRIMARY KEY (`limit_id`),
  ADD UNIQUE KEY `employee_year_unique` (`employee_id`,`year`);

--
-- Indexes for table `dependents`
--
ALTER TABLE `dependents`
  ADD PRIMARY KEY (`dependent_id`),
  ADD KEY `dependents_ibfk_1` (`employee_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `employee_nik` (`employee_nik`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `employee_insurance_policies`
--
ALTER TABLE `employee_insurance_policies`
  ADD PRIMARY KEY (`policy_id`),
  ADD KEY `employee_insurance_policies_ibfk_1` (`employee_id`);

--
-- Indexes for table `medical_claims`
--
ALTER TABLE `medical_claims`
  ADD PRIMARY KEY (`claim_id`),
  ADD KEY `medical_claims_ibfk_1` (`employee_id`),
  ADD KEY `medical_claims_ibfk_2` (`dependent_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `claim_approvals`
--
ALTER TABLE `claim_approvals`
  MODIFY `approval_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `claim_limits`
--
ALTER TABLE `claim_limits`
  MODIFY `limit_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `dependents`
--
ALTER TABLE `dependents`
  MODIFY `dependent_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `employee_insurance_policies`
--
ALTER TABLE `employee_insurance_policies`
  MODIFY `policy_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medical_claims`
--
ALTER TABLE `medical_claims`
  MODIFY `claim_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `claim_approvals`
--
ALTER TABLE `claim_approvals`
  ADD CONSTRAINT `claim_approvals_ibfk_1` FOREIGN KEY (`claim_id`) REFERENCES `medical_claims` (`claim_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `claim_approvals_ibfk_2` FOREIGN KEY (`approver_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_approvals_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `claim_limits`
--
ALTER TABLE `claim_limits`
  ADD CONSTRAINT `claim_limits_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `dependents`
--
ALTER TABLE `dependents`
  ADD CONSTRAINT `dependents_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_insurance_policies`
--
ALTER TABLE `employee_insurance_policies`
  ADD CONSTRAINT `employee_insurance_policies_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `medical_claims`
--
ALTER TABLE `medical_claims`
  ADD CONSTRAINT `medical_claims_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `medical_claims_ibfk_2` FOREIGN KEY (`dependent_id`) REFERENCES `dependents` (`dependent_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
