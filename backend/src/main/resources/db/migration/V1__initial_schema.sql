-- RegulaFlow AI: Initial Schema (MySQL 8.0+ & ANSI SQL Compatible)

CREATE TABLE institutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    aicte_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    institute_type VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    established_year INT,
    nirf_rank INT,
    accreditation_status VARCHAR(50),
    campus_area_acres NUMERIC(8, 2),
    built_up_area_sqm NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    institution_id BIGINT,
    phone VARCHAR(30),
    department VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE SET NULL
);

CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    institution_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    assigned_officer_id BIGINT,
    submission_date TIMESTAMP NULL,
    sla_due_date TIMESTAMP NULL,
    approval_date TIMESTAMP NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_institution FOREIGN KEY (institution_id) REFERENCES institutions (id),
    CONSTRAINT fk_app_officer FOREIGN KEY (assigned_officer_id) REFERENCES users (id)
);

CREATE TABLE application_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    checksum VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    deficiency_notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_application FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE
);

CREATE TABLE workflow_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    actor_id BIGINT,
    actor_name VARCHAR(150),
    actor_role VARCHAR(50),
    remarks TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_application FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE
);

CREATE TABLE deficiencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    clause_reference VARCHAR(100),
    issue_description TEXT NOT NULL,
    category VARCHAR(100),
    severity VARCHAR(30) DEFAULT 'MEDIUM',
    status VARCHAR(50) DEFAULT 'OPEN',
    response_remarks TEXT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_def_application FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE
);

CREATE TABLE evc_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    visit_type VARCHAR(50) NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    lead_officer_id BIGINT NOT NULL,
    committee_members VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    findings_summary TEXT,
    infrastructure_score INT,
    faculty_score INT,
    labs_score INT,
    recommendation VARCHAR(50),
    report_file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_evc_application FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_evc_lead_officer FOREIGN KEY (lead_officer_id) REFERENCES users (id)
);

CREATE TABLE compliance_obligations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT NOT NULL,
    obligation_title VARCHAR(255) NOT NULL,
    regulatory_clause VARCHAR(100) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    deadline TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    last_verified_at TIMESTAMP NULL,
    verified_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comp_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE
);

CREATE TABLE compliance_evidence (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    obligation_id BIGINT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validity_start_date TIMESTAMP NULL,
    validity_end_date TIMESTAMP NULL,
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    remarks TEXT,
    CONSTRAINT fk_evid_obligation FOREIGN KEY (obligation_id) REFERENCES compliance_obligations (id) ON DELETE CASCADE
);

CREATE TABLE undertakings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    institution_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    declaration_text TEXT NOT NULL,
    authorized_signatory_name VARCHAR(150) NOT NULL,
    signatory_designation VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    agreed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_und_application FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_und_institution FOREIGN KEY (institution_id) REFERENCES institutions (id)
);

CREATE TABLE regulatory_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    regulation_code VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    version VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    summary TEXT,
    document_url VARCHAR(500),
    published_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regulatory_clauses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT NOT NULL,
    section_number VARCHAR(50),
    clause_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    applicable_to VARCHAR(150),
    penalty_notes TEXT,
    CONSTRAINT fk_clause_doc FOREIGN KEY (document_id) REFERENCES regulatory_documents (id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    urgency VARCHAR(30) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    reference_id VARCHAR(100),
    reference_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE audit_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_username VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    previous_state TEXT,
    new_state TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_apps_institution ON applications(institution_id);
CREATE INDEX idx_apps_status ON applications(status);
CREATE INDEX idx_audit_timestamp ON audit_events(timestamp);
CREATE INDEX idx_notif_user_unread ON notifications(user_id, is_read);
