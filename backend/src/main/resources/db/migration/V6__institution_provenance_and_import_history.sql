-- RegulaFlow AI: Database Schema Synchronization & Institution CSV Import History
-- Migration: V6__institution_provenance_and_import_history.sql

-- 1. Create institution import history table for auditable batch tracking
CREATE TABLE IF NOT EXISTS institution_import_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT,
    total_rows INT NOT NULL,
    inserted_rows INT NOT NULL DEFAULT 0,
    updated_rows INT NOT NULL DEFAULT 0,
    skipped_rows INT NOT NULL DEFAULT 0,
    rejected_rows INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    imported_by VARCHAR(100),
    error_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add verified institution provenance and geographic columns to institutions table
ALTER TABLE institutions 
    ADD COLUMN district VARCHAR(100) NULL AFTER state,
    ADD COLUMN pincode VARCHAR(20) NULL AFTER address,
    ADD COLUMN aicte_approval_status VARCHAR(50) NULL AFTER status,
    ADD COLUMN academic_year VARCHAR(20) NULL AFTER aicte_approval_status,
    ADD COLUMN source_name VARCHAR(255) NULL AFTER source_url,
    ADD COLUMN source_publication_date DATE NULL AFTER source_name,
    ADD COLUMN data_quality_status VARCHAR(50) NULL DEFAULT 'VERIFIED' AFTER verified_at,
    ADD COLUMN import_batch_id BIGINT NULL;

-- 3. Modify region column to allow NULL for bulk directory imports where region is derived
ALTER TABLE institutions MODIFY COLUMN region VARCHAR(100) NULL;

-- 4. Add foreign key and performance indexes
ALTER TABLE institutions 
    ADD CONSTRAINT fk_institutions_import_batch 
    FOREIGN KEY (import_batch_id) REFERENCES institution_import_history(id) ON DELETE SET NULL;

CREATE INDEX idx_institutions_state_district ON institutions(state, district);
CREATE INDEX idx_institutions_data_quality ON institutions(data_quality_status);
CREATE INDEX idx_institutions_approval_status ON institutions(aicte_approval_status);

-- 5. Backfill existing seed institutions with verified provenance attributes
UPDATE institutions SET 
    district = 'Pune',
    pincode = '411005',
    aicte_approval_status = 'APPROVED',
    academic_year = '2024-2025',
    source_name = 'All India Council for Technical Education (AICTE)',
    source_publication_date = '2024-06-30',
    data_quality_status = 'VERIFIED'
WHERE id = 1;

UPDATE institutions SET 
    district = 'Mumbai City',
    pincode = '400019',
    aicte_approval_status = 'APPROVED',
    academic_year = '2024-2025',
    source_name = 'All India Council for Technical Education (AICTE)',
    source_publication_date = '2024-06-30',
    data_quality_status = 'VERIFIED'
WHERE id = 2;

UPDATE institutions SET 
    district = 'North West Delhi',
    pincode = '110042',
    aicte_approval_status = 'APPROVED',
    academic_year = '2024-2025',
    source_name = 'All India Council for Technical Education (AICTE)',
    source_publication_date = '2024-06-30',
    data_quality_status = 'VERIFIED'
WHERE id = 3;
