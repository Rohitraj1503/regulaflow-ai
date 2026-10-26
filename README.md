# RegulaFlow AI

**Integrated AICTE Approval Workflow Automation, Compliance Monitoring, and Regulatory Intelligence**  
*Smart India Hackathon 2026 Submission | Problem Statement SIH26262*

---

> [!NOTE]
> **Independent Prototype Notice:** RegulaFlow AI is an independent academic and technological prototype developed for the Smart India Hackathon 2026 (Problem Statement SIH26262), modeled upon publicly published guidelines in the AICTE Approval Process Handbook (APH 2026-27). It is not an official government platform.

---

## 🌟 Executive Overview

**RegulaFlow AI** is a production-grade, full-stack regulatory automation platform engineered for the **All India Council for Technical Education (AICTE)** ecosystem. It replaces fragmented paper-trail submissions, ambiguous deficiency handling, manual committee allocation, and siloed compliance records with an auditable, state-machine driven regulatory operating system.

### Core Architecture Highlights
- **7 Authenticated Stakeholder Roles:** Complete isolation, navigation, permissions, and dashboards for Administrator, Regulatory Officer, Scrutiny Officer, EVC Officer, Institution Representative, Compliance Officer, and Central Auditor.
- **Dedicated Role Login Portals:** Enforced role clearances on `/login/admin`, `/login/regulatory-officer`, `/login/scrutiny-officer`, `/login/evc-officer`, `/login/institution`, `/login/compliance-officer`, and `/login/auditor`.
- **State-Machine Lifecycle Engine:** Formally enforced transitions (`DRAFT` → `SUBMITTED` → `UNDER_SCRUTINY` → `DEFICIENCY_NOTED` → `RESUBMITTED` → `EVC_SCHEDULED` → `APPROVED` / `REJECTED`) with cryptographic audit logging.
- **Granular Scrutiny & Document Verification:** Per-document audit status (`VERIFIED` / `REJECTED`) with APH clause-referenced deficiency notices and institutional rectification resubmissions.
- **Conflict-Free EVC Management:** Algorithmic assessor matching eliminating institutional conflict-of-interest, scoring breakdowns (Infrastructure, Faculty, Labs), and digital inspection reporting.
- **Continuous Compliance & Vigilance:** Institutional statutory obligations (Fire NOCs, Land Titles, Barrier-Free Access, Faculty Cadre Ratios) with automated SLA deadline tracking and escalation.
- **Grounded Regulatory RAG Intelligence:** Conversational copilot powered by Google Gemini AI with fallback semantic retrieval from official AICTE Approval Process Handbook (APH 2026-27) clauses, page citations, and confidence indicators.
- **Relational Regulatory Knowledge Graph:** Ontological graph linking handbook clauses, institutional categories, required documents, approval stages, and statutory mandates.
- **Policy Evolution Diff Engine:** Structural impact analysis contrasting handbook revisions (APH 2025-26 vs. APH 2026-27) showing affected institutions and required workflow updates.
- **Smoky Glassmorphism UI:** Precision dark aesthetic (`#08090B` background, `#111215` secondary, `backdrop-filter: blur(18px)`, `#B9F56B` lime accents, and cool silver borders) with interactive 3D regulatory network topology.

---

## 🛠️ Complete Technical Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, React Router v6, Three.js, React Three Fiber, Recharts, Lucide React, Axios |
| **Backend** | Java 17, Spring Boot 3.2.4, Spring Security 6, Spring Data JPA, Hibernate 6.4, Flyway 9.22, JJWT 0.12.5 |
| **Database** | **MySQL 8.0+** (`regulaflow_db`, `utf8mb4` / `utf8mb4_unicode_ci`) with Flyway versioned migrations (`V1`–`V3`) |
| **AI / RAG** | Google Gemini Generative AI API + In-Engine Java Semantic Knowledge Base (APH 2026-27 grounded) |
| **Security** | Stateless JWT tokens, role-based method security (`@PreAuthorize`), immutable audit log ledger, secure role switching |

---

## 🗄️ MySQL Database Setup & Configuration

### Prerequisites
- **MySQL Server 8.0+** installed and running on port `3306`.
- **Java 17 JDK** (`java -version`)
- **Maven 3.8+** (`mvn -v`)
- **Node.js 18+ & npm** (`node -v`, `npm -v`)

### 1. Create the MySQL Database
Log in to your MySQL server using the MySQL CLI or MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS regulaflow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Verify that the database exists:
```sql
SHOW DATABASES LIKE 'regulaflow_db';
```

