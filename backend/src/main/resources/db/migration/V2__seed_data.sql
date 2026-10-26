-- RegulaFlow AI: Seed Data (using auto-generated identities)

-- 1. Institutions
INSERT INTO institutions (aicte_id, name, institute_type, region, state, city, address, established_year, nirf_rank, accreditation_status, campus_area_acres, built_up_area_sqm, status) VALUES
('AICTE-1-10029381', 'Apex Institute of Technology', 'Engineering & Technology', 'Northern', 'Delhi', 'New Delhi', 'Plot 4, Institutional Area, Vasant Kunj', 2008, 48, 'NBA_TIER_1', 12.50, 24500.00, 'ACTIVE'),
('AICTE-1-10048291', 'Western College of Engineering & Research', 'Engineering & Technology', 'Western', 'Maharashtra', 'Pune', 'Survey No 34, Shivajinagar', 2012, 72, 'NAAC_A_PLUS', 15.00, 28000.00, 'ACTIVE'),
('AICTE-1-10078392', 'Southern Academy of Technological Sciences', 'Engineering & Management', 'Southern', 'Karnataka', 'Bengaluru', 'Outer Ring Road, Marathahalli', 2015, 65, 'NBA_ACCREDITED', 10.20, 22000.00, 'ACTIVE'),
('AICTE-1-10098472', 'Eastern Institute of Management & Science', 'Management', 'Eastern', 'West Bengal', 'Kolkata', 'Sector V, Salt Lake City', 2018, 95, 'NAAC_A', 7.50, 16000.00, 'ACTIVE'),
('AICTE-1-10034821', 'Central Polytechnic Institute', 'Polytechnic Diploma', 'Central', 'Madhya Pradesh', 'Bhopal', 'Ayodhya Bypass Road', 2010, NULL, 'STATE_APPROVED', 8.00, 14200.00, 'ACTIVE');

-- 2. Users (BCrypt hash for 'password123')
INSERT INTO users (username, email, password, full_name, role, institution_id, phone, department, active) VALUES
('admin', 'admin@regulaflow.gov.in', '$2a$10$7jesKZjLzb7TO/EtohBY0.icqCiouIFWixCqqBxQJp5oty.pdDMSm', 'Dr. Arvind Sharma', 'ROLE_ADMIN', NULL, '+91-11-29581001', 'AICTE HQ Administration', TRUE),
('reg_officer', 'regulatory.officer@regulaflow.gov.in', '$2a$10$7jesKZjLzb7TO/EtohBY0.icqCiouIFWixCqqBxQJp5oty.pdDMSm', 'Rajesh K. Verma', 'ROLE_REGULATORY_OFFICER', NULL, '+91-11-29581045', 'Approval Bureau', TRUE),
('scrutiny_officer', 'scrutiny@regulaflow.gov.in', '$2a$10$7jesKZjLzb7TO/EtohBY0.icqCiouIFWixCqqBxQJp5oty.pdDMSm', 'Prof. Sunita Deshmukh', 'ROLE_SCRUTINY_OFFICER', NULL, '+91-11-29581088', 'Scrutiny & Deficiencies Cell', TRUE),
('evc_officer', 'evc.officer@regulaflow.gov.in', '$2a$10$7jesKZjLzb7TO/EtohBY0.icqCiouIFWixCqqBxQJp5oty.pdDMSm', 'Dr. Vikramaditya Rao', 'ROLE_EVC_OFFICER', NULL, '+91-11-29581120', 'Expert Visit Committee', TRUE),
('inst_admin', 'director@apextech.edu.in', '$2a$10$7jesKZjLzb7TO/EtohBY0.icqCiouIFWixCqqBxQJp5oty.pdDMSm', 'Dr. Meenakshi Sundaram', 'ROLE_INSTITUTION_ADMIN', 1, '+91-9810182746', 'Directorate', TRUE),
('compliance_officer', 'compliance@regulaflow.gov.in', '$2a$10$7jesKZjLzb7TO/EtohBY0.icqCiouIFWixCqqBxQJp5oty.pdDMSm', 'Anand Nambiar', 'ROLE_COMPLIANCE_OFFICER', NULL, '+91-11-29581155', 'Compliance & Vigilance Wing', TRUE),
('auditor', 'auditor@audit.gov.in', '$2a$10$7jesKZjLzb7TO/EtohBY0.icqCiouIFWixCqqBxQJp5oty.pdDMSm', 'Kavita Menon', 'ROLE_AUDITOR', NULL, '+91-11-29581190', 'Central Vigilance Audit', TRUE);

