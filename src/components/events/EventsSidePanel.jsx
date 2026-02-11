import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt,
    FaChevronRight, FaChevronLeft, FaSpinner
} from 'react-icons/fa';
import lmsService from '../../services/lmsService';

/**
 * EventsSidePanel - Collapsible side panel showing upcoming events
 */
const EventsSidePanel = ({
    defaultOpen = true,
    maxEvents = 5,
    position = 'right'
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await lmsService.getUpcomingEvents(0, maxEvents);
                if (response.success) {
                    let data = response.data?.content || response.data || [];
                    data = Array.isArray(data) ? data.sort((a, b) => {
                        const dateA = new Date(a.eventDate || a.startDate || 0);
                        const dateB = new Date(b.eventDate || b.startDate || 0);
                        return dateB - dateA;
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
    }, [maxEvents]);

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const isRight = position === 'right';

    return (
        <>
            {/* Toggle Tab - Fixed to side */}
            <div
                className={`fixed z-50 transition-all duration-300 ${isRight ? 'right-0' : 'left-0'
                    }`}
                style={{ top: '120px' }}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-3 py-4 bg-gradient-to-b from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all ${isRight ? 'rounded-l-xl' : 'rounded-r-xl'
                        }`}
                    style={{
                        transform: isOpen ? (isRight ? 'translateX(-320px)' : 'translateX(320px)') : 'translateX(0)',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed'
                    }}
                >
                    <FaCalendarAlt className="text-lg" />
                    <span className="font-semibold text-sm rotate-180">Events</span>
                    {events.length > 0 && !isOpen && (
                        <span className="bg-white text-purple-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {events.length}
                        </span>
                    )}
                    {isOpen ? (
                        isRight ? <FaChevronRight className="text-sm" /> : <FaChevronLeft className="text-sm" />
                    ) : (
                        isRight ? <FaChevronLeft className="text-sm" /> : <FaChevronRight className="text-sm" />
                    )}
                </button>
            </div>

            {/* Side Panel */}
            <div
                className={`fixed z-40 bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 ease-in-out overflow-hidden ${isRight ? 'right-0 border-l' : 'left-0 border-r'
                    } border-gray-200 dark:border-gray-700`}
                style={{
                    top: '80px',
                    height: 'calc(100vh - 80px)',
                    width: '320px',
                    transform: isOpen ? 'translateX(0)' : (isRight ? 'translateX(100%)' : 'translateX(-100%)')
                }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-white text-lg" />
                        <h2 className="text-lg font-bold text-white">Upcoming Events</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* Events List */}
                <div className="h-[calc(100%-130px)] overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="text-center py-12">
                            <FaSpinner className="animate-spin text-3xl text-purple-500 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCalendarAlt className="text-3xl text-gray-400 dark:text-gray-500" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">No upcoming events</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back soon!</p>
                        </div>
                    ) : (
                        events.map((event, index) => (
                            <div
                                key={event.id || index}
                                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer border border-gray-100 dark:border-gray-600"
                            >
                                {event.imageUrl && (
                                    <div className="w-full h-28 rounded-lg overflow-hidden mb-3">
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                )}

                                <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-2 line-clamp-2">
                                    {event.title || 'Untitled Event'}
                                </h3>

                                <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    <span className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">
                                        <FaCalendarAlt />
                                        {formatDate(event.eventDate || event.startDate)}
                                    </span>
                                    {(event.eventDate || event.startDate) && (
                                        <span className="flex items-center gap-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-2 py-1 rounded-full">
                                            <FaClock />
                                            {formatTime(event.eventDate || event.startDate)}
                                        </span>
                                    )}
                                </div>

                                {event.location && (
                                    <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <FaMapMarkerAlt className="text-green-500 shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </p>
                                )}

                                {event.eventType && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                                        {event.eventType}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        to="/exhibitions"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm"
                    >
                        View All Events →
                    </Link>
                </div>
            </div>
        </>
    );
};

export default EventsSidePanel;
