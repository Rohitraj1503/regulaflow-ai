-- RegulaFlow AI: Security Enhancement
-- Restrict authorized_roles to user's assigned role only, eliminating unauthorized role switching/impersonation

UPDATE users SET authorized_roles = role WHERE authorized_roles IS NOT NULL;
