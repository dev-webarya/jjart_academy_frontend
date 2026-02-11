import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = ({ isOpen, onClose, onBackToLogin }) => {
  const [step, setStep] = useState('email'); // email, verification, reset, success
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { requestOTP, verifyOTP, resetPassword } = useAuth();

  if (!isOpen) return null;

  // Step 1: Send verification code
  // Step 1: Send verification code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      if (requestOTP) {
        const result = await requestOTP(email);
        if (result.success) {
          setStep('verification');
        } else {
          setError(result.message || 'Failed to send verification code. Please try again.');
        }
      } else {
        setError('Service unavailable');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);
    try {
      if (requestOTP) {
        const result = await requestOTP(email);
        if (result.success) {
          alert('OTP sent successfully!');
        } else {
          setError(result.message || 'Failed to resend OTP');
        }
      }
    } catch (err) {
      setError('Error resending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      if (verifyOTP) {
        const result = await verifyOTP({ email, otp: verificationCode });

        if (result.success) {
          setStep('reset');
        } else {
          setError(result.message || 'Invalid verification code. Please try again.');
        }
      } else {
        setError('Service unavailable');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      if (resetPassword) {
        const result = await resetPassword({
          email,
          otp: verificationCode,
          newPassword: password
        });

        if (result.success) {
          setStep('success');
        } else {
          setError(result.message || 'Failed to reset password. Please try again.');
        }
      } else {
        setError('Service unavailable');
      }
    } catch (err) {
      setError('Reset password failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to email step
  const handleReset = () => {
    setStep('email');
    setEmail('');
    setVerificationCode('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  // Close and redirect to login
  const handleBackToLogin = () => {
    handleReset();
    onClose();
    if (onBackToLogin) onBackToLogin();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full sm:w-96 max-w-sm sm:max-w-md overflow-hidden transform transition-all">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-4 sm:p-6 md:p-8 rounded-b-2xl sm:rounded-b-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-white/10 rounded-full -mr-10 sm:-mr-20 -mt-10 sm:-mt-20"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full -ml-8 sm:-ml-16 -mb-8 sm:-mb-16"></div>
          <div className="relative flex justify-between items-start gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">Reset Password</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                {step === 'email' && 'Enter your email to get started'}
                {step === 'verification' && 'Verify your email'}
                {step === 'reset' && 'Create a new password'}
                {step === 'success' && 'Password reset successful'}
              </p>
            </div>
            <button
              onClick={handleBackToLogin}
              className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-all transform hover:scale-110 shrink-0"
            >
              <FaTimes size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-0.5 sm:h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300 ${step === 'email' ? 'w-1/4' : step === 'verification' ? 'w-2/4' : step === 'reset' ? 'w-3/4' : 'w-full'
              }`}
          ></div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-3 sm:space-y-4 md:space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium">
                  ✕ {error}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FaEnvelope className="inline mr-2 text-blue-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                  📧 We'll send a verification code to your email address
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 md:py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span className="text-xs sm:text-sm">Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm">Send Verification Code</span> <FaArrowRight className="text-xs sm:text-sm" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === 'verification' && (
            <form onSubmit={handleVerifyCode} className="space-y-3 sm:space-y-4 md:space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium">
                  ✕ {error}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 font-medium">
                  ✓ Verification code sent to<br />
                  <span className="font-semibold text-xs sm:text-sm break-all">{email}</span>
                </p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Verification Code (6 digits)
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                    setError('');
                  }}
                  maxLength="6"
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 text-xl sm:text-2xl tracking-widest font-mono text-center"
                  placeholder="000000"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-xs sm:text-sm text-purple-600 font-bold hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>



              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 md:py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span className="text-xs sm:text-sm">Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs sm:text-sm">Verify Code</span> <FaArrowRight className="text-xs sm:text-sm" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full text-center text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors py-2"
                >
                  Use different email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-3 sm:space-y-4 md:space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium">
                  ✕ {error}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FaLock className="inline mr-2 text-blue-600" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    disabled={isLoading}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Enter new password"
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  At least 6 characters
                </p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FaLock className="inline mr-2 text-blue-600" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    disabled={isLoading}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} className="sm:w-4.5 sm:h-4.5" /> : <FaEye size={16} className="sm:w-4.5 sm:h-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 md:py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span className="text-xs sm:text-sm">Resetting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm">Reset Password</span> <FaArrowRight className="text-xs sm:text-sm" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4 sm:space-y-5 md:space-y-6">
              <div className="inline-block p-3 sm:p-4 bg-green-100 dark:bg-blue-900/20 rounded-full">
                <FaCheckCircle className="text-3xl sm:text-4xl md:text-5xl text-blue-600" />
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
                  Password Reset Successful!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Your password has been reset successfully. You can now login with your new password.
                </p>
              </div>

              <button
                onClick={handleBackToLogin}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 md:py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span className="text-xs sm:text-sm">Back to Login</span> <FaArrowRight className="text-xs sm:text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
