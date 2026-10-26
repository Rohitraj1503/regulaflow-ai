-- RegulaFlow AI: Add authorized_roles column to users for multi-role switching security
ALTER TABLE users ADD COLUMN authorized_roles VARCHAR(500);

-- Update seed users with their assigned authorized roles
UPDATE users SET authorized_roles = 'ROLE_ADMIN,ROLE_REGULATORY_OFFICER,ROLE_SCRUTINY_OFFICER,ROLE_EVC_OFFICER,ROLE_INSTITUTION,ROLE_COMPLIANCE_OFFICER,ROLE_AUDITOR' WHERE username = 'admin';
UPDATE users SET authorized_roles = 'ROLE_REGULATORY_OFFICER,ROLE_SCRUTINY_OFFICER' WHERE username = 'reg_officer';
UPDATE users SET authorized_roles = 'ROLE_SCRUTINY_OFFICER' WHERE username = 'scrutiny_officer';
UPDATE users SET authorized_roles = 'ROLE_EVC_OFFICER' WHERE username = 'evc_officer';
UPDATE users SET authorized_roles = 'ROLE_INSTITUTION' WHERE username = 'inst_admin';
UPDATE users SET authorized_roles = 'ROLE_COMPLIANCE_OFFICER' WHERE username = 'compliance_officer';
UPDATE users SET authorized_roles = 'ROLE_AUDITOR' WHERE username = 'auditor';
