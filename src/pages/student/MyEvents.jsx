import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaTimes, FaMapMarkerAlt, FaUser, FaSearch, FaFilter, FaSpinner, FaVideo, FaRupeeSign, FaUsers } from 'react-icons/fa';
import lmsService from '../../services/lmsService';

const MyEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch public/upcoming events from backend
      const response = await lmsService.getUpcomingEvents(0, 100);
      if (response.success) {
        const data = response.data?.content || response.data || [];
        setEvents(Array.isArray(data) ? data : []);
      } else {
        // Try public events as fallback
        const publicResponse = await lmsService.getPublicEvents(0, 100);
        if (publicResponse.success) {
          const data = publicResponse.data?.content || publicResponse.data || [];
          setEvents(Array.isArray(data) ? data : []);
        } else {
          setError('Failed to load events');
        }
      }
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeStyles = (eventType) => {
    switch (eventType?.toUpperCase()) {
      case 'WORKSHOP':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      case 'EXHIBITION':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'COMPETITION':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'SEMINAR':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'MEETUP':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateString) => {
    if (!dateString) return true;
    return new Date(dateString) > new Date();
  };

  const getFilteredEvents = () => {
    return events.filter(event => {
      const matchesSearch =
        (event.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      if (filter === 'all') return matchesSearch;
      if (filter === 'upcoming') return matchesSearch && isUpcoming(event.startDateTime);
      if (filter === 'online') return matchesSearch && event.isOnline;
      return matchesSearch && event.eventType?.toUpperCase() === filter.toUpperCase();
    });
  };

  const filteredEvents = getFilteredEvents();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Stats
  const upcomingCount = events.filter(e => isUpcoming(e.startDateTime)).length;
  const onlineCount = events.filter(e => e.isOnline).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Events & Workshops</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Discover upcoming events and workshops</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl">
          {error}
          <button onClick={loadEvents} className="ml-4 underline font-semibold">Retry</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Total Events</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white">{events.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-indigo-600 dark:text-indigo-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Upcoming</p>
              <p className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{upcomingCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FaClock className="text-green-600 dark:text-green-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Online</p>
              <p className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{onlineCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FaVideo className="text-blue-600 dark:text-blue-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Displaying</p>
              <p className="text-xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{filteredEvents.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FaFilter className="text-purple-600 dark:text-purple-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Only</option>
              <option value="online">Online Events</option>
              <option value="WORKSHOP">Workshops</option>
              <option value="EXHIBITION">Exhibitions</option>
              <option value="COMPETITION">Competitions</option>
              <option value="SEMINAR">Seminars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {currentEvents.map(event => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Event Image */}
              <div className="relative h-48 lg:h-auto bg-gradient-to-br from-indigo-500 to-purple-600">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaCalendarAlt className="text-white/50 text-6xl" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEventTypeStyles(event.eventType)}`}>
                    {event.eventType || 'Event'}
                  </span>
                </div>
                {event.isOnline && (
                  <div className="absolute top-2 left-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white flex items-center gap-1">
                      <FaVideo size={10} /> Online
                    </span>
                  </div>
                )}
              </div>

              {/* Event Content */}
              <div className="lg:col-span-3 p-4 sm:p-6">
                {/* Title */}
                <div className="mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-1">
                    {event.title || 'Untitled Event'}
                  </h3>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Date & Time</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {formatDate(event.startDateTime)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-red-600 dark:text-red-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {event.isOnline ? 'Online' : (event.location || 'TBA')}
                      </p>
                    </div>
                  </div>

                  {event.maxParticipants && (
                    <div className="flex items-center gap-2 text-sm">
                      <FaUsers className="text-purple-600 dark:text-purple-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Slots</p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {event.availableSlots || 0} / {event.maxParticipants} available
                        </p>
                      </div>
                    </div>
                  )}

                  {event.createdBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <FaUser className="text-green-600 dark:text-green-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Organized By</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{event.createdBy}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price and Status */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    {event.fee && event.fee > 0 ? (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Fee</p>
                        <p className="text-xl font-bold text-purple-600 flex items-center">
                          <FaRupeeSign size={14} />{event.fee}
                        </p>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
                        Free Entry
                      </span>
                    )}

                    {!isUpcoming(event.startDateTime) && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm font-bold">
                        Ended
                      </span>
                    )}
                  </div>

                  {isUpcoming(event.startDateTime) && event.isRegistrationOpen && (
                    <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold">
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {currentEvents.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700 shadow-lg">
          <FaCalendarAlt className="text-5xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
            {searchTerm || filter !== 'all' ? 'No Events Found' : 'No Events Available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Check back later for upcoming events and workshops!'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEvents.length)} of {filteredEvents.length} events
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Previous
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
