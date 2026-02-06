import { useState, useEffect } from 'react';
import {
    FaCreditCard, FaHistory, FaCheckCircle, FaExclamationCircle,
    FaCalendarAlt, FaHourglassHalf, FaSpinner, FaCloudDownloadAlt
} from 'react-icons/fa';
import lmsService from '../../services/lmsService';

const MySubscriptions = () => {
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [subscriptionHistory, setSubscriptionHistory] = useState([]); // Array of subscriptions
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSubscriptionData();
    }, []);

    const loadSubscriptionData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch subscription history first to use for fallback if needed
            let historyData = [];
            const historyRes = await lmsService.getMySubscriptions();

            if (historyRes.success) {
                // If history returns an object with content (pagination), use that
                historyData = Array.isArray(historyRes.data) ? historyRes.data : (historyRes.data?.content || []);
                // Sort by year/month descending if possible, or use API order
                setSubscriptionHistory(historyData);
            } else {
                console.error("Failed to load subscription history:", historyRes.message);
            }

            // Fetch active subscription
            let activeSub = null;
            const activeRes = await lmsService.getMyActiveSubscription();

            if (activeRes.success && activeRes.data) {
                activeSub = activeRes.data;
            } else if (historyData.length > 0) {
                // Fallback: Check history for an active subscription for the current month
                const now = new Date();
                const currentMonth = now.getMonth() + 1;
                const currentYear = now.getFullYear();

                activeSub = historyData.find(sub =>
                    sub.subscriptionMonth === currentMonth &&
                    sub.subscriptionYear === currentYear &&
                    (sub.status === 'ACTIVE' || sub.status === 'Running')
                );

                if (activeSub) {
                    console.log('⚠️ Active subscription found in history (fallback):', activeSub);
                }
            }

            setActiveSubscription(activeSub);

        } catch (err) {
            console.error("Error loading subscription data:", err);
            setError("Failed to load subscription details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'EXPIRED': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'PAUSED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getMonthName = (monthNum) => {
        if (!monthNum) return '';
        const date = new Date();
        date.setMonth(monthNum - 1);
        return date.toLocaleString('default', { month: 'long' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <FaSpinner className="text-4xl text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading subscription details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                <div className="text-center text-red-600 dark:text-red-400">
                    <FaExclamationCircle className="text-4xl mx-auto mb-3" />
                    <p>{error}</p>
                    <button
                        onClick={loadSubscriptionData}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Subscriptions</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your monthly class subscriptions and view history.</p>
            </div>

            {/* Active Subscription Section */}
            {activeSubscription ? (
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-48 h-48 bg-black/10 rounded-full blur-2xl" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-100 mb-1">
                                <FaCheckCircle className="text-green-400" />
                                <span className="font-medium tracking-wide uppercase text-sm">Active Subscription</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">
                                {getMonthName(activeSubscription.subscriptionMonth)} {activeSubscription.subscriptionYear}
                            </h2>
                            <p className="text-indigo-100/90 text-lg flex items-center gap-2">
                                <FaCalendarAlt />
                                {formatDate(activeSubscription.startDate)} - {formatDate(activeSubscription.endDate)}
                            </p>
                        </div>

                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-w-[200px] border border-white/30">
                            <div className="text-sm text-indigo-50 mb-2 font-medium">Session Usage</div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-bold">{activeSubscription.attendedSessions}</span>
                                <span className="text-lg text-indigo-200 mb-1">/ {activeSubscription.allowedSessions}</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${activeSubscription.isOverLimit ? 'bg-red-400' : 'bg-green-400'
                                        }`}
                                    style={{
                                        width: `${Math.min((activeSubscription.attendedSessions / activeSubscription.allowedSessions) * 100, 100)}%`
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs mt-2 text-indigo-100 font-medium">
                                <span>{activeSubscription.remainingSessions} remaining</span>
                                {activeSubscription.isOverLimit && <span className="text-red-300">Over Limit!</span>}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
                    <div className="bg-gray-200 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaHourglassHalf className="text-3xl text-gray-400 dark:text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Active Subscription</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        You don't have an active subscription for the current month. Please contact your administrator to renew or enroll.
                    </p>
                </div>
            )}

            {/* Subscription History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <FaHistory className="text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Subscription History</h3>
                    </div>
                </div>

                {subscriptionHistory.length === 0 ? (
                    <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                        No subscription history found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Month/Year</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Usage</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {subscriptionHistory.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-800 dark:text-white">
                                                {getMonthName(sub.subscriptionMonth)} {sub.subscriptionYear}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                                            {formatDate(sub.startDate)} - {formatDate(sub.endDate)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="font-medium text-gray-700 dark:text-gray-200">
                                                    {sub.attendedSessions} / {sub.allowedSessions}
                                                </span>
                                                {sub.isOverLimit && (
                                                    <span className="text-xs text-red-500 font-semibold mt-0.5">Exceeded Limit</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 italic max-w-xs truncate">
                                            {sub.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MySubscriptions;
