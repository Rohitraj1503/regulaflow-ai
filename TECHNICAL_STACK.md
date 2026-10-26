# RegulaFlow AI — Complete Technical Stack & Architecture Specification

**Project:** RegulaFlow AI  
**Problem Statement:** Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System (Smart India Hackathon 2026)  
**Architecture:** Enterprise Distributed Microservices & Full-Stack Cloud Architecture  

---

## 1. High-Level System Architecture

RegulaFlow AI is built on a modern, decoupled three-tier enterprise architecture:
1. **Frontend Presentation Tier:** React 18 SPA with Vite 5, Tailwind CSS Frosted Glassmorphism, and Three.js 3D spatial graphics.
2. **Backend Application Tier:** Java 17 + Spring Boot 3.2.4 with stateless JWT authentication, Spring Security 6, Hibernate JPA, and Flyway database migrations.
3. **AI & Intelligence Tier:** Google Gemini Generative Language API (Gemini 3.5 Flash Lite) with dynamic RAG grounding against the AICTE Approval Process Handbook (APH 2026-27), backed by an auxiliary FastAPI Python microservice and in-engine Java semantic retriever.
4. **Data Persistence Tier:** PostgreSQL 16 with `pgvector` for high-dimensional vector embeddings and H2 in-memory database for rapid local development and automated testing.

```
                           ┌──────────────────────────────────────────────┐
                           │      RegulaFlow AI Frontend (React + Vite)    │
                           │  • Tailwind CSS Glassmorphism Design System  │
                           │  • Three.js / React Three Fiber (3D Globe)   │
                           │  • Recharts & SVG Knowledge Graph            │
                           └──────────────────────┬───────────────────────┘
                                                  │ REST (JWT Bearer)
                                                  ▼
                           ┌──────────────────────────────────────────────┐
                           │    Spring Boot 3.2.4 Backend (Java 17)       │
                           │  • Spring Security 6 (Stateless JWT + RBAC)  │
                           │  • Spring Data JPA + Hibernate 6.4           │
                           │  • Flyway Database Migrations (V1 & V2)      │
                           │  • Regulatory Workflow State Machine         │
                           └──────────────┬───────────────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
  ┌───────────────────────────────┐               ┌───────────────────────────────┐
  │   Google Gemini Generative    │               │  Database Persistence Tier    │
  │   Language API (v1beta)       │               │  • PostgreSQL 16 (pgvector)   │
  │   • Models: gemini-3.5-flash  │               │  • H2 (PostgreSQL Mode)       │
  │   • Grounded APH Context RAG  │               │  • 14 Relational Repositories │
  └───────────────────────────────┘               └───────────────────────────────┘
```

---

## 2. Complete Technology Matrix

### 2.1 Frontend Technologies (Client-Side)

| Category | Technology | Version | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `^18.2.0` | Declarative component UI rendering and state-driven DOM management |
| **Build Tool & Bundler** | Vite | `^5.2.0` | Ultra-fast ESM compilation, Hot Module Replacement (HMR), production bundling |
| **Language** | JavaScript (ESNext) | Modern ES | Modular component logic, asynchronous API handling, event management |
| **CSS Framework** | Tailwind CSS | `^3.4.3` | Utility-first styling with custom design tokens, spacing, and responsive layout |
| **CSS Preprocessing** | PostCSS & Autoprefixer | `^8.4.38` / `^10.4.19` | Cross-browser CSS prefixing and custom styles processing |
| **Class Utilities** | `clsx` & `tailwind-merge` | `^2.1.0` / `^2.2.2` | Conditional class composition and deduplication |
| **3D Graphics Engine** | Three.js | `^0.163.0` | WebGL 3D rendering for national regulatory topology visualization |
| **3D React Binding** | `@react-three/fiber` | `^8.16.2` | Declarative Three.js scene graph inside React component tree |
| **3D Helpers** | `@react-three/drei` | `^9.105.4` | OrbitControls, sphere geometry shaders, and lighting utilities |
| **Data Visualization** | Recharts | `^2.12.3` | Reactive SVG charts (Application Pipeline Bar Charts, Compliance Donuts) |
| **Iconography** | Lucide React | `^0.363.0` | Modern SVG icons across all modules and navigation bars |
| **Animations** | Framer Motion | `^11.0.24` | Micro-interactions, spring transitions, and drawer entrances |
| **Client Routing** | React Router DOM | `^6.22.3` | Client-side routing, protected routes, and layout wrappers |
| **HTTP Client** | Axios | `^1.6.8` | REST API client with request interceptors (JWT injection) & 401 response handling |

