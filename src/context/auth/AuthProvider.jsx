import { createContext, useState, useEffect } from 'react';
import { verifyToken, logout as apiLogout, hasRole, hasAnyRole, login as authLogin } from './authService';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    role: null
  });

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await verifyToken();
        
        if (user) {
          setAuthState({
            user: user.username,
            isLoading: false,
            isAuthenticated: true,
            role: user.role
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            role: null
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          role: null
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const user = await authLogin(credentials);
      setAuthState({
        user: user.username,
        isLoading: false,
        isAuthenticated: true,
        role: user.role
      });
      return true;
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        role: null
      });
      throw error;
    }
  };
  
  const logout = () => {
    apiLogout();
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      role: null
    });
  };
  
  const checkRole = (requiredRole) => {
    return hasRole(requiredRole);
  };

  const checkAnyRole = (requiredRoles) => {
    return hasAnyRole(requiredRoles);
  };
  
  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      checkRole,
      checkAnyRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;