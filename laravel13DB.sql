-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 02, 2026 at 10:43 PM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laravel13DB`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `deal_id` bigint(20) UNSIGNED DEFAULT NULL,
  `contact_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `user_id`, `deal_id`, `contact_id`, `type`, `title`, `description`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 1, 7, 11, 'deal_moved', 'Moved deal \'TechCorp Inc. - Enterprise Deal\' to Won', NULL, NULL, '2026-04-02 05:11:30', '2026-04-02 05:11:30'),
(2, 1, 17, 1, 'deal_created', 'Created deal: Cairocoers', NULL, NULL, '2026-04-02 05:13:19', '2026-04-02 05:13:19'),
(3, 1, 17, 1, 'deal_moved', 'Moved deal \'Cairocoers updated\' to Lead', NULL, NULL, '2026-04-02 05:13:42', '2026-04-02 05:13:42'),
(4, 1, 17, 1, 'deal_moved', 'Moved deal \'Cairocoers updated\' to Contacted', NULL, NULL, '2026-04-02 05:13:52', '2026-04-02 05:13:52'),
(6, 1, 1, NULL, 'task_completed', 'Completed task: Follow up with John Smith', NULL, NULL, '2026-04-02 05:17:03', '2026-04-02 05:17:03'),
(7, 1, NULL, NULL, 'task_created', 'Created task: Sample task', NULL, NULL, '2026-04-02 05:18:18', '2026-04-02 05:18:18'),
(8, 1, NULL, NULL, 'task_completed', 'Completed task: Sample task', NULL, NULL, '2026-04-02 05:18:25', '2026-04-02 05:18:25'),
(9, 1, 12, NULL, 'task_completed', 'Completed task: Follow up with Amanda White', NULL, NULL, '2026-04-02 05:18:28', '2026-04-02 05:18:28'),
(10, 1, 18, 1, 'deal_created', 'Created deal: sample deal one', NULL, NULL, '2026-04-02 14:33:21', '2026-04-02 14:33:21'),
(11, 1, 18, 1, 'deal_moved', 'Moved deal \'sample deal one updated\' to Lead', NULL, NULL, '2026-04-02 14:33:51', '2026-04-02 14:33:51'),
(12, 1, 15, 18, 'deal_moved', 'Moved deal \'Security Audit Service\' to Contacted', NULL, NULL, '2026-04-02 14:34:01', '2026-04-02 14:34:01'),
(13, 1, 15, 18, 'deal_moved', 'Moved deal \'Security Audit Service\' to Qualified', NULL, NULL, '2026-04-02 14:34:08', '2026-04-02 14:34:08'),
(14, 1, 18, 1, 'deal_moved', 'Moved deal \'sample deal one updated\' to Contacted', NULL, NULL, '2026-04-02 14:34:11', '2026-04-02 14:34:11'),
(15, 1, 10, 16, 'deal_moved', 'Moved deal \'Creative Studios - Standard Deal\' to Won', NULL, NULL, '2026-04-02 14:34:24', '2026-04-02 14:34:24'),
(16, 1, 4, 6, 'deal_moved', 'Moved deal \'Creative Studios - Standard Deal\' to Qualified', NULL, NULL, '2026-04-02 14:35:42', '2026-04-02 14:35:42'),
(19, 1, 1, NULL, 'task_completed', 'Completed task: Follow up with John Smith', NULL, NULL, '2026-04-02 14:38:21', '2026-04-02 14:38:21'),
(20, 1, 1, NULL, 'task_created', 'Created task: Sample task', NULL, NULL, '2026-04-02 14:39:24', '2026-04-02 14:39:24'),
(21, 1, 1, NULL, 'task_completed', 'Completed task: Sample task', NULL, NULL, '2026-04-02 14:39:32', '2026-04-02 14:39:32');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-a927878e2ba05efd437ca320bd3cf4a5', 'i:1;', 1775169204),
('laravel-cache-a927878e2ba05efd437ca320bd3cf4a5:timer', 'i:1775169204;', 1775169204);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `source` enum('website','referral','social','cold_call','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other',
  `status` enum('lead','prospect','customer','churned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'lead',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `company`, `position`, `notes`, `source`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'John', 'Smith', 'john.smith@techcorp.com', '+1 555-0101', 'TechCorp Inc.', 'CEO', NULL, 'website', 'customer', '2026-04-02 05:09:00', '2026-04-02 05:09:00'),
(2, 1, 'Sarah', 'Johnson', 'sarah.j@startup.io', '+1 555-0102', 'Startup.io', 'CTO', NULL, 'referral', 'customer', '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(3, 1, 'Michael', 'Brown', 'mbrown@enterprise.com', '+1 555-0103', 'Enterprise Ltd.', 'VP Sales', NULL, 'cold_call', 'prospect', '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(4, 1, 'Emily', 'Davis', 'emily.d@design.co', '+1 555-0104', 'Design Co.', 'Founder', NULL, 'social', 'lead', '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(5, 1, 'Robert', 'Wilson', 'r.wilson@global.net', '+1 555-0105', 'Global Networks', 'Procurement Manager', NULL, 'website', 'lead', '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(6, 1, 'Jennifer', 'Martinez', 'jmartinez@creative.com', '+1 555-0106', 'Creative Studios', 'Director', NULL, 'referral', 'prospect', '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(7, 1, 'David', 'Lee', 'dlee@innovate.tech', '+1 555-0107', 'Innovate Tech', 'Product Manager', NULL, 'website', 'lead', '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(8, 1, 'Lisa', 'Anderson', 'l.anderson@solutions.com', '+1 555-0108', 'Solutions Inc.', 'IT Manager', NULL, 'cold_call', 'prospect', '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(9, 1, 'James', 'Taylor', 'jtaylor@finance.group', '+1 555-0109', 'Finance Group', 'CFO', NULL, 'referral', 'churned', '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(10, 1, 'Amanda', 'White', 'awhite@retail.co', '+1 555-0110', 'Retail Co.', 'Operations Director', NULL, 'social', 'customer', '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(11, 1, 'John', 'Smith', 'john.smith@techcorp.com', '+1 555-0101', 'TechCorp Inc.', 'CEO', NULL, 'website', 'customer', '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(12, 1, 'Sarah', 'Johnson', 'sarah.j@startup.io', '+1 555-0102', 'Startup.io', 'CTO', NULL, 'referral', 'customer', '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(13, 1, 'Michael', 'Brown', 'mbrown@enterprise.com', '+1 555-0103', 'Enterprise Ltd.', 'VP Sales', NULL, 'cold_call', 'prospect', '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(14, 1, 'Emily', 'Davis', 'emily.d@design.co', '+1 555-0104', 'Design Co.', 'Founder', NULL, 'social', 'lead', '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(15, 1, 'Robert', 'Wilson', 'r.wilson@global.net', '+1 555-0105', 'Global Networks', 'Procurement Manager', NULL, 'website', 'lead', '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(16, 1, 'Jennifer', 'Martinez', 'jmartinez@creative.com', '+1 555-0106', 'Creative Studios', 'Director', NULL, 'referral', 'prospect', '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(17, 1, 'David', 'Lee', 'dlee@innovate.tech', '+1 555-0107', 'Innovate Tech', 'Product Manager', NULL, 'website', 'lead', '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(18, 1, 'Lisa', 'Anderson', 'l.anderson@solutions.com', '+1 555-0108', 'Solutions Inc.', 'IT Manager', NULL, 'cold_call', 'prospect', '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(19, 1, 'James', 'Taylor', 'jtaylor@finance.group', '+1 555-0109', 'Finance Group', 'CFO', NULL, 'referral', 'churned', '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(20, 1, 'Amanda', 'White', 'awhite@retail.co', '+1 555-0110', 'Retail Co.', 'Operations Director', NULL, 'social', 'customer', '2026-04-02 05:09:28', '2026-04-02 05:09:28');

-- --------------------------------------------------------

--
-- Table structure for table `deals`
--

CREATE TABLE `deals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `contact_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `stage_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('open','won','lost','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `expected_close_date` date DEFAULT NULL,
  `closed_at` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deals`
--

INSERT INTO `deals` (`id`, `contact_id`, `user_id`, `stage_id`, `title`, `value`, `status`, `expected_close_date`, `closed_at`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 6, 'TechCorp Inc. - Enterprise Deal', '24069.00', 'won', '2026-05-12', '2026-02-11', NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(2, 2, 1, 6, 'Startup.io - Enterprise Deal', '5593.00', 'won', '2026-06-29', '2026-02-01', NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(3, 3, 1, 4, 'Enterprise Ltd. - Standard Deal', '18886.00', 'open', '2026-06-27', NULL, NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(4, 6, 1, 1, 'Creative Studios - Standard Deal', '35648.00', 'open', '2026-06-26', NULL, NULL, '2026-04-02 05:09:01', '2026-04-02 14:35:42'),
(5, 8, 1, 5, 'Solutions Inc. - Standard Deal', '11850.00', 'open', '2026-05-19', NULL, NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(6, 10, 1, 6, 'Retail Co. - Enterprise Deal', '33854.00', 'won', '2026-05-30', '2026-02-13', NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(7, 11, 1, 7, 'TechCorp Inc. - Enterprise Deal', '20736.00', 'won', '2026-05-10', '2026-02-09', NULL, '2026-04-02 05:09:28', '2026-04-02 05:11:30'),
(8, 12, 1, 6, 'Startup.io - Enterprise Deal', '45501.00', 'won', '2026-06-30', '2026-03-19', NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(9, 13, 1, 6, 'Enterprise Ltd. - Standard Deal', '39768.00', 'open', '2026-06-11', NULL, NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(10, 16, 1, 7, 'Creative Studios - Standard Deal', '5636.00', 'open', '2026-06-28', NULL, NULL, '2026-04-02 05:09:28', '2026-04-02 14:34:24'),
(11, 18, 1, 1, 'Solutions Inc. - Standard Deal', '20698.00', 'open', '2026-05-19', NULL, NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(12, 20, 1, 6, 'Retail Co. - Enterprise Deal', '32771.00', 'won', '2026-06-24', '2026-04-01', NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(13, 6, 1, 5, 'Cloud Migration Project', '35000.00', 'open', '2026-05-19', NULL, NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(14, 18, 1, 4, 'Annual Support Contract', '15000.00', 'open', '2026-06-10', NULL, NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(15, 18, 1, 2, 'Security Audit Service', '22000.00', 'open', '2026-07-23', NULL, NULL, '2026-04-02 05:09:28', '2026-04-02 14:34:08'),
(16, 5, 1, 4, 'Digital Transformation', '75000.00', 'open', '2026-06-30', NULL, NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(17, 1, 1, 3, 'Cairocoers updated', '300.00', 'open', '2026-01-11', NULL, NULL, '2026-04-02 05:13:19', '2026-04-02 05:13:52'),
(18, 1, 1, 3, 'sample deal one updated', '200.00', 'open', '2026-04-03', NULL, NULL, '2026-04-02 14:33:21', '2026-04-02 14:34:11');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `deal_id` bigint(20) UNSIGNED NOT NULL,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `tax` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `status` enum('draft','sent','paid','overdue','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `paid_at` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `deal_id`, `invoice_number`, `amount`, `tax`, `total`, `status`, `issue_date`, `due_date`, `paid_at`, `notes`, `created_at`, `updated_at`) VALUES
(2, 1, 'INV-000002', '19255.20', '4813.80', '24069.00', 'paid', '2026-01-10', '2026-03-04', '2026-03-19', NULL, '2026-04-02 14:13:41', '2026-04-02 14:13:41'),
(3, 2, 'INV-000003', '4474.40', '1118.60', '5593.00', 'paid', '2026-01-31', '2026-03-21', '2026-04-01', NULL, '2026-04-02 14:13:41', '2026-04-02 14:13:41'),
(4, 6, 'INV-000004', '27083.20', '6770.80', '33854.00', 'paid', '2026-02-16', '2026-03-12', '2026-03-20', NULL, '2026-04-02 14:13:41', '2026-04-02 14:13:41'),
(5, 7, 'INV-000005', '16588.80', '4147.20', '20736.00', 'paid', '2026-01-14', '2026-03-03', '2026-03-26', NULL, '2026-04-02 14:13:41', '2026-04-02 14:13:41'),
(6, 8, 'INV-000006', '36400.80', '9100.20', '45501.00', 'paid', '2026-01-27', '2026-03-11', '2026-03-23', NULL, '2026-04-02 14:13:41', '2026-04-02 14:13:41'),
(7, 12, 'INV-000007', '26216.80', '6554.20', '32771.00', 'paid', '2026-01-19', '2026-03-10', '2026-03-23', NULL, '2026-04-02 14:13:41', '2026-04-02 14:13:41'),
(8, 3, 'INV-000008', '16053.10', '2832.90', '18886.00', 'draft', '2026-03-06', '2026-04-04', NULL, NULL, '2026-04-02 14:13:45', '2026-04-02 14:13:45'),
(9, 4, 'INV-000009', '30300.80', '5347.20', '35648.00', 'sent', '2026-03-16', '2026-04-17', '2026-03-28', NULL, '2026-04-02 14:13:45', '2026-04-02 14:13:45'),
(10, 5, 'INV-000010', '10072.50', '1777.50', '11850.00', 'overdue', '2026-03-05', '2026-04-30', NULL, NULL, '2026-04-02 14:13:45', '2026-04-02 14:13:45'),
(11, 9, 'INV-000011', '33802.80', '5965.20', '39768.00', 'sent', '2026-03-30', '2026-05-02', NULL, NULL, '2026-04-02 14:13:45', '2026-04-02 14:40:26'),
(12, 10, 'INV-000012', '4790.60', '845.40', '5636.00', 'sent', '2026-03-29', '2026-04-21', '2026-03-30', NULL, '2026-04-02 14:13:45', '2026-04-02 14:13:45');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_14_170933_add_two_factor_columns_to_users_table', 1),
(5, '2026_04_02_123054_create_crm_tables', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pipelines`
--

CREATE TABLE `pipelines` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pipelines`
--

INSERT INTO `pipelines` (`id`, `name`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 'Sales Pipeline', 1, '2026-04-02 04:33:52', '2026-04-02 04:33:52');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('cIvg3pSg6YemCf93wNmSYiLKlC0THi0R1GdBaCEs', NULL, '127.0.0.1', 'curl/8.7.1', 'eyJfdG9rZW4iOiJSOHdLaDhCOUpGaUNZbWFMdXhLVmRnOHJHTUI4N1lTQjVJcG94RHlUIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hcGlcL2RlYWxzIiwicm91dGUiOiJkZWFscy5pbmRleCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1775167703),
('CXaWLEt8jfxunh0qo6koA2LdbScnpp0e4KwN3gxU', 1, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJVOFZSU0R2Y0Z0ODJpaktnUEFJeWpWZFF5RXJabUVCVHI0ckhzWlJUIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MSwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hcGlcL3BpcGVsaW5lIiwicm91dGUiOm51bGx9fQ==', 1775169746);

-- --------------------------------------------------------

--
-- Table structure for table `stages`
--

CREATE TABLE `stages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pipeline_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int(11) NOT NULL DEFAULT '0',
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_win` tinyint(1) NOT NULL DEFAULT '0',
  `is_loss` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stages`
--

INSERT INTO `stages` (`id`, `pipeline_id`, `name`, `order`, `color`, `is_win`, `is_loss`, `created_at`, `updated_at`) VALUES
(1, 1, 'Lead', 1, '#6366f1', 0, 0, '2026-04-02 04:33:52', '2026-04-02 04:33:52'),
(2, 1, 'Contacted', 2, '#8b5cf6', 0, 0, '2026-04-02 04:33:52', '2026-04-02 04:33:52'),
(3, 1, 'Qualified', 3, '#ec4899', 0, 0, '2026-04-02 04:33:52', '2026-04-02 04:33:52'),
(4, 1, 'Proposal', 4, '#f59e0b', 0, 0, '2026-04-02 04:33:52', '2026-04-02 04:33:52'),
(5, 1, 'Negotiation', 5, '#10b981', 0, 0, '2026-04-02 04:33:52', '2026-04-02 04:33:52'),
(6, 1, 'Won', 6, '#22c55e', 1, 0, '2026-04-02 04:33:52', '2026-04-02 04:33:52'),
(7, 1, 'Lost', 7, '#ef4444', 0, 1, '2026-04-02 04:33:52', '2026-04-02 04:33:52');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `deal_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `priority` enum('low','medium','high') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `status` enum('pending','in_progress','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `due_date` date DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `deal_id`, `user_id`, `title`, `description`, `priority`, `status`, `due_date`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Follow up with John Smith', 'Discuss TechCorp Inc. account and potential expansion opportunities.', 'medium', 'pending', '2026-04-03', '2026-04-02 14:38:21', '2026-04-02 05:09:01', '2026-04-02 14:38:26'),
(2, 2, 1, 'Follow up with Sarah Johnson', 'Discuss Startup.io account and potential expansion opportunities.', 'low', 'completed', '2026-04-06', NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(3, 3, 1, 'Follow up with Michael Brown', 'Discuss Enterprise Ltd. account and potential expansion opportunities.', 'medium', 'completed', '2026-04-12', NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(4, 4, 1, 'Follow up with Jennifer Martinez', 'Discuss Creative Studios account and potential expansion opportunities.', 'low', 'completed', '2026-04-03', NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(5, 5, 1, 'Follow up with Lisa Anderson', 'Discuss Solutions Inc. account and potential expansion opportunities.', 'high', 'in_progress', '2026-04-05', NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(6, 6, 1, 'Follow up with Amanda White', 'Discuss Retail Co. account and potential expansion opportunities.', 'medium', 'in_progress', '2026-04-15', NULL, '2026-04-02 05:09:01', '2026-04-02 05:09:01'),
(7, 7, 1, 'Follow up with John Smith', 'Discuss TechCorp Inc. account and potential expansion opportunities.', 'low', 'in_progress', '2026-04-13', NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(8, 8, 1, 'Follow up with Sarah Johnson', 'Discuss Startup.io account and potential expansion opportunities.', 'low', 'in_progress', '2026-04-13', NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(9, 9, 1, 'Follow up with Michael Brown', 'Discuss Enterprise Ltd. account and potential expansion opportunities.', 'medium', 'pending', '2026-04-09', NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(10, 10, 1, 'Follow up with Jennifer Martinez', 'Discuss Creative Studios account and potential expansion opportunities.', 'high', 'in_progress', '2026-04-06', NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(11, 11, 1, 'Follow up with Lisa Anderson', 'Discuss Solutions Inc. account and potential expansion opportunities.', 'high', 'completed', '2026-04-15', NULL, '2026-04-02 05:09:28', '2026-04-02 05:09:28'),
(12, 12, 1, 'Follow up with Amanda White', 'Discuss Retail Co. account and potential expansion opportunities.', 'medium', 'completed', '2026-04-03', '2026-04-02 05:18:28', '2026-04-02 05:09:28', '2026-04-02 05:18:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Cairocoders Ednalan', 'cairocoders@gmail.com', NULL, '$2y$12$o153fNnACCMJGCip7eNyre/JXX5vQC7TTnfHTwTVX5yHbiK9c6Vpm', NULL, NULL, NULL, NULL, '2026-04-01 16:21:12', '2026-04-01 16:21:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activities_user_id_foreign` (`user_id`),
  ADD KEY `activities_deal_id_foreign` (`deal_id`),
  ADD KEY `activities_contact_id_foreign` (`contact_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contacts_user_id_foreign` (`user_id`);

--
-- Indexes for table `deals`
--
ALTER TABLE `deals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `deals_contact_id_foreign` (`contact_id`),
  ADD KEY `deals_user_id_foreign` (`user_id`),
  ADD KEY `deals_stage_id_foreign` (`stage_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoices_invoice_number_unique` (`invoice_number`),
  ADD KEY `invoices_deal_id_foreign` (`deal_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pipelines`
--
ALTER TABLE `pipelines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `stages`
--
ALTER TABLE `stages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stages_pipeline_id_foreign` (`pipeline_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasks_deal_id_foreign` (`deal_id`),
  ADD KEY `tasks_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `deals`
--
ALTER TABLE `deals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pipelines`
--
ALTER TABLE `pipelines`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stages`
--
ALTER TABLE `stages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activities_deal_id_foreign` FOREIGN KEY (`deal_id`) REFERENCES `deals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activities_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `deals`
--
ALTER TABLE `deals`
  ADD CONSTRAINT `deals_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deals_stage_id_foreign` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`),
  ADD CONSTRAINT `deals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_deal_id_foreign` FOREIGN KEY (`deal_id`) REFERENCES `deals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stages`
--
ALTER TABLE `stages`
  ADD CONSTRAINT `stages_pipeline_id_foreign` FOREIGN KEY (`pipeline_id`) REFERENCES `pipelines` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_deal_id_foreign` FOREIGN KEY (`deal_id`) REFERENCES `deals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
