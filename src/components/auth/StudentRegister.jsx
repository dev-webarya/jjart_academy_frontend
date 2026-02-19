import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaPhone, FaUserGraduate } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const StudentRegister = ({ isOpen, onClose, onLoginClick }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: ''
    });
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Safety check for useAuth
    const auth = useAuth();
    const { register, verifyOTP, requestOTP } = auth || {};

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

    const handleResendOTP = async () => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);
        try {
            if (requestOTP) {
                const result = await requestOTP(registeredEmail);
                if (result.success) {
                    setSuccessMessage('OTP resent successfully. Please check your email.');
                } else {
                    setError(result.message || 'Failed to resend OTP');
                }
            } else {
                setError('Resend OTP function not available');
            }
        } catch (err) {
            setError('Error resending OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!otp) {
            setError('Please enter OTP');
            return;
        }

        setIsLoading(true);
        try {
            if (verifyOTP) {
                const result = await verifyOTP({ email: registeredEmail, otp });

                if (result.success) {
                    setSuccessMessage('Verification successful! Redirecting to login...');
                    setTimeout(() => {
                        onClose();
                        if (onLoginClick) onLoginClick();
                    }, 1500);
                } else {
                    setError(result.message || 'Verification failed. Please try again or resend OTP.');
                }
            } else {
                setError('Verify OTP function not available');
            }
        } catch (err) {
            setError('Verification error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phoneNumber) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            if (register) {
                const result = await register(formData);

                if (result.success) {
                    setSuccessMessage('Registration successful! Please enter the OTP sent to your email.');
                    setRegisteredEmail(formData.email);
                    setShowOtpInput(true);
                } else {
                    setError(result.message || 'Registration failed');
                }
            } else {
                setError('Register function not available');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full sm:w-96 max-w-sm sm:max-w-md overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-linear-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-4 sm:p-6 relative shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative flex justify-between items-start gap-2">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <FaUserGraduate size={20} />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold">{showOtpInput ? 'Verify OTP' : 'Register'}</h2>
                            </div>
                            <p className="text-purple-100 text-sm">{showOtpInput ? 'Enter verification code' : 'Join our Art Academy today'}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-all transform hover:scale-110"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="overflow-y-auto flex-1 p-4 sm:p-6">
                    {showOtpInput ? (
                        <form onSubmit={handleOtpVerify} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm font-medium">
                                    ✕ {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm font-medium">
                                    ✓ {successMessage}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    One-Time Password
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border-2 border-purple-200 focus:border-purple-600 focus:ring-0 transition-all font-mono"
                                    placeholder="Enter OTP"
                                    maxLength={6}
                                    autoFocus
                                />
                                <div className="flex justify-between items-center text-xs mt-2">
                                    <p className="text-gray-500">
                                        OTP sent to {registeredEmail}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={isLoading}
                                        className="text-purple-600 font-bold hover:underline disabled:opacity-50"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Continue'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm font-medium">
                                    ✕ {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm font-medium">
                                    ✓ {successMessage}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaPhone />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaLock />
                                    </div>
                                    <input
                                        type="text"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {isLoading ? 'Registering...' : 'Register Now'}
                            </button>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => { onClose(); if (onLoginClick) onLoginClick(); }}
                                    className="text-purple-600 font-bold hover:underline"
                                >
                                    Login here
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default StudentRegister;