-- 3. Applications
INSERT INTO applications (application_number, institution_id, category, academic_year, status, assigned_officer_id, submission_date, sla_due_date, approval_date, remarks) VALUES
('APP-2026-001', 1, 'EXTENSION_OF_APPROVAL', '2026-27', 'APPROVED', 2, CURRENT_TIMESTAMP - INTERVAL '25' DAY, CURRENT_TIMESTAMP - INTERVAL '5' DAY, CURRENT_TIMESTAMP - INTERVAL '2' DAY, 'All statutory requirements, faculty cadastral norms and built-up area verified. EoA granted for 2026-27.'),
('APP-2026-002', 1, 'INTAKE_INCREASE', '2026-27', 'DEFICIENCY_NOTED', 3, CURRENT_TIMESTAMP - INTERVAL '14' DAY, CURRENT_TIMESTAMP + INTERVAL '6' DAY, NULL, 'Deficiency identified in CSE Cadre Ratio (1:24 vs mandatory 1:20) and fire safety renewal receipt.'),
('APP-2026-003', 2, 'NEW_INSTITUTE', '2026-27', 'EVC_SCHEDULED', 4, CURRENT_TIMESTAMP - INTERVAL '18' DAY, CURRENT_TIMESTAMP + INTERVAL '12' DAY, NULL, 'Initial scrutiny passed. On-site Expert Visit Committee scheduled for physical verification.'),
('APP-2026-004', 3, 'NEW_COURSE', '2026-27', 'UNDER_SCRUTINY', 3, CURRENT_TIMESTAMP - INTERVAL '6' DAY, CURRENT_TIMESTAMP + INTERVAL '14' DAY, NULL, 'Application received for M.Tech Cybersecurity. Verification of lab setups and faculty in progress.'),
('APP-2026-005', 4, 'EXTENSION_OF_APPROVAL', '2026-27', 'SUBMITTED', 2, CURRENT_TIMESTAMP - INTERVAL '2' DAY, CURRENT_TIMESTAMP + INTERVAL '28' DAY, NULL, 'Fresh submission. Awaiting initial officer assignment and verification queue entry.'),
('APP-2026-006', 5, 'EXTENSION_OF_APPROVAL', '2026-27', 'DRAFT', NULL, NULL, NULL, NULL, 'Draft application in preparation by institution.');

-- 4. Application Documents
INSERT INTO application_documents (application_id, document_type, document_name, file_path, file_size, checksum, status, deficiency_notes) VALUES
(1, 'LAND_USE_CERTIFICATE', 'Apex_Land_Conversion_Certificate.pdf', '/uploads/apex_land.pdf', 2415900, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'VERIFIED', NULL),
(1, 'FIRE_SAFETY_NOC', 'Apex_Fire_Dept_NOC_2026.pdf', '/uploads/apex_fire.pdf', 1832400, '5d41402abc4b2a76b9719d911017c592', 'VERIFIED', NULL),
(2, 'FACULTY_CADRE_LIST', 'Apex_CSE_Faculty_Cadre_2026.pdf', '/uploads/apex_faculty.pdf', 3120000, '7d793037a0760186574b0282f2f435e7', 'REJECTED', 'Shortfall of 3 Assistant Professors and 1 Associate Professor as per APH Clause 7.2. Cadre ratio is 1:24.'),
(3, 'BUILDING_PLAN_SANCTION', 'Western_Sanctioned_Master_Plan.pdf', '/uploads/western_plan.pdf', 5420000, '9e107d9d372bb6826bd81d3542a419d6', 'VERIFIED', 'Verified by Municipal Corporation.');

