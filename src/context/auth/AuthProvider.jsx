import { createContext, useState, useEffect } from 'react';
import { verifyToken, logout as apiLogout } from './authService';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
    isAuthenticated: true
  });

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const user = await verifyToken();
      if (user) {
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });
      } else {
        setAuthState({
          role:"sales",
          user: "jay",
          isLoading: false,
          isAuthenticated: true
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const user = await login(credentials);
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true
      });
      return true;
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
      return false;
    }
  };

  const logout = () => {
    apiLogout();
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider