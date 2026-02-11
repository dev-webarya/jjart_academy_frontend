import { useState, useEffect } from 'react';
import { FaVideo, FaClock, FaCalendar, FaBook, FaExternalLinkAlt, FaSearch, FaFilter, FaSpinner } from 'react-icons/fa';
import lmsService from '../../services/lmsService';
import { useAuth } from '../../context/AuthContext';

const OnlineClasses = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, today, all
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSessions();
  }, [filter]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      let response;
      if (filter === 'upcoming') {
        response = await lmsService.getUpcomingSessions();
      } else if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        response = await lmsService.getSessionsByDate(today);
      } else {
        // Fallback to upcoming if 'all' is selected but user has no access to getAllSessions
        // Or if getAllSessions returns 403, we should probably handle it.
        // For now, let's keep it but catch the error gracefully, or just use upcoming as default.
        response = await lmsService.getUpcomingSessions(); // Defaulting to upcoming for students for now
      }

      if (response.success) {
        // Handle both pagination response and array response
        const data = response.data?.content || response.data || [];
        setSessions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeData) => {
    if (!timeData) return '';

    // Handle array format [H, M, S, n]
    if (Array.isArray(timeData)) {
      const [hours, minutes] = timeData;
      return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    // Handle string format "HH:MM:SS"
    if (typeof timeData === 'string') {
      const [hours, minutes] = timeData.split(':');
      return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    // Handle object format {hour: 10, minute: 30, ...}
    if (typeof timeData === 'object' && timeData.hour !== undefined) {
      return new Date(0, 0, 0, timeData.hour, timeData.minute).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    return '';
  };

  const filteredSessions = sessions.filter(session =>
    session.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Online Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Join your scheduled online art sessions</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="pl-4 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white appearance-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="upcoming">Upcoming Sessions</option>
              <option value="today">Today's Sessions</option>
              {/* <option value="past">Past History</option> */}
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex items-center justify-center">
                <FaVideo className="text-5xl text-white/90" />
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg line-clamp-1" title={session.topic}>
                      {session.topic || 'Untitled Session'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <FaCalendar className="text-gray-400 text-xs" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(session.sessionDate)}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaClock className="text-indigo-500" />
                    <span>
                      {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </span>
                  </div>

                  {session.description && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaBook className="text-indigo-500 mt-1" />
                      <span className="line-clamp-2" title={session.description}>{session.description}</span>
                    </div>
                  )}
                </div>

                {/* Topic Tag */}
                {session.topic && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-1 rounded">
                      {session.topic}
                    </span>
                  </div>
                )}

                {session.status === 'IN_PROGRESS' || session.status === 'SCHEDULED' ? (
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2
                      ${!session.meetingLink
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                    onClick={(e) => !session.meetingLink && e.preventDefault()}
                  >
                    <FaExternalLinkAlt />
                    {session.status === 'IN_PROGRESS' ? 'Join Now' : 'Join Class'}
                  </a>
                ) : (
                  <div className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-center text-sm font-medium">
                    Class {session.status.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaVideo className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No sessions found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineClasses;