### 2.2 Backend Technologies (Server-Side)

| Category | Technology | Version | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Core Platform** | Java Development Kit (JDK) | `17 LTS` | Modern Java runtime with sealed classes, records, and enhanced performance |
| **Enterprise Framework** | Spring Boot | `3.2.4` | Application bootstrapper, auto-configuration, dependency injection |
| **Core Framework** | Spring Framework | `6.1.5` | MVC architecture, IoC container, transaction management, RestTemplate |
| **Security Engine** | Spring Security | `6.2.3` | Stateless authentication filter chain, CORS configuration, CSRF disabling |
| **JWT Library** | Java JWT (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) | `0.12.5` | Cryptographic HMAC-SHA256/384 token signing, parsing, and claim extraction |
| **Persistence (ORM)** | Spring Data JPA / Hibernate | `6.4.4.Final` | Object-Relational Mapping, criteria queries, dynamic entity repositories |
| **Connection Pool** | HikariCP | `5.0.1` | High-performance JDBC connection pooling |
| **Input Validation** | Jakarta Validation (Hibernate Validator) | `3.0.2` | Data Transfer Object (DTO) contract enforcement (`@NotBlank`, `@Valid`, `@NotNull`) |
| **Database Migrations** | Flyway Community Edition | `9.22.3` | Schema version control (`V1__initial_schema.sql`, `V2__seed_data.sql`) |
| **JSON Serialization** | Jackson Databind | `2.15.4` | JSON payload serialization, deserialization, and tree node traversal |
| **Embedded Server** | Apache Tomcat | `10.1.19` | High-throughput embedded HTTP/1.1 servlet container |
| **Build Management** | Apache Maven | `3.9+` | Dependency resolution, test orchestration, and shaded JAR packaging |

### 2.3 Database & Storage Technologies

| Engine | Version | Driver / Extension | Role in RegulaFlow AI |
| :--- | :--- | :--- | :--- |
| **PostgreSQL** | `16.x` | `org.postgresql:postgresql` | Production ACID-compliant relational storage for institutions, applications, and audit logs |
| **pgvector** | `0.6.0+` | `pgvector/pgvector:pg16` | Vector similarity search for handbook clause embeddings (cosine distance) |
| **H2 Database** | `2.2.224` | `com.h2database:h2` | In-memory relational database for rapid development, testing, and zero-setup deployment |

### 2.4 Artificial Intelligence & LLM Technologies

| Technology | Provider / Standard | Models & Configurations | Role in RegulaFlow AI |
| :--- | :--- | :--- | :--- |
| **Google Gemini Generative AI** | Google AI Studio / Generative Language API | `gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-3-flash-preview`, `gemini-2.5-flash` | Powers the primary conversational regulatory assistant, natural language policy synthesis, and clause explanations |
| **Retrieval-Augmented Generation (RAG)** | Custom Hybrid Architecture | Grounded Database Context + Vector Matching | Contextually grounds Gemini answers in statutory text from the AICTE Approval Process Handbook (APH 2026-27) |
| **In-Engine Fallback RAG** | Java Spring Boot | Tokenizer & Relevance Scoring Matrix | High-availability fallback engine guaranteeing answers if external APIs encounter rate limits |
| **Python AI Microservice** | FastAPI / Uvicorn | Python 3.10+, Pydantic v2 | Auxiliary microservice for specialized NLP tasks, vector computations, and PDF parsing |
| **Semantic Knowledge Graph** | SVG + Relational Ontologies | 7 Indexed Entity Types, 8 Directed Relational Edges | Interactive structural dependency visualizer linking regulations, clauses, institutions, and filings |
| **Policy Evolution Engine** | Statutory Diff Matrix | APH 2025-26 vs. APH 2026-27 | Automated regulatory change impact analysis identifying affected campuses and required officer actions |

### 2.5 DevOps, Containerization & Tools

| Tool | Purpose |
| :--- | :--- |
| **Docker & Dockerfile** | Multi-stage build containers for Java Spring Boot backend, Node.js frontend, and Python AI service |
| **Docker Compose** | Orchestration of PostgreSQL (pgvector), Spring Boot backend, FastAPI microservice, and frontend reverse proxy |
| **Git & GitHub** | Distributed version control and collaboration |

---

## 3. UI/UX Design System Specification (Glassmorphism Direction)

The entire user interface strictly follows a custom **Smoky Dark Glassmorphism** design specification matching premium futuristic desktop interfaces:

