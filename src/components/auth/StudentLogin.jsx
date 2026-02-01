import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserGraduate } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ForgotPassword from './ForgotPassword';

const StudentLogin = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();

  // Safe useAuth destructuring
  const auth = useAuth();
  const { studentLogin } = auth || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      if (studentLogin) {
        const result = await studentLogin({
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          onClose();
          navigate('/', { replace: true });
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        setError('Login service unavailable');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full sm:w-96 max-w-sm sm:max-w-md overflow-hidden transform transition-all">
        {/* Enhanced Header */}
        <div className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-4 sm:p-6 md:p-8 rounded-b-2xl sm:rounded-b-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-white/10 rounded-full -mr-10 sm:-mr-20 -mt-10 sm:-mt-20"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full -ml-8 sm:-ml-16 -mb-8 sm:-mb-16"></div>
          <div className="relative flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                  <FaUserGraduate size={16} className="sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold">Student Login</h2>
              </div>
              <p className="text-blue-100 text-xs sm:text-sm">Access your student dashboard</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-all transform hover:scale-110 shrink-0"
            >
              <FaTimes size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 md:space-y-5" autoComplete="off">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium">
              ✕ {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FaEnvelope className="inline mr-2 text-blue-600" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="off"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FaLock className="inline mr-2 text-blue-600" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                {showPassword ? <FaEyeSlash size={16} className="sm:w-4.5 sm:h-4.5" /> : <FaEye size={16} className="sm:w-4.5 sm:h-4.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 md:py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                <span className="text-xs sm:text-sm">Logging in...</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm">Login as Student</span>
            )}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center pt-1.5 sm:pt-2">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {/* ForgotPassword Modal */}
        <ForgotPassword
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </div>
    </div>
  );
};

export default StudentLogin;
