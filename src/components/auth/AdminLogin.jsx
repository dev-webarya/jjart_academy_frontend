import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = ({ isOpen, onClose }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const result = login(credentials);
      setIsLoading(false);
      if (result.success) {
        onClose();
        navigate('/admin/dashboard');
      } else {
        setError(result.message);
      }
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full sm:w-96 max-w-sm sm:max-w-md overflow-hidden transform transition-all">
        {/* Enhanced Header */}
        <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-4 sm:p-6 md:p-8 rounded-b-2xl sm:rounded-b-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-white/10 rounded-full -mr-10 sm:-mr-20 -mt-10 sm:-mt-20"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full -ml-8 sm:-ml-16 -mb-8 sm:-mb-16"></div>
          <div className="relative flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                  <FaShieldAlt size={16} className="sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold">Admin Login</h2>
              </div>
              <p className="text-indigo-100 text-xs sm:text-sm">Secure access to admin panel</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-all transform hover:scale-110 shrink-0"
              aria-label="Close"
            >
              <FaTimes size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        {/* Form */}
        <div className="p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5" autoComplete="off">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium">
                ✕ {error}
              </div>
            )}
            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FaEnvelope className="inline mr-2 text-indigo-600" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="off"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FaLock className="inline mr-2 text-indigo-600" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
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
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3 md:py-3 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span className="text-xs sm:text-sm">Logging in...</span>
                </>
              ) : (
                <span className="text-xs sm:text-sm">Login to Admin Panel</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;