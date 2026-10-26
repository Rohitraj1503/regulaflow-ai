-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: regulaflow_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `regulaflow_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `regulaflow_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `regulaflow_db`;

--
-- Table structure for table `application_documents`
--

DROP TABLE IF EXISTS `application_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `document_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `checksum` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `deficiency_notes` text COLLATE utf8mb4_unicode_ci,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_doc_application` (`application_id`),
  CONSTRAINT `fk_doc_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_documents`
--

LOCK TABLES `application_documents` WRITE;
/*!40000 ALTER TABLE `application_documents` DISABLE KEYS */;
INSERT INTO `application_documents` VALUES (1,1,'LAND_USE_CERTIFICATE','Apex_Land_Conversion_Certificate.pdf','/uploads/apex_land.pdf',2415900,'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855','VERIFIED',NULL,'2026-10-25 18:40:53'),(2,1,'FIRE_SAFETY_NOC','Apex_Fire_Dept_NOC_2026.pdf','/uploads/apex_fire.pdf',1832400,'5d41402abc4b2a76b9719d911017c592','VERIFIED',NULL,'2026-10-25 18:40:53'),(3,2,'FACULTY_CADRE_LIST','Apex_CSE_Faculty_Cadre_2026.pdf','/uploads/apex_faculty.pdf',3120000,'7d793037a0760186574b0282f2f435e7','REJECTED','Shortfall of 3 Assistant Professors and 1 Associate Professor as per APH Clause 7.2. Cadre ratio is 1:24.','2026-10-25 18:40:53'),(4,3,'BUILDING_PLAN_SANCTION','Western_Sanctioned_Master_Plan.pdf','/uploads/western_plan.pdf',5420000,'9e107d9d372bb6826bd81d3542a419d6','VERIFIED','Verified by Municipal Corporation.','2026-10-25 18:40:53'),(6,1,'BUILDING_PLAN','Test_AICTE_Building_Plan_2026.pdf','uploads/documents/1/acb29dde-efc8-4115-834d-016996ad46a9_Test_AICTE_Building_Plan_2026.pdf',49,'db416057ea2d1b63d9f66b86c2da775f3f5e44b99bb88598881dc5a6b957390a','PENDING',NULL,'2026-10-25 14:22:36'),(7,1,'BUILDING_PLAN','Test_AICTE_Building_Plan_2026.pdf','uploads/documents/1/586ce042-4228-4eb9-a048-64261e4bbb85_Test_AICTE_Building_Plan_2026.pdf',49,'db416057ea2d1b63d9f66b86c2da775f3f5e44b99bb88598881dc5a6b957390a','VERIFIED','All dimensions match municipal master plan and APH Clause 4.2.','2026-10-25 14:23:47'),(8,1,'BUILDING_PLAN','Test_AICTE_Building_Plan_2026.pdf','uploads/documents/1/463aca53-35fb-4595-8c38-5f69a5cf4de2_Test_AICTE_Building_Plan_2026.pdf',49,'db416057ea2d1b63d9f66b86c2da775f3f5e44b99bb88598881dc5a6b957390a','VERIFIED','All dimensions match municipal master plan and APH Clause 4.2.','2026-10-25 14:24:10');
/*!40000 ALTER TABLE `application_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_id` bigint NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assigned_officer_id` bigint DEFAULT NULL,
  `submission_date` timestamp NULL DEFAULT NULL,
  `sla_due_date` timestamp NULL DEFAULT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_number` (`application_number`),
  KEY `fk_app_officer` (`assigned_officer_id`),
  KEY `idx_apps_institution` (`institution_id`),
  KEY `idx_apps_status` (`status`),
  CONSTRAINT `fk_app_institution` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`),
  CONSTRAINT `fk_app_officer` FOREIGN KEY (`assigned_officer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,'APP-2026-001',1,'EXTENSION_OF_APPROVAL','2026-27','APPROVED',2,'2026-09-30 18:40:53','2026-10-20 18:40:53','2026-10-23 18:40:53','All statutory requirements, faculty cadastral norms and built-up area verified. EoA granted for 2026-27.','2026-10-25 18:40:53','2026-10-25 18:40:53'),(2,'APP-2026-002',1,'INTAKE_INCREASE','2026-27','DEFICIENCY_NOTED',3,'2026-10-11 18:40:53','2026-10-31 18:40:53',NULL,'Deficiency identified in CSE Cadre Ratio (1:24 vs mandatory 1:20) and fire safety renewal receipt.','2026-10-25 18:40:53','2026-10-25 18:40:53'),(3,'APP-2026-003',2,'NEW_INSTITUTE','2026-27','EVC_SCHEDULED',4,'2026-10-07 18:40:53','2026-11-06 18:40:53',NULL,'Initial scrutiny passed. On-site Expert Visit Committee scheduled for physical verification.','2026-10-25 18:40:53','2026-10-25 18:40:53'),(4,'APP-2026-004',3,'NEW_COURSE','2026-27','UNDER_SCRUTINY',3,'2026-10-19 18:40:53','2026-11-08 18:40:53',NULL,'Application received for M.Tech Cybersecurity. Verification of lab setups and faculty in progress.','2026-10-25 18:40:53','2026-10-25 18:40:53'),(5,'APP-2026-005',4,'EXTENSION_OF_APPROVAL','2026-27','SUBMITTED',2,'2026-10-23 18:40:53','2026-11-22 18:40:53',NULL,'Fresh submission. Awaiting initial officer assignment and verification queue entry.','2026-10-25 18:40:53','2026-10-25 18:40:53'),(6,'APP-2026-006',5,'EXTENSION_OF_APPROVAL','2026-27','DRAFT',NULL,NULL,NULL,NULL,'Draft application in preparation by institution.','2026-10-25 18:40:53','2026-10-25 18:40:53'),(7,'APP-2026-0007',1,'NEW_COURSE','2026-27','SUBMITTED',NULL,'2026-10-25 13:12:09','2026-11-24 13:12:09',NULL,'End-to-End MySQL integration verification test','2026-10-25 13:11:58','2026-10-25 13:11:58');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_events`
--

DROP TABLE IF EXISTS `audit_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actor_username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_state` text COLLATE utf8mb4_unicode_ci,
  `new_state` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_timestamp` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_events`
--

LOCK TABLES `audit_events` WRITE;
/*!40000 ALTER TABLE `audit_events` DISABLE KEYS */;
INSERT INTO `audit_events` VALUES (1,'director@apextech.edu.in','ROLE_INSTITUTION_ADMIN','SUBMIT_APPLICATION','APPLICATION','APP-2026-001','DRAFT','SUBMITTED','192.168.1.104','2026-10-25 18:40:53'),(2,'scrutiny@regulaflow.gov.in','ROLE_SCRUTINY_OFFICER','ASSIGN_OFFICER','APPLICATION','APP-2026-001','SUBMITTED','UNDER_SCRUTINY','10.0.12.44','2026-10-25 18:40:53'),(3,'regulatory.officer@regulaflow.gov.in','ROLE_REGULATORY_OFFICER','APPROVE_APPLICATION','APPLICATION','APP-2026-001','UNDER_SCRUTINY','APPROVED','10.0.12.18','2026-10-25 18:40:53'),(4,'scrutiny@regulaflow.gov.in','ROLE_SCRUTINY_OFFICER','NOTE_DEFICIENCY','APPLICATION','APP-2026-002','UNDER_SCRUTINY','DEFICIENCY_NOTED','10.0.12.44','2026-10-25 18:40:53'),(5,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 13:11:23'),(6,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 13:11:34'),(7,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 13:11:58'),(8,'admin','ROLE_ADMIN','CREATE_APPLICATION','APPLICATION','APP-2026-0007',NULL,'DRAFT','127.0.0.1','2026-10-25 13:11:58'),(9,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 13:12:09'),(10,'admin','ROLE_ADMIN','SUBMIT_APPLICATION','APPLICATION','APP-2026-0007','DRAFT','SUBMITTED','127.0.0.1','2026-10-25 13:12:09'),(11,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 13:12:50'),(12,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 13:13:09'),(13,'testadmin','ROLE_ADMIN','USER_REGISTER','USER','8',NULL,'REGISTERED','127.0.0.1','2026-10-25 13:56:58'),(14,'officer1','ROLE_REGULATORY_OFFICER','USER_REGISTER','USER','9',NULL,'REGISTERED','127.0.0.1','2026-10-25 13:57:45'),(15,'superadmin','ROLE_ADMIN','USER_REGISTER','USER','10',NULL,'REGISTERED','127.0.0.1','2026-10-25 14:00:31'),(16,'superadmin','ROLE_ADMIN','USER_LOGIN','USER','10',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:00:34'),(17,'admin_test','ROLE_ADMIN','USER_REGISTER','USER','11',NULL,'REGISTERED','127.0.0.1','2026-10-25 14:00:37'),(18,'scrutiny_test','ROLE_SCRUTINY_OFFICER','USER_REGISTER','USER','12',NULL,'REGISTERED','127.0.0.1','2026-10-25 14:00:37'),(19,'auditor_test','ROLE_AUDITOR','USER_REGISTER','USER','13',NULL,'REGISTERED','127.0.0.1','2026-10-25 14:00:37'),(20,'admin_test','ROLE_ADMIN','USER_LOGIN','USER','11',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:00:45'),(21,'scrutiny_test','ROLE_SCRUTINY_OFFICER','USER_LOGIN','USER','12',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:01:31'),(22,'auditor_test','ROLE_AUDITOR','USER_LOGIN','USER','13',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:01:47'),(23,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:20:31'),(24,'inst_admin','ROLE_INSTITUTION_ADMIN','USER_LOGIN','USER','5',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:21:01'),(25,'inst_admin','ROLE_INSTITUTION_ADMIN','USER_LOGIN','USER','5',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:21:14'),(26,'scrutiny_officer','ROLE_SCRUTINY_OFFICER','USER_LOGIN','USER','3',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:21:14'),(27,'inst_admin','ROLE_INSTITUTION_ADMIN','USER_LOGIN','USER','5',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:22:36'),(28,'inst_admin','ROLE_INSTITUTION_ADMIN','UPLOAD_DOCUMENT','DOCUMENT','6',NULL,'PENDING','127.0.0.1','2026-10-25 14:22:36'),(29,'scrutiny_officer','ROLE_SCRUTINY_OFFICER','USER_LOGIN','USER','3',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:22:37'),(30,'inst_admin','ROLE_INSTITUTION_ADMIN','USER_LOGIN','USER','5',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:23:46'),(31,'inst_admin','ROLE_INSTITUTION_ADMIN','UPLOAD_DOCUMENT','DOCUMENT','7',NULL,'PENDING','127.0.0.1','2026-10-25 14:23:47'),(32,'scrutiny_officer','ROLE_SCRUTINY_OFFICER','USER_LOGIN','USER','3',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:23:47'),(33,'scrutiny_officer','ROLE_SCRUTINY_OFFICER','VERIFY_DOCUMENT','DOCUMENT','7','PENDING','VERIFIED','Document verification completed with status: ','2026-10-25 14:23:47'),(34,'inst_admin','ROLE_INSTITUTION_ADMIN','USER_LOGIN','USER','5',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:24:10'),(35,'inst_admin','ROLE_INSTITUTION_ADMIN','UPLOAD_DOCUMENT','DOCUMENT','8',NULL,'PENDING','127.0.0.1','2026-10-25 14:24:10'),(36,'scrutiny_officer','ROLE_SCRUTINY_OFFICER','USER_LOGIN','USER','3',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:24:10'),(37,'scrutiny_officer','ROLE_SCRUTINY_OFFICER','VERIFY_DOCUMENT','DOCUMENT','8','PENDING','VERIFIED','Document verification completed with status: ','2026-10-25 14:24:10'),(38,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:24:49'),(39,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:25:14'),(40,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:25:20'),(41,'admin','ROLE_ADMIN','ROLE_SWITCH','USER','1','ROLE_ADMIN','ROLE_ADMIN','Switched active role to ROLE_ADMIN','2026-10-25 14:27:29'),(42,'admin','ROLE_REGULATORY_OFFICER','ROLE_SWITCH','USER','1','ROLE_ADMIN','ROLE_REGULATORY_OFFICER','Switched active role to ROLE_REGULATORY_OFFIC','2026-10-25 14:28:07'),(43,'admin_test','ROLE_ADMIN','USER_LOGIN','USER','11',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:51:01'),(44,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:52:04'),(45,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:05'),(46,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:05'),(47,'reg_officer','ROLE_REGULATORY_OFFICER','USER_LOGIN','USER','2',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:05'),(48,'scrutiny_officer','ROLE_SCRUTINY_OFFICER','USER_LOGIN','USER','3',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:05'),(49,'evc_officer','ROLE_EVC_OFFICER','USER_LOGIN','USER','4',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:06'),(50,'inst_admin','ROLE_INSTITUTION_ADMIN','USER_LOGIN','USER','5',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:06'),(51,'compliance_officer','ROLE_COMPLIANCE_OFFICER','USER_LOGIN','USER','6',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:06'),(52,'auditor','ROLE_AUDITOR','USER_LOGIN','USER','7',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:06'),(53,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:22'),(54,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:22'),(55,'reg_officer','ROLE_REGULATORY_OFFICER','USER_LOGIN','USER','2',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:22'),(56,'scrutiny_officer','ROLE_SCRUTINY_OFFICER','USER_LOGIN','USER','3',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:23'),(57,'evc_officer','ROLE_EVC_OFFICER','USER_LOGIN','USER','4',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:23'),(58,'inst_admin','ROLE_INSTITUTION_ADMIN','USER_LOGIN','USER','5',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:23'),(59,'compliance_officer','ROLE_COMPLIANCE_OFFICER','USER_LOGIN','USER','6',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:23'),(60,'auditor','ROLE_AUDITOR','USER_LOGIN','USER','7',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:56:23'),(61,'admin','ROLE_REGULATORY_OFFICER','ROLE_SWITCH','USER','1','ROLE_ADMIN','ROLE_REGULATORY_OFFICER','Switched active role to ROLE_REGULATORY_OFFIC','2026-10-25 14:56:23'),(62,'admin','ROLE_ADMIN','ROLE_SWITCH','USER','1','ROLE_REGULATORY_OFFICER','ROLE_ADMIN','Switched active role to ROLE_ADMIN','2026-10-25 14:56:23'),(63,'admin','ROLE_ADMIN','USER_LOGIN','USER','1',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:59:02'),(64,'reg_officer','ROLE_REGULATORY_OFFICER','USER_LOGIN','USER','2',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:59:03'),(65,'scrutiny_officer','ROLE_SCRUTINY_OFFICER','USER_LOGIN','USER','3',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:59:03'),(66,'evc_officer','ROLE_EVC_OFFICER','USER_LOGIN','USER','4',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:59:03'),(67,'inst_admin','ROLE_INSTITUTION_ADMIN','USER_LOGIN','USER','5',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:59:03'),(68,'compliance_officer','ROLE_COMPLIANCE_OFFICER','USER_LOGIN','USER','6',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:59:03'),(69,'auditor','ROLE_AUDITOR','USER_LOGIN','USER','7',NULL,'SUCCESS','127.0.0.1','2026-10-25 14:59:04');
/*!40000 ALTER TABLE `audit_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compliance_evidence`
--

DROP TABLE IF EXISTS `compliance_evidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compliance_evidence` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `obligation_id` bigint NOT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submission_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `validity_start_date` timestamp NULL DEFAULT NULL,
  `validity_end_date` timestamp NULL DEFAULT NULL,
  `verification_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `remarks` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_evid_obligation` (`obligation_id`),
  CONSTRAINT `fk_evid_obligation` FOREIGN KEY (`obligation_id`) REFERENCES `compliance_obligations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compliance_evidence`
--

LOCK TABLES `compliance_evidence` WRITE;
/*!40000 ALTER TABLE `compliance_evidence` DISABLE KEYS */;
/*!40000 ALTER TABLE `compliance_evidence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compliance_obligations`
--

DROP TABLE IF EXISTS `compliance_obligations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compliance_obligations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `institution_id` bigint NOT NULL,
  `obligation_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `regulatory_clause` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequency` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deadline` timestamp NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `last_verified_at` timestamp NULL DEFAULT NULL,
  `verified_by_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_comp_institution` (`institution_id`),
  CONSTRAINT `fk_comp_institution` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compliance_obligations`
--

LOCK TABLES `compliance_obligations` WRITE;
/*!40000 ALTER TABLE `compliance_obligations` DISABLE KEYS */;
INSERT INTO `compliance_obligations` VALUES (1,1,'Fire Safety Certificate Renewal','Clause 6.4','ANNUAL','2026-12-09 18:40:53','PENDING',NULL,NULL,'2026-10-25 18:40:53'),(2,1,'Anti-Ragging Committee & Squad Constitution','Clause 11.1','ANNUAL','2026-10-15 18:40:53','VERIFIED',NULL,NULL,'2026-10-25 18:40:53'),(3,1,'Mandatory Website Disclosure Upload','Clause 12.3','ANNUAL','2026-11-09 18:40:53','PENDING',NULL,NULL,'2026-10-25 18:40:53'),(4,2,'Faculty Cadre Ratio Compliance Affidavit','Clause 7.2','ANNUAL','2026-11-24 18:40:53','PENDING',NULL,NULL,'2026-10-25 18:40:53'),(5,3,'Barrier Free Built Environment & Disabled Access','Clause 6.8','ONE_TIME','2026-10-20 18:40:53','OVERDUE',NULL,NULL,'2026-10-25 18:40:53');
/*!40000 ALTER TABLE `compliance_obligations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deficiencies`
--

DROP TABLE IF EXISTS `deficiencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deficiencies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `clause_reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issue_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'MEDIUM',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'OPEN',
  `response_remarks` text COLLATE utf8mb4_unicode_ci,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_def_application` (`application_id`),
  CONSTRAINT `fk_def_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deficiencies`
--

LOCK TABLES `deficiencies` WRITE;
/*!40000 ALTER TABLE `deficiencies` DISABLE KEYS */;
INSERT INTO `deficiencies` VALUES (1,2,'APH 2026-27 Clause 7.2','Cadre ratio in Department of Computer Science & Engineering is 1:24 against mandatory 1:20 norm for proposed intake of 180 seats.','FACULTY_NORMS','HIGH','OPEN',NULL,NULL,'2026-10-25 18:40:53'),(2,2,'APH 2026-27 Clause 6.4','Updated Fire Safety Certificate renewal acknowledgement receipt dated after submission window.','INFRASTRUCTURE_SAFETY','MEDIUM','OPEN',NULL,NULL,'2026-10-25 18:40:53');
/*!40000 ALTER TABLE `deficiencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evc_schedules`
--

DROP TABLE IF EXISTS `evc_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evc_schedules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `visit_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scheduled_date` timestamp NOT NULL,
  `lead_officer_id` bigint NOT NULL,
  `committee_members` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `findings_summary` text COLLATE utf8mb4_unicode_ci,
  `infrastructure_score` int DEFAULT NULL,
  `faculty_score` int DEFAULT NULL,
  `labs_score` int DEFAULT NULL,
  `recommendation` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_file_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_evc_application` (`application_id`),
  KEY `fk_evc_lead_officer` (`lead_officer_id`),
  CONSTRAINT `fk_evc_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_evc_lead_officer` FOREIGN KEY (`lead_officer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evc_schedules`
--

LOCK TABLES `evc_schedules` WRITE;
/*!40000 ALTER TABLE `evc_schedules` DISABLE KEYS */;
INSERT INTO `evc_schedules` VALUES (1,3,'PHYSICAL','2026-10-30 18:40:53',4,'Dr. Vikramaditya Rao (Lead), Prof. H. S. Murthy (Member, IIT Bombay), Er. S. P. Gupta (PWD Expert)','SCHEDULED','Site visit scheduled for infrastructure and equipment inspection.',NULL,NULL,NULL,NULL,NULL,'2026-10-25 18:40:53',NULL);
/*!40000 ALTER TABLE `evc_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `script` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','initial schema','SQL','V1__initial_schema.sql',889040465,'root','2026-10-25 18:40:53',472,1),(2,'2','seed data','SQL','V2__seed_data.sql',-321088046,'root','2026-10-25 18:40:53',19,1),(3,'3','add authorized roles to users','SQL','V3__add_authorized_roles_to_users.sql',282058380,'root','2026-10-25 18:40:53',28,1),(4,'4','import verified aicte institutions and rules','SQL','V4__import_verified_aicte_institutions_and_rules.sql',665828707,'root','2026-10-25 19:47:52',205,1),(5,'5','fix user password hashes','SQL','V5__fix_user_password_hashes.sql',206509050,'root','2026-10-25 20:25:24',8,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institutions`
--

DROP TABLE IF EXISTS `institutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institutions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aicte_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institute_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `established_year` int DEFAULT NULL,
  `nirf_rank` int DEFAULT NULL,
  `accreditation_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campus_area_acres` decimal(8,2) DEFAULT NULL,
  `built_up_area_sqm` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `official_website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `programmes_offered` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `aicte_id` (`aicte_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institutions`
--

LOCK TABLES `institutions` WRITE;
/*!40000 ALTER TABLE `institutions` DISABLE KEYS */;
INSERT INTO `institutions` VALUES (1,'1-4561721','COEP Technological University (College of Engineering Pune)','State Public University / Government Autonomous','Western','Maharashtra','Pune','Wellesley Road, Shivajinagar, Pune, Maharashtra 411005',1854,73,'NBA_TIER_1',36.50,62000.00,'ACTIVE','2026-10-25 18:40:53','2026-10-25 19:47:52','https://www.coep.org.in','https://www.aicte-india.org/','2026-10-25 19:47:52','B.Tech/M.Tech in Computer Engineering, AI & Robotics, Mechanical, Civil, Electrical, Metallurgical Engineering'),(2,'1-5231901','Veermata Jijabai Technological Institute (VJTI Mumbai)','State Government Aided Autonomous','Western','Maharashtra','Mumbai','H. R. Mahajani Marg, Matunga East, Mumbai, Maharashtra 400019',1887,82,'NBA_TIER_1',16.00,38500.00,'ACTIVE','2026-10-25 18:40:53','2026-10-25 19:47:52','https://vjti.ac.in','https://www.aicte-india.org/','2026-10-25 19:47:52','B.Tech/M.Tech in Computer Engineering, Information Technology, Electrical, Production, Civil Engineering'),(3,'1-3942001','Delhi Technological University (DTU Delhi)','State Public University','Northern','Delhi','New Delhi','Shahbad Daulatpur, Main Bawana Road, Delhi 110042',1941,29,'NAAC_A_PLUS',164.00,120000.00,'ACTIVE','2026-10-25 18:40:53','2026-10-25 19:47:52','https://www.dtu.ac.in','https://www.aicte-india.org/','2026-10-25 19:47:52','B.Tech/M.Tech in Software Engineering, Electronics & Comm, Mechanical, Computer Science, Environmental Engineering'),(4,'1-3829101','PSG College of Technology','Government-Aided Autonomous','Southern','Tamil Nadu','Coimbatore','Post Box No. 1611, Peelamedu, Coimbatore, Tamil Nadu 641004',1951,67,'NBA_TIER_1',45.00,85000.00,'ACTIVE','2026-10-25 18:40:53','2026-10-25 19:47:52','https://www.psgtech.edu','https://www.aicte-india.org/','2026-10-25 19:47:52','B.Tech/M.Tech in Robotics & Automation, Mechatronics, Computer Science, Mechanical, Biomedical Engineering'),(5,'1-281001','Indian Institute of Science (IISc Bangalore - Technical Programs)','Deemed University / Institution of Eminence','South-Western','Karnataka','Bengaluru','CV Raman Rd, Bengaluru, Karnataka 560012',1909,1,'NAAC_A_DOUBLE_PLUS',440.00,250000.00,'ACTIVE','2026-10-25 18:40:53','2026-10-25 19:47:52','https://iisc.ac.in','https://www.aicte-india.org/','2026-10-25 19:47:52','M.Tech / M.Des / Ph.D in Artificial Intelligence, Quantum Technology, Microelectronics, Computational Data Science'),(6,'1-4261892','Thapar Institute of Engineering and Technology','Deemed to be University','North-Western','Punjab','Patiala','Bhadson Road, Patiala, Punjab 147004',1956,20,'NAAC_A_PLUS',250.00,160000.00,'ACTIVE','2026-10-25 19:47:52','2026-10-25 19:47:52','https://www.thapar.edu','https://www.aicte-india.org/','2026-10-25 19:47:52','B.E./M.Tech in Computer Engineering, Electronics, Mechanical, Chemical, Civil Engineering'),(7,'1-4820194','Birla Institute of Technology, Mesra','Deemed University','Eastern','Jharkhand','Ranchi','Mesra, Ranchi, Jharkhand 835215',1955,53,'NAAC_A',780.00,190000.00,'ACTIVE','2026-10-25 19:47:52','2026-10-25 19:47:52','https://www.bitmesra.ac.in','https://www.aicte-india.org/','2026-10-25 19:47:52','B.Tech/M.Tech in Computer Science, Space Engineering & Rocketry, Production, Electrical Engineering'),(8,'1-4910283','Motilal Nehru National Institute of Technology (MNNIT Allahabad)','National Institute of Technology','Northern','Uttar Pradesh','Prayagraj','Barrister Mullah Colony, Teliarganj, Prayagraj, UP 211004',1961,49,'NBA_TIER_1',222.00,140000.00,'ACTIVE','2026-10-25 19:47:52','2026-10-25 19:47:52','https://www.mnnit.ac.in','https://www.aicte-india.org/','2026-10-25 19:47:52','B.Tech/M.Tech in Computer Science, Information Security, Electronics, Civil, Mechanical Engineering');
/*!40000 ALTER TABLE `institutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `urgency` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'INFO',
  `is_read` tinyint(1) DEFAULT '0',
  `reference_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user_unread` (`user_id`,`is_read`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,5,'Deficiency Issued for APP-2026-002','Scrutiny Officer has flagged a deficiency in Faculty Cadre Ratio for your Intake Increase application. Clarification required within 15 days.','DEFICIENCY','CRITICAL',0,'APP-2026-002','APPLICATION','2026-10-25 18:40:53'),(2,5,'Approval Granted for APP-2026-001','Extension of Approval for academic year 2026-27 has been formally granted by the Approval Bureau.','STATUS_CHANGE','INFO',0,'APP-2026-001','APPLICATION','2026-10-25 18:40:53'),(3,2,'New Application Submitted: APP-2026-005','Eastern Institute of Management has submitted an Extension of Approval request awaiting officer assignment.','STATUS_CHANGE','INFO',0,'APP-2026-005','APPLICATION','2026-10-25 18:40:53'),(4,4,'EVC Visit Assigned: APP-2026-003','You have been designated as Lead Officer for physical inspection of Western College of Engineering on 29-Oct-2026.','EVC_UPDATE','WARNING',0,'APP-2026-003','EVC','2026-10-25 18:40:53'),(5,2,'New Application: APP-2026-0007','Institution Apex Institute of Technology submitted NEW_COURSE','STATUS_CHANGE','INFO',0,'APP-2026-0007','APPLICATION','2026-10-25 13:12:09'),(6,2,'New Document Uploaded: Test_AICTE_Building_Plan_2026.pdf','Institution COEP Technological University (College of Engineering Pune) uploaded BUILDING_PLAN for APP-2026-001','DOCUMENT','INFO',0,'APP-2026-001','APPLICATION','2026-10-25 14:22:36'),(7,2,'New Document Uploaded: Test_AICTE_Building_Plan_2026.pdf','Institution COEP Technological University (College of Engineering Pune) uploaded BUILDING_PLAN for APP-2026-001','DOCUMENT','INFO',0,'APP-2026-001','APPLICATION','2026-10-25 14:23:47'),(8,2,'New Document Uploaded: Test_AICTE_Building_Plan_2026.pdf','Institution COEP Technological University (College of Engineering Pune) uploaded BUILDING_PLAN for APP-2026-001','DOCUMENT','INFO',0,'APP-2026-001','APPLICATION','2026-10-25 14:24:10');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regulatory_clauses`
--

DROP TABLE IF EXISTS `regulatory_clauses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regulatory_clauses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `document_id` bigint NOT NULL,
  `section_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clause_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `applicable_to` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `penalty_notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_clause_doc` (`document_id`),
  CONSTRAINT `fk_clause_doc` FOREIGN KEY (`document_id`) REFERENCES `regulatory_documents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regulatory_clauses`
--

LOCK TABLES `regulatory_clauses` WRITE;
/*!40000 ALTER TABLE `regulatory_clauses` DISABLE KEYS */;
INSERT INTO `regulatory_clauses` VALUES (6,1,'Chapter 4','Clause 4.1','Minimum Land Requirement for Technical Institutions','The minimum land requirement for Mega and Metro cities shall be 2.50 Acres. For Urban areas the minimum requirement shall be 4.00 Acres, and for Rural areas it shall be 7.50 Acres. The land shall be a contiguous piece registered in the name of the Applicant Society/Trust/Company, free from any encumbrances and approved for educational use.','New Technical Institutions, Campus Expansion','Rejection of application or cancellation of provisional approval as per Chapter 10.'),(7,1,'Chapter 4','Clause 4.2','Built-up Area Requirements and FSI Norms','The built-up area shall include Instructional Area (Classrooms, Tutorial Rooms, Labs, Workshops), Administrative Area (Principal Office, Faculty Cabins, Boardroom), Amenities Area (Canteen, Girls/Boys Common Rooms, First Aid), and Circulation Area (Corridors, Staircases, Elevators). Minimum 70% of planned built-up space must be completed before commencing first-year classes.','All Engineering & Technical Institutions','Prohibition of admissions and reduction of intake by 50%.'),(8,1,'Chapter 6','Clause 6.4','Fire Safety Certificate and Structural Stability Approval','The institution must possess a valid Fire Safety Certificate issued by the Competent Fire Service Authority of the concerned State/UT, alongside an approved structural stability certificate from an authorized Chartered Structural Engineer. Fire safety installations including hydrants, alarms, and emergency exits must be verified annually.','All Technical Institutions','Immediate suspension of admissions and issuance of statutory show-cause notice under Section 10(k).'),(9,1,'Chapter 6','Clause 6.8','Barrier-Free Environment and Divyangjan Accessibility','Every institution campus shall be barrier-free with ramps having appropriate slope (1:12), tactile paths, braille signage in elevators, and specially equipped accessible restrooms on each floor for differently-abled students and staff.','All Educational Campuses','Withholding of Extension of Approval (EoA) and compliance deficiency penalty.'),(10,1,'Chapter 7','Clause 7.2','Faculty:Student Cadre Ratio and Distribution','For Under Graduate Engineering and Technology programs, the mandatory Faculty:Student ratio shall be 1:20. The cadre ratio of Professor:Associate Professor:Assistant Professor shall be 1:2:6. For Post Graduate programs (M.Tech/MBA), the Faculty:Student ratio shall be 1:15 with 1 Professor and 1 Associate Professor per approved division. Minimum 80% faculty must be on regular full-time appointments with 7th Central Pay Commission scales.','Undergraduate & Postgraduate Engineering','Reduction of approved intake by 25% or reduction of course divisions for continuous shortfall.'),(11,1,'Chapter 7','Clause 7.4','Faculty Retention, Qualifications and API Norms','All faculty appointments must satisfy UGC/AICTE minimum qualifications. Ph.D is mandatory for the post of Professor and Associate Professor in Engineering disciplines. Faculty cadre must be published on the institutional public portal with AICTE Faculty Identification Numbers.','Technical Faculty','Deficiency mark and rejection of application for intake increase.'),(12,1,'Chapter 8','Clause 8.3','Emerging Technologies Computing and AI Lab Infrastructure','Departments offering Under Graduate or Post Graduate programs in Emerging Technologies (Artificial Intelligence, Machine Learning, Data Science, Cyber Security, Robotics, IoT) shall maintain a dedicated computing lab with a minimum of 60 high-performance workstations (minimum 16GB RAM, discrete GPU acceleration) and redundant 1 Gbps leased internet bandwidth.','Computer Science, IT, AI-ML Disciplines','Denial of approval for new division/course and zero intake order.'),(13,1,'Chapter 9','Clause 9.1','Establishment of Anti-Ragging Committee and Squad','Every technical institution shall establish an Anti-Ragging Committee headed by the Head of Institution, and an Anti-Ragging Squad for round-the-clock surveillance in hostels and premises, in strict compliance with the Hon. Supreme Court directive and AICTE Anti-Ragging Regulations 2009. Toll-free national anti-ragging helpline and online student undertakings are mandatory.','All Technical Institutions','Immediate cancellation of AICTE approval and derecognition of degrees in coordination with affiliating university.'),(14,1,'Chapter 9','Clause 9.2','Internal Complaints Committee (ICC) & Gender Sensitization','An Internal Complaints Committee (ICC) must be constituted pursuant to Section 4 of the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013. The Presiding Officer must be a senior woman professor with at least 50% female committee membership.','All Technical Institutions','Statutory vigilance inquiry and administrative sanctions.'),(15,1,'Chapter 9','Clause 9.3','Student Grievance Redressal Committee (SGRC) & Ombudsperson','In accordance with AICTE Redressal of Grievance of Students Regulations 2019, an SGRC comprising 5 members including student representatives shall be constituted, alongside the appointment of an independent Ombudsperson by the affiliating university.','All Technical Institutions','Fine of Rs. 1,00,000 per violation and warning notice published on AICTE web portal.'),(16,1,'Chapter 10','Clause 10.1','Sanctions for Submission of False Documents or Non-Compliance','If any document, affidavit, land registry, or faculty detail submitted by an institution is found fabricated, misleading, or forged, AICTE Approval Bureau shall initiate: (a) Criminal proceedings under IPC/BNS, (b) 100% withdrawal of approval, (c) Forfeiture of security deposit, and (d) Blacklisting of Society/Trust for 5 academic years.','All Applicant Institutions','Permanent withdrawal of approval, criminal prosecution, and university disaffiliation.'),(17,1,'Chapter 14','Clause 14.2','Mandatory Public Disclosure on Institutional Website','Every technical institution shall maintain a dedicated Mandatory Disclosure webpage updated quarterly, detailing AICTE approval letters, faculty profiles, audited financial statements, fee structures approved by State Fee Regulatory Committee, and placement statistics.','All Technical Institutions','Fine of Rs. 50,000 and withholding of annual Extension of Approval (EoA).');
/*!40000 ALTER TABLE `regulatory_clauses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regulatory_documents`
--

DROP TABLE IF EXISTS `regulatory_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regulatory_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `regulation_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `summary` text COLLATE utf8mb4_unicode_ci,
  `document_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `publishing_org` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_checksum` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `retrieval_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regulatory_documents`
--

LOCK TABLES `regulatory_documents` WRITE;
/*!40000 ALTER TABLE `regulatory_documents` DISABLE KEYS */;
INSERT INTO `regulatory_documents` VALUES (1,'AICTE Approval Process Handbook (APH) 2024-27','AICTE-APH-2024-27','APPROVAL_NORMS','2024-27','v3.0',1,'Comprehensive statutory regulations and procedural guidelines governing approval of new technical institutions, introduction of new programmes/divisions, faculty-student cadre ratios, land and built-up area norms, and penal sanctions.','https://www.aicte-india.org/sites/default/files/APH%202024-27.pdf','2024-01-14 18:30:00','2026-10-25 18:40:53','All India Council for Technical Education (AICTE)','e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855','2026-10-25 19:47:52'),(2,'UGC Regulations on Minimum Qualifications for Appointment of Teachers 2018 & Amendments','UGC-REGS-2018','FACULTY_QUALIFICATIONS','2018-2026','v2.0',1,'Mandatory UGC guidelines on minimum qualifications for appointment and promotion of teachers in universities and colleges, CAS norms, and service conditions.','https://www.ugc.gov.in/pdfnews/4033931_UGC-Regulation_min_Qualification_Jul2018.pdf','2018-07-17 18:30:00','2026-10-25 18:40:53','University Grants Commission (UGC)','8c2f1a9d45e03b7194628d5e12f048a96c1032b491fa50239081e7d8246bc510','2026-10-25 19:47:52'),(3,'AICTE Guidelines for Technical Institutions on National Credit Framework (NCrF)','AICTE-NCRF-2024','ACADEMIC_CURRICULUM','2024-25','v1.1',1,'Operational framework for implementation of NCrF, multiple entry and exit pathways, apprenticeship-embedded degrees, and credit recognition.','https://www.pib.gov.in/PressReleasePage.aspx?PRID=2015421','2024-03-19 18:30:00','2026-10-25 19:47:52','Press Information Bureau / AICTE','9f83b271a4c8032d918237e1694bc51028374a592e01b34c8109348d20395a12','2026-10-25 19:47:52');
/*!40000 ALTER TABLE `regulatory_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `undertakings`
--

DROP TABLE IF EXISTS `undertakings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `undertakings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `institution_id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `declaration_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorized_signatory_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `signatory_designation` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agreed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_und_application` (`application_id`),
  KEY `fk_und_institution` (`institution_id`),
  CONSTRAINT `fk_und_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_und_institution` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `undertakings`
--

LOCK TABLES `undertakings` WRITE;
/*!40000 ALTER TABLE `undertakings` DISABLE KEYS */;
/*!40000 ALTER TABLE `undertakings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_id` bigint DEFAULT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `authorized_roles` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_institution` (`institution_id`),
  CONSTRAINT `fk_users_institution` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@regulaflow.gov.in','$2a$10$RpaQFik4w6ERLzpC/g3DheXLeA/FoyDeLh/WyzbTKGGATFVe6xE4q','Dr. Arvind Sharma','ROLE_ADMIN',NULL,'+91-11-29581001','AICTE HQ Administration',1,'2026-10-25 18:40:53','2026-10-25 20:25:24','ROLE_ADMIN,ROLE_REGULATORY_OFFICER,ROLE_SCRUTINY_OFFICER,ROLE_EVC_OFFICER,ROLE_INSTITUTION,ROLE_COMPLIANCE_OFFICER,ROLE_AUDITOR'),(2,'reg_officer','regulatory.officer@regulaflow.gov.in','$2a$10$2PZi2qxbfCSWSOqpwIpvruPkJVVcZ3mxJrK8/3W6bi0XAOLgdvo/O','Rajesh K. Verma','ROLE_REGULATORY_OFFICER',NULL,'+91-11-29581045','Approval Bureau',1,'2026-10-25 18:40:53','2026-10-25 20:21:57','ROLE_REGULATORY_OFFICER,ROLE_SCRUTINY_OFFICER'),(3,'scrutiny_officer','scrutiny@regulaflow.gov.in','$2a$10$YMN1t42LYuVrreFzUnygJeDP2lGMcYFQr3XE5JtLUu4hBHxRa3qPK','Prof. Sunita Deshmukh','ROLE_SCRUTINY_OFFICER',NULL,'+91-11-29581088','Scrutiny & Deficiencies Cell',1,'2026-10-25 18:40:53','2026-10-25 20:21:57','ROLE_SCRUTINY_OFFICER'),(4,'evc_officer','evc.officer@regulaflow.gov.in','$2a$10$1hhcMp3f4Y4m/o5K4etki.KLf2HMtc0ceADh9c27quv/Q1p.G7R.K','Dr. Vikramaditya Rao','ROLE_EVC_OFFICER',NULL,'+91-11-29581120','Expert Visit Committee',1,'2026-10-25 18:40:53','2026-10-25 20:21:57','ROLE_EVC_OFFICER'),(5,'inst_admin','director@coeptech.ac.in','$2a$10$TljydijYWIfmYQx/gsNPFOXOVcAKp.JAYA0LEnCLyltI666RSi.Tq','Dr. B. B. Ahuja','ROLE_INSTITUTION_ADMIN',1,'+91-20-25507000','Directorate Office',1,'2026-10-25 18:40:53','2026-10-25 20:21:57','ROLE_INSTITUTION'),(6,'compliance_officer','compliance@regulaflow.gov.in','$2a$10$IrQzz4uI5y60K4Y7TS1dXOjq052FYDdPDZBoz/tOkdNr7wQsqUOw6','Anand Nambiar','ROLE_COMPLIANCE_OFFICER',NULL,'+91-11-29581155','Compliance & Vigilance Wing',1,'2026-10-25 18:40:53','2026-10-25 20:21:57','ROLE_COMPLIANCE_OFFICER'),(7,'auditor','auditor@audit.gov.in','$2a$10$jCWASvWdhQwqzOpjnjsJeOMPeqZM7j5ofrLabbZiutZ/Gqkr6u59W','Kavita Menon','ROLE_AUDITOR',NULL,'+91-11-29581190','Central Vigilance Audit',1,'2026-10-25 18:40:53','2026-10-25 20:26:22','ROLE_AUDITOR'),(8,'testadmin','test@aiicte.gov.in','$2a$10$vo/G40LckXpJIQO/NH7heOHd3PfS2Cri1yifcf5/PKwx9HRPQV/q6','Test Admin','ROLE_ADMIN',NULL,NULL,NULL,1,'2026-10-25 13:56:58','2026-10-25 19:50:22',NULL),(9,'officer1','officer1@aiicte.gov.in','$2a$10$vo/G40LckXpJIQO/NH7heOHd3PfS2Cri1yifcf5/PKwx9HRPQV/q6','Officer One','ROLE_REGULATORY_OFFICER',NULL,NULL,NULL,1,'2026-10-25 13:57:45','2026-10-25 19:50:22',NULL),(10,'superadmin','super@aiete.gov.in','$2a$10$vo/G40LckXpJIQO/NH7heOHd3PfS2Cri1yifcf5/PKwx9HRPQV/q6','Super Admin','ROLE_ADMIN',NULL,NULL,NULL,1,'2026-10-25 14:00:31','2026-10-25 19:50:22',NULL),(11,'admin_test','admin_test@aicte.gov.in','$2a$10$vo/G40LckXpJIQO/NH7heOHd3PfS2Cri1yifcf5/PKwx9HRPQV/q6','Admin Test','ROLE_ADMIN',NULL,NULL,NULL,1,'2026-10-25 14:00:37','2026-10-25 19:50:22',NULL),(12,'scrutiny_test','scrutiny_test@aicte.gov.in','$2a$10$vo/G40LckXpJIQO/NH7heOHd3PfS2Cri1yifcf5/PKwx9HRPQV/q6','Scrutiny Test','ROLE_SCRUTINY_OFFICER',NULL,NULL,NULL,1,'2026-10-25 14:00:37','2026-10-25 19:50:22',NULL),(13,'auditor_test','auditor_test@aicte.gov.in','$2a$10$vo/G40LckXpJIQO/NH7heOHd3PfS2Cri1yifcf5/PKwx9HRPQV/q6','Auditor Test','ROLE_AUDITOR',NULL,NULL,NULL,1,'2026-10-25 14:00:37','2026-10-25 19:50:22',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflow_history`
--

DROP TABLE IF EXISTS `workflow_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflow_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `from_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_id` bigint DEFAULT NULL,
  `actor_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actor_role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_history_application` (`application_id`),
  CONSTRAINT `fk_history_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflow_history`
--

LOCK TABLES `workflow_history` WRITE;
/*!40000 ALTER TABLE `workflow_history` DISABLE KEYS */;
INSERT INTO `workflow_history` VALUES (1,1,'DRAFT','SUBMITTED',5,'Dr. Meenakshi Sundaram','ROLE_INSTITUTION_ADMIN','Initial EoA submission with full compliance documentation.','2026-10-25 18:40:53'),(2,1,'SUBMITTED','UNDER_SCRUTINY',3,'Prof. Sunita Deshmukh','ROLE_SCRUTINY_OFFICER','Assigned to scrutiny desk.','2026-10-25 18:40:53'),(3,1,'UNDER_SCRUTINY','APPROVED',2,'Rajesh K. Verma','ROLE_REGULATORY_OFFICER','All checklist points verified satisfactorily. Approval issued.','2026-10-25 18:40:53'),(4,2,'SUBMITTED','UNDER_SCRUTINY',3,'Prof. Sunita Deshmukh','ROLE_SCRUTINY_OFFICER','Scrutiny initiated for intake increase.','2026-10-25 18:40:53'),(5,2,'UNDER_SCRUTINY','DEFICIENCY_NOTED',3,'Prof. Sunita Deshmukh','ROLE_SCRUTINY_OFFICER','Faculty cadre ratio deficit in Computer Science department.','2026-10-25 18:40:53'),(6,3,'SUBMITTED','UNDER_SCRUTINY',3,'Prof. Sunita Deshmukh','ROLE_SCRUTINY_OFFICER','New campus scrutiny completed.','2026-10-25 18:40:53'),(7,3,'UNDER_SCRUTINY','EVC_SCHEDULED',2,'Rajesh K. Verma','ROLE_REGULATORY_OFFICER','Physical EVC inspection triggered.','2026-10-25 18:40:53'),(8,7,NULL,'DRAFT',1,'Dr. Arvind Sharma','ROLE_ADMIN','Application draft initiated.','2026-10-25 13:11:58'),(9,7,'DRAFT','SUBMITTED',1,'Dr. Arvind Sharma','ROLE_ADMIN','Application submitted for AICTE scrutiny.','2026-10-25 13:12:09');
/*!40000 ALTER TABLE `workflow_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'regulaflow_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-26  2:06:13
