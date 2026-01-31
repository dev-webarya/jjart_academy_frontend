import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility function to validate stored auth data
const validateAuthData = (data) => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  // Only require email as minimum validation
  if (!data.email || typeof data.email !== 'string') {
    return false;
  }
  return true;
};

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage to avoid flash of logged out state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!(localStorage.getItem('adminUser') || localStorage.getItem('studentAuth'));
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem('adminUser');
      const storedStudent = localStorage.getItem('studentAuth');
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin);
        return validateAuthData(adminData) ? adminData : null;
      }
      if (storedStudent) {
        const studentData = JSON.parse(storedStudent);
        return validateAuthData(studentData) ? studentData : null;
      }
    } catch {
      return null;
    }
    return null;
  });

  const [isStudent, setIsStudent] = useState(() => {
    try {
      return !!localStorage.getItem('studentAuth');
    } catch {
      return false;
    }
  });

  // Set to false immediately since we initialize from localStorage
  const [isLoading, setIsLoading] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const restoreSession = () => {
      console.log('🔍 Verifying stored session...');
      // Session already initialized from localStorage in useState
      // This just validates it's still correct
      try {
        const storedAdmin = localStorage.getItem('adminUser');
        const storedStudent = localStorage.getItem('studentAuth');

        if (storedStudent) {
          const studentData = JSON.parse(storedStudent);
          if (validateAuthData(studentData)) {
            console.log('✅ Student session verified:', studentData.email);
            // State already initialized, just confirm it's correct
            setUser(studentData);
            setIsAuthenticated(true);
            setIsStudent(true);
            return;
          }
        }

        if (storedAdmin) {
          const adminData = JSON.parse(storedAdmin);
          if (validateAuthData(adminData)) {
            console.log('✅ Admin session verified:', adminData.email);
            setUser(adminData);
            setIsAuthenticated(true);
            setIsStudent(false);
            return;
          }
        }

        // Only clear state if no valid session exists
        console.log('ℹ️ No valid session found');
        setIsAuthenticated(false);
        setUser(null);
        setIsStudent(false);
      } catch (error) {
        console.error('❌ Error verifying session:', error);
        // Don't clear localStorage on parse errors, just reset state
        setIsAuthenticated(false);
        setUser(null);
        setIsStudent(false);
      }
    };

    // Small delay to ensure state is fully initialized
    const timer = setTimeout(restoreSession, 50);

    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'studentAuth' || e.key === 'adminUser') {
        console.log('🔄 Storage change detected, restoring session...');
        restoreSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const { email, password } = credentials;

    try {
      // Call real backend API for authentication
      const response = await fetch('http://93.127.194.118:8095/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API error responses
        return {
          success: false,
          message: data.message || data.error || 'Invalid email or password'
        };
      }

      // Store JWT token for API authorization
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        console.log('✅ JWT token stored successfully');
      }

      // Map user data from API response
      const userData = {
        id: data.id || data.userId,
        username: data.username || email.split('@')[0],
        name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Admin User',
        email: data.email || email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.roles?.includes('ROLE_ADMIN') ? 'administrator' : 'user',
        roles: data.roles || [],
        accessToken: data.accessToken,
      };

      setUser(userData);
      setIsAuthenticated(true);
      setIsStudent(false);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      console.log('✅ Admin logged in successfully:', userData.email);
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }, []);

  const studentLogin = useCallback((studentData) => {
    // Validate student data before storing
    if (!studentData || !studentData.email) {
      console.error('Invalid student data provided to studentLogin');
      return { success: false, message: 'Invalid student data' };
    }

    try {
      // Ensure required fields exist
      const validatedData = {
        id: studentData.id || Math.random().toString(36).substr(2, 9),
        name: studentData.name || studentData.email.split('@')[0],
        email: studentData.email,
        role: studentData.role || 'Student',
        loginTime: new Date().toISOString(),
        ...studentData
      };

      console.log('🔐 Logging in student:', validatedData.email);

      // CRITICAL: Save to localStorage FIRST with multiple attempts
      try {
        localStorage.setItem('studentAuth', JSON.stringify(validatedData));

        // Double-check it was saved
        const verification = localStorage.getItem('studentAuth');
        if (!verification) {
          // Try one more time
          localStorage.setItem('studentAuth', JSON.stringify(validatedData));
          const secondVerification = localStorage.getItem('studentAuth');
          if (!secondVerification) {
            throw new Error('Failed to save authentication data to localStorage');
          }
        }

        console.log('✅ Student data saved to localStorage');
      } catch (storageError) {
        console.error('❌ localStorage save error:', storageError);
        throw new Error('Failed to save session. Please check browser storage settings.');
      }

      // Then update state
      setUser(validatedData);
      setIsAuthenticated(true);
      setIsStudent(true);

      console.log('✅ Student logged in successfully:', validatedData.email);
      return { success: true };
    } catch (error) {
      console.error('❌ Error during student login:', error);
      // Clean up partial state on error
      localStorage.removeItem('studentAuth');
      setUser(null);
      setIsAuthenticated(false);
      setIsStudent(false);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    console.log('🚪 Logging out user...');
    setUser(null);
    setIsAuthenticated(false);
    setIsStudent(false);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('studentAuth');
    localStorage.removeItem('token'); // Clear JWT token
    console.log('✅ User logged out successfully');
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser(prevUser => {
      const newUserData = { ...prevUser, ...updatedData };
      if (isStudent) {
        localStorage.setItem('studentAuth', JSON.stringify(newUserData));
      } else {
        localStorage.setItem('adminUser', JSON.stringify(newUserData));
      }
      return newUserData;
    });
  }, [isStudent]);

  const value = {
    isAuthenticated,
    user,
    isStudent,
    isLoading,
    login,
    studentLogin,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