```
┌────────────────────────────────────────────────────────────────────────┐
│  COLOR TOKENS                                                          │
│  • Primary Background:       #08090B (Near-Black)                      │
│  • Secondary Background:     #111215 (Deep Charcoal)                   │
│  • Primary Surface:          rgba(255, 255, 255, 0.06)                 │
│  • Glass Border:             rgba(255, 255, 255, 0.18)                 │
│  • Primary Text:             #F5F5F5 (Crisp Off-White)                 │
│  • Secondary Text:           #A5A5AD (Muted Cool Slate)                │
│  • Primary Accent:           #B9F56B (Soft Luminous Lime Green)        │
│  • Secondary Accent:         #C8CBD2 (Cool Brushed Silver)             │
│                                                                        │
│  FROSTED GLASS EFFECT                                                  │
│  • Blur Filter:              backdrop-filter: blur(18px)               │
│  • Inner Specular Highlight: box-shadow: inset 0 1px 1px 0             │
│                                          rgba(255, 255, 255, 0.20)     │
│  • Ambient Lighting:         Soft blurred background orbs (120px blur) │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Custom CSS Classes
- `.glass-surface`: Translucent glass panel with 18px blur and white/15 border.
- `.glass-card`: Elevated floating frosted card with inner highlight and dark outer shadow.
- `.glass-button`: Charcoal translucent button with silver border and soft hover illumination.
- `.btn-lime`: High-priority CTA button using `#B9F56B` lime green with glowing shadow.
- `.glass-input`: Translucent input field with lime focus glow and silver placeholder text.
- `.ambient-orb`: Positioned blurred lighting orbs providing realistic glass refractions.

---

## 4. Role-Based Access Control (RBAC) Matrix

RegulaFlow AI implements strict Role-Based Access Control enforcing statutory separation of duties across 7 government and stakeholder personas:

| Role Identifier | Role Title | Functional Scope |
| :--- | :--- | :--- |
| `ROLE_ADMIN` | System Administrator | Full administrative privileges, user management, system diagnostics, and audit configuration |
| `ROLE_REGULATORY_OFFICER` | Regulatory Bureau Officer | High-level pipeline monitoring, approval issuance, and national compliance oversight |
| `ROLE_SCRUTINY_OFFICER` | Scrutiny Officer | Document verification, deficiency issuance, CADRE ratio audits, and checklist validation |
| `ROLE_EVC_OFFICER` | Expert Visit Committee (EVC) | On-site physical verification scheduling, conflict-of-interest checks, and GPS report filing |
| `ROLE_COMPLIANCE_OFFICER` | Compliance & Vigilance Officer | Post-approval compliance audits, show-cause notices, and statutory obligation enforcement |
| `ROLE_AUDITOR` | Central Vigilance Auditor | Read-only immutable access to cryptographic audit logs, state transitions, and CSV ledgers |
| `ROLE_INSTITUTION_ADMIN` | Institution Principal / Director | Application submission wizard, deficiency rectification, document upload, and status tracking |

---

## 5. Security & Governance Architecture

1. **Cryptographic Token Security:**
   - Stateless JWT authentication signed with 256-bit HMAC secret keys.
   - Tokens carry user identity, assigned role, and institution scope.
   - Configurable token expiration (default 24 hours).
2. **Password Protection:**
   - BCrypt adaptive hashing with strength cost factor 10.
3. **CORS & CSRF Defense:**
   - Explicit CORS policy allowing only authorized frontend origins (`http://localhost:5173`, `http://localhost:5174`).
   - CSRF protection disabled in favor of stateless JWT tokens immune to cross-site cookie injection.
4. **Append-Only Immutable Audit Trail:**
   - Central vigilance log recording every state transition, actor ID, username, role, target entity, timestamp, and IP address.
   - Exportable to CSV for government accountability reviews.

---

## 6. Directory Structure Overview

```
REGLUFLOW AI/
├── .env.example                     # Environment variables template
├── docker-compose.yml               # Multi-service container orchestration
├── TECHNICAL_STACK.md               # Detailed technical stack specification (this file)
│
├── frontend/                        # React 18 + Vite 5 Client Application
│   ├── index.html                   # HTML5 Entrypoint with custom typography & meta tags
│   ├── package.json                 # Frontend dependencies and npm scripts
│   ├── tailwind.config.js           # Custom glassmorphic color palette & theme extensions
│   ├── vite.config.js               # Vite config with API proxy to port 8080
│   └── src/
│       ├── App.jsx                  # Main application routes & enterprise layout wrapper
│       ├── index.css                # Global glassmorphism design system & utility classes
│       ├── components/
│       │   ├── EnterpriseLayout.jsx # Translucent dark-glass sidebar & top header
│       │   ├── Navbar.jsx           # Public glassmorphic navigation bar
│       │   ├── NetworkGlobe3D.jsx   # Three.js 3D Interactive Topology Globe
│       │   ├── CopilotDrawer.jsx    # Quick Gemini AI regulatory assistant drawer
│       │   └── WorkflowStepper.jsx  # Multi-stage approval progress tracker
│       ├── context/
│       │   └── AuthContext.jsx      # Authentication state, JWT management, and role switcher
│       ├── pages/
│       │   ├── LandingPage.jsx      # Hero showcase, 3D globe, and quick role evaluators
│       │   ├── LoginPage.jsx        # Glassmorphic login with quick demo credentials
│       │   ├── RoleSelectionPage.jsx# 7 interactive role cards with hover illumination
│       │   ├── RegulatoryDashboard.jsx # KPI cards, pipeline charts, and priority queues
│       │   ├── ApplicationDetailsPage.jsx # Application workspace with documents & transitions
│       │   ├── CompliancePage.jsx   # Statutory obligations table & verification actions
│       │   ├── EvcManagementPage.jsx# Interactive EVC monthly inspection calendar & scheduler
│       │   ├── CopilotPage.jsx      # 3-panel Gemini AI workspace with SVG knowledge graph
│       │   ├── InstitutionPortal.jsx# College self-service application filing portal
│       │   ├── AuditTrailPage.jsx   # Immutable vigilance event ledger with CSV export
│       │   ├── KnowledgeGraphPage.jsx # Indexed regulatory entity matrix & relationship inspector
│       │   └── ImpactAnalysisPage.jsx # Handbook edition diff comparison (APH 2025 vs 2026)
│       └── services/
│           └── api.js               # Centralized Axios client with live backend endpoints
│
├── backend/                         # Java 17 + Spring Boot 3.2.4 Application
│   ├── pom.xml                      # Maven project definition and dependencies
│   └── src/main/
│       ├── java/gov/aicte/regulaflow/
│       │   ├── RegulaflowBackendApplication.java # Spring Boot main entrypoint
│       │   ├── config/              # Security and Web MVC configurations
│       │   ├── controller/          # REST Controllers (Auth, Applications, AI, Compliance, EVC, Audit)
│       │   ├── dto/                 # Request/Response Data Transfer Objects
│       │   ├── entity/              # JPA Database Entities (Users, Applications, Clauses, AuditEvents)
│       │   ├── repository/          # Spring Data JPA Repository Interfaces
│       │   ├── security/            # JWT Filter, Token Provider, UserDetailsService
│       │   └── service/             # Business Logic & Gemini AI Integration Services
│       └── resources/
│           ├── application.yml      # Base Spring Boot application configuration
│           ├── application-dev.yml  # Development profile configuration (H2)
│           ├── application-prod.yml # Production profile configuration (PostgreSQL)
│           └── db/migration/
│               ├── V1__initial_schema.sql # 14 relational database tables and indexes
│               └── V2__seed_data.sql      # Seed institutions, users, applications, and clauses
│
└── ai-service/                      # Python FastAPI Auxiliary Microservice
    ├── Dockerfile                   # Container definition for Python AI runner
    ├── main.py                      # FastAPI query and impact analysis endpoints
    └── requirements.txt             # Python dependencies (FastAPI, Uvicorn, Pydantic)
```

---

## 7. How to Run Locally

### Prerequisites
- **Node.js:** v18+ and `npm`
- **Java:** JDK 17+
- **Maven:** v3.8+ (or Maven wrapper)
- *(Optional)* **Docker & Docker Compose**

### Step-by-Step Launch
1. **Start Spring Boot Backend:**
   ```bash
   cd backend
   mvn clean package -DskipTests
   java -jar target/regulaflow-backend-1.0.0.jar --spring.profiles.active=dev
   ```
   *Backend runs on `http://localhost:8080`.*

2. **Start Frontend Client:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend runs on `http://localhost:5173` (or `http://localhost:5174`).*

3. **Log in with any seed role:**
   - **Regulatory Officer:** `reg_officer` / `password123`
   - **Scrutiny Officer:** `scrutiny_officer` / `password123`
   - **EVC Officer:** `evc_officer` / `password123`
   - **Institution Admin:** `inst_admin` / `password123`
   - **Compliance Officer:** `compliance_officer` / `password123`
   - **Auditor:** `auditor` / `password123`
   - **Administrator:** `admin` / `password123`
