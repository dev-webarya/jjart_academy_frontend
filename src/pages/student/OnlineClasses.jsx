import { useState, useEffect } from 'react';
import { FaVideo, FaClock, FaCalendar, FaUser, FaBook, FaExternalLinkAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { onlineClassesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OnlineClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      // Fetch all online classes created by admin
      const response = await onlineClassesAPI.getAll();
      if (response.success) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Error loading online classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredClasses = () => {
    const today = new Date().toISOString().split('T')[0];
    let filtered = classes;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.className.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (filter === 'upcoming') {
      filtered = filtered.filter(c => c.date >= today);
    } else if (filter === 'past') {
      filtered = filtered.filter(c => c.date < today);
    }

    // Sort by date
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isUpcoming = (dateString) => {
    return dateString >= new Date().toISOString().split('T')[0];
  };

  const handleJoinClass = (classItem) => {
    window.open(classItem.meetingLink, '_blank');
  };

  const filteredClasses = getFilteredClasses();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading online classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
         
          <div>
            <h1 className="text-3xl font-bold">Online Classes</h1>
            <p className="text-blue-100 mt-1">Join live sessions and learn from anywhere</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Total Classes</p>
            <p className="text-2xl font-bold">{classes.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Upcoming</p>
            <p className="text-2xl font-bold">
              {classes.filter(c => isUpcoming(c.date)).length}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Completed</p>
            <p className="text-2xl font-bold">
              {classes.filter(c => !isUpcoming(c.date)).length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Past
            </button>
          </div>
        </div>
      </div>

      {/* Classes List */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
          <FaVideo className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No classes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search criteria' : 'No online classes scheduled yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className={`p-4 ${isUpcoming(classItem.date) ? 'bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isUpcoming(classItem.date)
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                    }`}>
                      {isUpcoming(classItem.date) ? 'Upcoming' : 'Completed'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {classItem.platform}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {classItem.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {classItem.description}
                </p>
              </div>
              {/* Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaBook className="mr-3 text-blue-500" />
                  <span className="font-medium">{classItem.className}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaUser className="mr-3 text-purple-500" />
                  <span>{classItem.instructor}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaCalendar className="mr-3 text-green-500" />
                  <span>{formatDate(classItem.date)}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaClock className="mr-3 text-orange-500" />
                  <span>{classItem.time} ({classItem.duration})</span>
                </div>

                {/* Materials */}
                {classItem.materials && classItem.materials.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Required Materials:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {classItem.materials.map((material, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {isUpcoming(classItem.date) ? (
                    <button
                      onClick={() => handleJoinClass(classItem)}
                      className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <FaExternalLinkAlt />
                      <span>Join Class</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-2 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Class Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineClasses;