-- 5. Workflow History
INSERT INTO workflow_history (application_id, from_status, to_status, actor_id, actor_name, actor_role, remarks) VALUES
(1, 'DRAFT', 'SUBMITTED', 5, 'Dr. Meenakshi Sundaram', 'ROLE_INSTITUTION_ADMIN', 'Initial EoA submission with full compliance documentation.'),
(1, 'SUBMITTED', 'UNDER_SCRUTINY', 3, 'Prof. Sunita Deshmukh', 'ROLE_SCRUTINY_OFFICER', 'Assigned to scrutiny desk.'),
(1, 'UNDER_SCRUTINY', 'APPROVED', 2, 'Rajesh K. Verma', 'ROLE_REGULATORY_OFFICER', 'All checklist points verified satisfactorily. Approval issued.'),
(2, 'SUBMITTED', 'UNDER_SCRUTINY', 3, 'Prof. Sunita Deshmukh', 'ROLE_SCRUTINY_OFFICER', 'Scrutiny initiated for intake increase.'),
(2, 'UNDER_SCRUTINY', 'DEFICIENCY_NOTED', 3, 'Prof. Sunita Deshmukh', 'ROLE_SCRUTINY_OFFICER', 'Faculty cadre ratio deficit in Computer Science department.'),
(3, 'SUBMITTED', 'UNDER_SCRUTINY', 3, 'Prof. Sunita Deshmukh', 'ROLE_SCRUTINY_OFFICER', 'New campus scrutiny completed.'),
(3, 'UNDER_SCRUTINY', 'EVC_SCHEDULED', 2, 'Rajesh K. Verma', 'ROLE_REGULATORY_OFFICER', 'Physical EVC inspection triggered.');

-- 6. Deficiencies
INSERT INTO deficiencies (application_id, clause_reference, issue_description, category, severity, status, response_remarks) VALUES
(2, 'APH 2026-27 Clause 7.2', 'Cadre ratio in Department of Computer Science & Engineering is 1:24 against mandatory 1:20 norm for proposed intake of 180 seats.', 'FACULTY_NORMS', 'HIGH', 'OPEN', NULL),
(2, 'APH 2026-27 Clause 6.4', 'Updated Fire Safety Certificate renewal acknowledgement receipt dated after submission window.', 'INFRASTRUCTURE_SAFETY', 'MEDIUM', 'OPEN', NULL);

-- 7. EVC Schedules
INSERT INTO evc_schedules (application_id, visit_type, scheduled_date, lead_officer_id, committee_members, status, findings_summary, infrastructure_score, faculty_score, labs_score, recommendation) VALUES
(3, 'PHYSICAL', CURRENT_TIMESTAMP + INTERVAL '5' DAY, 4, 'Dr. Vikramaditya Rao (Lead), Prof. H. S. Murthy (Member, IIT Bombay), Er. S. P. Gupta (PWD Expert)', 'SCHEDULED', 'Site visit scheduled for infrastructure and equipment inspection.', NULL, NULL, NULL, NULL);

-- 8. Compliance Obligations
INSERT INTO compliance_obligations (institution_id, obligation_title, regulatory_clause, frequency, deadline, status) VALUES
(1, 'Fire Safety Certificate Renewal', 'Clause 6.4', 'ANNUAL', CURRENT_TIMESTAMP + INTERVAL '45' DAY, 'PENDING'),
(1, 'Anti-Ragging Committee & Squad Constitution', 'Clause 11.1', 'ANNUAL', CURRENT_TIMESTAMP - INTERVAL '10' DAY, 'VERIFIED'),
(1, 'Mandatory Website Disclosure Upload', 'Clause 12.3', 'ANNUAL', CURRENT_TIMESTAMP + INTERVAL '15' DAY, 'PENDING'),
(2, 'Faculty Cadre Ratio Compliance Affidavit', 'Clause 7.2', 'ANNUAL', CURRENT_TIMESTAMP + INTERVAL '30' DAY, 'PENDING'),
(3, 'Barrier Free Built Environment & Disabled Access', 'Clause 6.8', 'ONE_TIME', CURRENT_TIMESTAMP - INTERVAL '5' DAY, 'OVERDUE');

-- 9. Regulatory Documents & Clauses
INSERT INTO regulatory_documents (title, regulation_code, category, academic_year, version, is_active, summary, document_url, published_date) VALUES
('AICTE Approval Process Handbook (APH) 2026-27', 'AICTE-APH-2026-27', 'APPROVAL_NORMS', '2026-27', 'v2.1', TRUE, 'Comprehensive regulations governing approval of new technical institutions, introduction of new programs, faculty ratios, infrastructure and land norms.', 'https://www.aicte-india.org/aph-2026-27.pdf', CURRENT_TIMESTAMP - INTERVAL '90' DAY),
('AICTE Approval Process Handbook (APH) 2025-26', 'AICTE-APH-2025-26', 'APPROVAL_NORMS', '2025-26', 'v1.0', FALSE, 'Previous year norms and procedural guidelines for technical institutions.', 'https://www.aicte-india.org/aph-2025-26.pdf', CURRENT_TIMESTAMP - INTERVAL '450' DAY);

