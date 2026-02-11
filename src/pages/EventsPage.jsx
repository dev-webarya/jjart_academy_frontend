import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSpinner, FaFilter } from 'react-icons/fa';
import lmsService from '../services/lmsService';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'ongoing', 'past'

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await lmsService.getPublicEvents(0, 50);
                console.log('📅 Events API Response:', response);
                if (response.success) {
                    let data = response.data?.content || response.data || [];
                    console.log('📅 Events data:', data);
                    // Sort by startDateTime - soonest first
                    data = Array.isArray(data) ? data.sort((a, b) => {
                        return new Date(a.startDateTime) - new Date(b.startDateTime);
                    }) : [];
                    setEvents(data);
                } else {
                    console.error('📅 Events fetch failed:', response);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getEventStatus = (event) => {
        const now = new Date();
        const start = new Date(event.startDateTime);
        const end = new Date(event.endDateTime);

        if (end < now) return 'past';
        if (start <= now && end >= now) return 'ongoing';
        return 'upcoming';
    };

    const filteredEvents = events.filter(event => {
        const status = getEventStatus(event);
        if (filter === 'all') return true;
        if (filter === 'upcoming') return status === 'upcoming' || status === 'ongoing';
        if (filter === 'ongoing') return status === 'ongoing';
        if (filter === 'past') return status === 'past';
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FaCalendarAlt className="text-white text-4xl" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Events & Workshops
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Discover upcoming art events, workshops, and exhibitions. Join our creative community!
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Filter:</span>
                        <div className="flex gap-2">
                            {['all', 'upcoming', 'ongoing', 'past'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                {loading ? (
                    <div className="text-center py-20">
                        <FaSpinner className="animate-spin text-4xl text-purple-500 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCalendarAlt className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                            No events found
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {filter === 'upcoming' ? 'No upcoming events at the moment.' : 'No events to display.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event, index) => {
                            const status = getEventStatus(event);
                            const isActive = status !== 'past';
                            return (
                                <div
                                    key={event.id || index}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 ${!isActive ? 'opacity-75' : ''
                                        }`}
                                >
                                    {/* Event Image */}
                                    {event.imageUrl ? (
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <FaCalendarAlt className="text-4xl text-white/50" />
                                        </div>
                                    )}

                                    {/* Event Content */}
                                    <div className="p-6">
                                        {/* Date Badge */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 ${status === 'ongoing'
                                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                                                : isActive
                                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                }`}>
                                                <span className="text-xs font-medium uppercase">
                                                    {new Date(event.startDateTime || Date.now()).toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className="text-2xl font-bold leading-none">
                                                    {new Date(event.startDateTime || Date.now()).getDate()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 dark:text-white text-lg line-clamp-2">
                                                    {event.title || 'Untitled Event'}
                                                </h3>
                                                {status === 'ongoing' && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs rounded-full font-medium">
                                                        🔴 Live Now
                                                    </span>
                                                )}
                                                {status === 'past' && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 text-xs rounded-full">
                                                        Past Event
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Event Details */}
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            <p className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-purple-500 shrink-0" />
                                                {formatDate(event.startDateTime)}
                                            </p>
                                            {event.startDateTime && (
                                                <p className="flex items-center gap-2">
                                                    <FaClock className="text-pink-500 shrink-0" />
                                                    {formatTime(event.startDateTime)}
                                                </p>
                                            )}
                                            {event.location && (
                                                <p className="flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-green-500 shrink-0" />
                                                    <span className="truncate">{event.location}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {event.description && (
                                            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
                                                {event.description}
                                            </p>
                                        )}

                                        {/* Event Type Badge */}
                                        <div className="flex items-center gap-2 mt-4">
                                            {event.eventType && (
                                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-sm rounded-full font-medium">
                                                    {event.eventType}
                                                </span>
                                            )}
                                            {event.fee > 0 && (
                                                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-sm rounded-full font-medium">
                                                    ₹{event.fee}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
