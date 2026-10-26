import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_USERS = [
  { key: 'admin', label: 'Admin', role: 'ROLE_ADMIN', username: 'admin', title: 'System Administrator (AICTE HQ)' },
  { key: 'reg_officer', label: 'Reg. Officer', role: 'ROLE_REGULATORY_OFFICER', username: 'reg_officer', title: 'Regulatory Officer (Approval Bureau)' },
  { key: 'scrutiny_officer', label: 'Scrutiny', role: 'ROLE_SCRUTINY_OFFICER', username: 'scrutiny_officer', title: 'Scrutiny Officer (Deficiencies Cell)' },
  { key: 'evc_officer', label: 'EVC Expert', role: 'ROLE_EVC_OFFICER', username: 'evc_officer', title: 'EVC Committee Lead Officer' },
  { key: 'inst_admin', label: 'Institution', role: 'ROLE_INSTITUTION_ADMIN', username: 'inst_admin', title: 'Institution Admin (Apex Institute)' },
  { key: 'compliance_officer', label: 'Compliance', role: 'ROLE_COMPLIANCE_OFFICER', username: 'compliance_officer', title: 'Compliance & Vigilance Officer' },
  { key: 'auditor', label: 'Auditor', role: 'ROLE_AUDITOR', username: 'auditor', title: 'Central Vigilance Auditor' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('regulaflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('regulaflow_user');
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('regulaflow_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      api.getCurrentUser()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('regulaflow_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.login({ username, password });
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('regulaflow_token', jwtToken);
      localStorage.setItem('regulaflow_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      let errorMsg = 'Login failed. Please verify credentials.';
      if (err.code === 'ERR_NETWORK' || !err.response) {
        errorMsg = 'Network or server connection unavailable. Please ensure the backend is running.';
      } else if (err.response?.status === 502 || err.response?.status === 504 || (err.response?.status === 500 && typeof err.response?.data === 'string' && err.response.data.includes('ECONNREFUSED'))) {
        errorMsg = 'Backend server is not reachable. Please check if Spring Boot is running on port 8080.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMsg = 'Invalid username or password.';
      } else if (err.response?.status === 403) {
        errorMsg = 'Account is disabled or unauthorized.';
      } else if (err.response?.status >= 500) {
        errorMsg = 'Internal server authentication error. Please try again later.';
      }
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async () => {
    // Role impersonation without credentials is strictly prohibited by security policy
    return {
      success: false,
      error: 'Direct role switching is disabled. Each account requires separate credential authentication.',
    };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('regulaflow_token');
    localStorage.removeItem('regulaflow_user');
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      switchRole,
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
