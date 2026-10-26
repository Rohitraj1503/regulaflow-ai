-- RegulaFlow AI: Fix user password hashes with valid 60-character BCrypt hashes for 'Admin@1234'
UPDATE users 
SET password = '$2a$10$62Uubpn7DHSatEbMcVIsm.Kr4iSK97mM604YyCaz10Xkj7GD2ScO2',
    role = 'ROLE_ADMIN',
    active = TRUE,
    authorized_roles = 'ROLE_ADMIN,ROLE_REGULATORY_OFFICER,ROLE_SCRUTINY_OFFICER,ROLE_EVC_OFFICER,ROLE_INSTITUTION,ROLE_COMPLIANCE_OFFICER,ROLE_AUDITOR'
WHERE username = 'admin';

UPDATE users 
SET password = '$2a$10$62Uubpn7DHSatEbMcVIsm.Kr4iSK97mM604YyCaz10Xkj7GD2ScO2',
    active = TRUE
WHERE username IN ('reg_officer', 'scrutiny_officer', 'evc_officer', 'inst_admin', 'compliance_officer', 'auditor')
  AND (password NOT LIKE '$2a$%' AND password NOT LIKE '$2b$%');
