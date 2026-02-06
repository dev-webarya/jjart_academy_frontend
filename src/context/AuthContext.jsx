import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

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
      return !!localStorage.getItem('studentAuth');
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const storedStudent = localStorage.getItem('studentAuth');
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
      if (e.key === 'studentAuth') {
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


  const register = useCallback(async (registrationData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || "http://93.127.194.118:8095"}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed'
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('❌ Registration error:', error);
      return {
        success: false,
        message: 'Network error during registration.'
      };
    }
  }, []);

  const verifyOTP = useCallback(async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || "http://93.127.194.118:8095"}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'OTP verification failed'
        };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('❌ OTP Verification error:', error);
      return {
        success: false,
        message: 'Network error during verification.'
      };
    }
  }, []);

  const requestOTP = useCallback(async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || "http://93.127.194.118:8095"}/api/v1/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to request OTP'
        };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Request OTP error:', error);
      return {
        success: false,
        message: 'Network error. Could not request OTP.'
      };
    }
  }, []);

  const studentLogin = useCallback(async (credentials) => {
    // Expecting credentials to be { email, password } for real API
    // Maintain backward compatibility if object passed has other fields (though we should update calls)
    const { email, password } = credentials;

    if (!email || !password) {
      console.error('Invalid credentials provided to studentLogin');
      return { success: false, message: 'Email and password are required' };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || "http://93.127.194.118:8095"}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }

      const validatedData = {
        id: data.userId || data.id,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || email.split('@')[0],
        email: data.email,
        role: 'Student',
        accessToken: data.accessToken,
        loginTime: new Date().toISOString(),
        ...data // Include other fields returned by API
      };

      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }

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
      return { success: false, message: error.message || 'Login failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    console.log('🚪 Logging out user...');
    setUser(null);
    setIsAuthenticated(false);
    setIsStudent(false);
    localStorage.removeItem('studentAuth');
    localStorage.removeItem('token'); // Clear JWT token
    console.log('✅ User logged out successfully');
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser(prevUser => {
      const newUserData = { ...prevUser, ...updatedData };
      localStorage.setItem('studentAuth', JSON.stringify(newUserData));
      return newUserData;
    });
  }, [isStudent]);

  const resetPassword = useCallback(async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || "http://93.127.194.118:8095"}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Password reset failed'
        };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Password Reset error:', error);
      return {
        success: false,
        message: 'Network error during password reset.'
      };
    }
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    isStudent,
    isLoading,
    register,
    verifyOTP,
    requestOTP,
    resetPassword,
    studentLogin,
    logout,
    updateUser
  }), [isAuthenticated, user, isStudent, isLoading, register, verifyOTP, requestOTP, resetPassword, studentLogin, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};