### 2. Environment Variables & Credentials
Copy `.env.example` to `.env` in the project root or configure your shell environment:
```env
# Database Configuration (MySQL 8.0+)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=regulaflow_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_URL=jdbc:mysql://localhost:3306/regulaflow_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC

# Spring Boot Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION_MS=86400000

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 3. Flyway Versioned Migrations
Flyway runs automatically on Spring Boot application startup (`spring.flyway.enabled=true`). The migrations located in `backend/src/main/resources/db/migration` include:
- `V1__initial_schema.sql`: Core schema (institutions, users, applications, documents, workflow history, deficiencies, EVC schedules, compliance, notifications, audit logs).
- `V2__seed_data.sql`: Realistic seed data with 5 institutions, 7 role-based users, initial applications, and regulatory clauses.
- `V3__add_authorized_roles_to_users.sql`: Multi-role authorization security attributes.

To check applied migration status directly in MySQL:
```sql
USE regulaflow_db;
SELECT installed_rank, version, description, type, execution_time, success 
FROM flyway_schema_history;
```

---

## 🚀 Running the Application

### 1. Start the Backend Server (Spring Boot)
Open a terminal in `backend/`:
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
*Backend initializes on `http://localhost:8080`. Flyway applies pending migrations, Hibernate validates the database schema, and Tomcat binds to port 8080.*

### 2. Start the Frontend Server (React + Vite)
Open a second terminal in `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`. Vite automatically reverse-proxies `/api` requests to `http://localhost:8080`.*

---

## 🔍 Database Connectivity Verification

1. **Verify Backend Connection:**
   Query the public health or auth endpoint:
   ```bash
   curl -X POST http://localhost:8080/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"username\":\"admin\",\"password\":\"password123\"}"
   ```
   *Expected Response:* JSON payload containing the JWT `token` and authenticated user profile with roles.

2. **Verify Data Persistence (Write Test):**
   Submitting an application or updating user roles via `/api/v1/applications` writes directly to MySQL table `applications` and logs state transitions in `workflow_history`.

3. **Verify Frontend Integration:**
   Navigate to `http://localhost:5173/login`, authenticate, and view live metrics loaded from MySQL in the System Administrator Control Center.

---

## 🛠️ Troubleshooting Common Database Connection Errors

- **Error: `Communications link failure` (Connection refused)**
  - Cause: MySQL service is stopped or port 3306 is blocked.
  - Solution: In Windows PowerShell as Administrator, run `Start-Service MySQL80` and verify port 3306 with `Test-NetConnection -Port 3306 localhost`.
- **Error: `Access denied for user 'root'@'localhost'`**
  - Cause: Incorrect password in `application-dev.yml` or environment variable `DB_PASSWORD`.
  - Solution: Set the environment variable `DB_PASSWORD` or update your local `.env`.
- **Error: `Public Key Retrieval is not allowed`**
  - Cause: MySQL 8.0 `caching_sha2_password` authentication plugin requiring public key retrieval over non-SSL connections.
  - Solution: Ensure `allowPublicKeyRetrieval=true` is present in the JDBC URL: `jdbc:mysql://localhost:3306/regulaflow_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`.
- **Error: `Unknown database 'regulaflow_db'`**
  - Cause: The database has not been created yet.
  - Solution: Run `CREATE DATABASE regulaflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;` in MySQL CLI.

---

## 🔑 Dedicated Role Portals & Demo Credentials

All test accounts share the initial development password: **`password123`**

| Role | Dedicated Portal URL | Username | Responsibilities |
| :--- | :--- | :--- | :--- |
| **System Administrator** | [`/login/admin`](http://localhost:5173/login/admin) | `admin` | User provisioning, role assignment, platform settings, audit ledger |
| **Regulatory Officer** | [`/login/regulatory-officer`](http://localhost:5173/login/regulatory-officer) | `reg_officer` | Regional jurisdiction review, officer assignment, final approval decrees |
| **Scrutiny Officer** | [`/login/scrutiny-officer`](http://localhost:5173/login/scrutiny-officer) | `scrutiny_officer` | Document scrutiny, APH clause verification, issuing deficiency notices |
| **EVC Officer** | [`/login/evc-officer`](http://localhost:5173/login/evc-officer) | `evc_officer` | Campus inspection schedule, infrastructure/faculty/lab scoring, reports |
| **Institution Representative** | [`/login/institution`](http://localhost:5173/login/institution) | `inst_admin` | Filing applications (EoA, Intake Variation), deficiency rectification |
| **Compliance Officer** | [`/login/compliance-officer`](http://localhost:5173/login/compliance-officer) | `compliance_officer` | Mandatory disclosures, fire safety NOC verification, overdue escalations |
| **Central Auditor** | [`/login/auditor`](http://localhost:5173/login/auditor) | `auditor` | Read-only oversight, cryptographic audit trail inspection, CSV reports |