INSERT INTO regulatory_clauses (document_id, section_number, clause_number, title, content, applicable_to, penalty_notes) VALUES
(1, 'Section 7', '7.2', 'Faculty Student Ratio and Cadre Ratio', 'For Under Graduate Engineering and Technology programs, the required Faculty:Student ratio shall be 1:20. The cadre ratio of Professor:Associate Professor:Assistant Professor shall be 1:2:6. Minimum 80% of faculty must be regular/full-time.', 'Engineering, Technology, Architecture', 'Reduction in approved intake by 25% or withholding of Extension of Approval (EoA).'),
(1, 'Section 6', '6.1', 'Land Requirements for Technical Institutions', 'The minimum land requirement for Mega/Metro cities shall be 2.5 Acres. For Urban areas 4.0 Acres, and for Rural areas 7.5 Acres as a contiguous piece of land registered in the name of the Applicant Society/Trust.', 'New Technical Institutions, Extension', 'Rejection of application or cancellation of provisional approval.'),
(1, 'Section 6', '6.4', 'Fire Safety & Building Plan Approval', 'The institution must possess a valid Fire Safety Certificate issued by the Competent Fire Service Authority of the concerned State/UT, alongside an approved structural safety certificate from a certified chartered structural engineer.', 'All Technical Institutions', 'Immediate suspension of admissions and notice under Section 10(k).'),
(1, 'Section 11', '11.1', 'Establishment of Anti-Ragging Committee', 'Every technical institution shall establish an Anti-Ragging Committee and Anti-Ragging Squad as per Supreme Court directives and AICTE Anti-Ragging Regulations 2009. Toll-free helpline and student undertakings are mandatory.', 'All Technical Institutions', 'Withdrawal of approval and intimation to affiliating university.'),
(1, 'Section 8', '8.3', 'Laboratory and Computing Equipment', 'Each department offering degree programs in Emerging Technologies (AI, ML, Cybersecurity, IoT) shall maintain a minimum of 60 high-performance computing systems with minimum 16GB RAM, GPU acceleration, and 1 Gbps leased internet line.', 'Computer Science, IT, AI-ML', 'Deficiency mark and prohibition from admitting students to specified division.');

-- 10. Notifications
INSERT INTO notifications (user_id, title, message, type, urgency, is_read, reference_id, reference_type) VALUES
(5, 'Deficiency Issued for APP-2026-002', 'Scrutiny Officer has flagged a deficiency in Faculty Cadre Ratio for your Intake Increase application. Clarification required within 15 days.', 'DEFICIENCY', 'CRITICAL', FALSE, 'APP-2026-002', 'APPLICATION'),
(5, 'Approval Granted for APP-2026-001', 'Extension of Approval for academic year 2026-27 has been formally granted by the Approval Bureau.', 'STATUS_CHANGE', 'INFO', FALSE, 'APP-2026-001', 'APPLICATION'),
(2, 'New Application Submitted: APP-2026-005', 'Eastern Institute of Management has submitted an Extension of Approval request awaiting officer assignment.', 'STATUS_CHANGE', 'INFO', FALSE, 'APP-2026-005', 'APPLICATION'),
(4, 'EVC Visit Assigned: APP-2026-003', 'You have been designated as Lead Officer for physical inspection of Western College of Engineering on 29-Oct-2026.', 'EVC_UPDATE', 'WARNING', FALSE, 'APP-2026-003', 'EVC');

-- 11. Audit Events
INSERT INTO audit_events (actor_username, actor_role, action, entity_type, entity_id, previous_state, new_state, ip_address) VALUES
('director@apextech.edu.in', 'ROLE_INSTITUTION_ADMIN', 'SUBMIT_APPLICATION', 'APPLICATION', 'APP-2026-001', 'DRAFT', 'SUBMITTED', '192.168.1.104'),
('scrutiny@regulaflow.gov.in', 'ROLE_SCRUTINY_OFFICER', 'ASSIGN_OFFICER', 'APPLICATION', 'APP-2026-001', 'SUBMITTED', 'UNDER_SCRUTINY', '10.0.12.44'),
('regulatory.officer@regulaflow.gov.in', 'ROLE_REGULATORY_OFFICER', 'APPROVE_APPLICATION', 'APPLICATION', 'APP-2026-001', 'UNDER_SCRUTINY', 'APPROVED', '10.0.12.18'),
('scrutiny@regulaflow.gov.in', 'ROLE_SCRUTINY_OFFICER', 'NOTE_DEFICIENCY', 'APPLICATION', 'APP-2026-002', 'UNDER_SCRUTINY', 'DEFICIENCY_NOTED', '10.0.12.44');
