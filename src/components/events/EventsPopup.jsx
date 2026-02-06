import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSpinner, FaArrowRight } from 'react-icons/fa';
import lmsService from '../../services/lmsService';

/**
 * EventsPopup - Modal popup showing upcoming events with floating button
 */
const EventsPopup = ({
    autoShow = true,
    delay = 2000,
    maxEvents = 3,
    storageKey = 'eventsPopupDismissed',
    dismissHours = 24
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await lmsService.getPublicEvents(0, 20);
                if (response.success) {
                    let data = response.data?.content || response.data || [];
                    const now = new Date();

                    // Filter: only upcoming (startDateTime > now) or ongoing (startDateTime <= now && endDateTime > now)
                    data = Array.isArray(data) ? data.filter(event => {
                        const start = new Date(event.startDateTime);
                        const end = new Date(event.endDateTime);
                        return end > now; // Show if event hasn't ended yet
                    }).sort((a, b) => {
                        // Sort by start date ascending (soonest first)
                        return new Date(a.startDateTime) - new Date(b.startDateTime);
                    }).slice(0, maxEvents) : [];

                    setEvents(data);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();

        // Always show popup on page load/refresh
        if (autoShow) {
            const timer = setTimeout(() => setIsVisible(true), delay);
            return () => clearTimeout(timer);
        }
    }, [autoShow, delay, maxEvents]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    const handleOpenPopup = () => {
        setIsVisible(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <>
            {/* Floating Events Button - Always visible when popup is closed */}
            {!isVisible && showButton && (
                <button
                    onClick={handleOpenPopup}
                    className="fixed bottom-44 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    style={{ animation: 'pulse 2s infinite' }}
                >
                    <FaCalendarAlt className="text-lg" />
                    <span className="font-semibold">Events</span>
                    {events.length > 0 && (
                        <span className="bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                            {events.length}
                        </span>
                    )}
                </button>
            )}

            {/* Popup Modal */}
            {isVisible && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        style={{ animation: 'popupSlide 0.3s ease-out' }}
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-6 pb-8">
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:rotate-90"
                            >
                                <FaTimes size={18} />
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                                    <FaCalendarAlt className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                                    <p className="text-white/80 text-sm">Don't miss out! 🎨</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 max-h-80 overflow-y-auto -mt-4">
                            {loading ? (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                    <FaSpinner className="animate-spin text-3xl text-purple-500 mx-auto mb-3" />
                                    <p className="text-gray-500">Loading events...</p>
                                </div>
                            ) : events.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaCalendarAlt className="text-3xl text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 font-semibold">No upcoming events</p>
                                    <p className="text-gray-400 text-sm mt-1">Check back soon for new events!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {events.map((event, index) => (
                                        <div
                                            key={event.id || index}
                                            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex flex-col items-center justify-center text-white shrink-0">
                                                    <span className="text-xs font-medium uppercase">
                                                        {new Date(event.startDateTime || Date.now()).toLocaleDateString('en-US', { month: 'short' })}
                                                    </span>
                                                    <span className="text-xl font-bold leading-none">
                                                        {new Date(event.startDateTime || Date.now()).getDate()}
                                                    </span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-800 dark:text-white text-sm line-clamp-2 mb-1">
                                                        {event.title || 'Untitled Event'}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <FaClock className="text-pink-500" />
                                                            {formatTime(event.startDateTime) || 'All day'}
                                                        </span>
                                                        {event.location && (
                                                            <span className="flex items-center gap-1">
                                                                <FaMapMarkerAlt className="text-green-500" />
                                                                <span className="truncate max-w-[120px]">{event.location}</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    {event.eventType && (
                                                        <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                                                            {event.eventType}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-5 pt-2 flex gap-3">
                            <button
                                onClick={handleDismiss}
                                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-semibold"
                            >
                                Close
                            </button>
                            <Link
                                to="/events"
                                onClick={handleDismiss}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all font-semibold"
                            >
                                View All <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes popupSlide {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(168, 85, 247, 0); }
        }
      `}</style>
        </>
    );
};

export default EventsPopup;
