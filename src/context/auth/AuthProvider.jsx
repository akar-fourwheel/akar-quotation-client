import { createContext, useState, useEffect } from 'react';
import { verifyToken, logout as apiLogout, hasRole, hasAnyRole, login as authLogin } from './authService';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userId: null,
    username:null,
    isLoading: true,
    isAuthenticated: false,
    role: null
  });

  // Check auth status on mount
  useEffect(() => {
    const publicRoutes = ['/login', '/signup', '/unauthorized'];
    
    const checkAuth = async () => {
      try {
        const user = await verifyToken();
        
        if (user) {
          setAuthState({
            userId: user.userId,
            username:user.username,
            isLoading: false,
            isAuthenticated: true,
            role: user.role
          });
        } else {
          setAuthState({
            userId: null,
            username:null,
            isLoading: false,
            isAuthenticated: false,
            role: null
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          userId: null,
          username:null,
          isLoading: false,
          isAuthenticated: false,
          role: null
        });
      }
    };

    if (!publicRoutes.includes(location.pathname)) {
      checkAuth();
    } else {
      // Skip auth check for public routes
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [location.pathname]);

  const login = async (credentials) => {
    try {
      const user = await authLogin(credentials);
      setAuthState({
        userId:user.userId,
        username: user.username,
        isLoading: false,
        isAuthenticated: true,
        role: user.role
      });
      return true;
    } catch (error) {
      setAuthState({
        userId: null,
        username:null,
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
      userId: null,
      username:null,
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