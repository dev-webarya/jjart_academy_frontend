import { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaClock, FaCalendar, FaUser, FaSearch, FaEye, FaSpinner, FaIdBadge, FaCheckCircle, FaHourglass, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import enrollmentService from '../../services/enrollmentService';

const RegularClasses = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, PENDING, APPROVED, REJECTED
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await enrollmentService.getMyEnrollments();
      if (response.success) {
        const data = response.data?.content || response.data || [];
        setEnrollments(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to load enrollments');
      }
    } catch (err) {
      console.error('Error loading enrollments:', err);
      setError('Failed to load your enrolled classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEnrollments = () => {
    let filtered = [...enrollments];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(e =>
        (e.className?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (e.classDescription?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(e => e.status === filter);
    }

    return filtered;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: FaCheckCircle,
          color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          label: 'Approved'
        };
      case 'PENDING':
        return {
          icon: FaHourglass,
          color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: 'Pending'
        };
      case 'REJECTED':
        return {
          icon: FaTimesCircle,
          color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          label: 'Rejected'
        };
      default:
        return {
          icon: FaHourglass,
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
          label: status || 'Unknown'
        };
    }
  };

  const handleViewDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredEnrollments = getFilteredEnrollments();
  const approvedCount = enrollments.filter(e => e.status === 'APPROVED').length;
  const pendingCount = enrollments.filter(e => e.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your enrolled classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <FaChalkboardTeacher className="text-4xl" />
          <div>
            <h1 className="text-3xl font-bold">My Enrolled Classes</h1>
            <p className="text-blue-100 mt-1">View and manage your class enrollments</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Total Enrollments</p>
            <p className="text-3xl font-bold">{enrollments.length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Approved</p>
            <p className="text-3xl font-bold text-green-300">{approvedCount}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-300">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl">
          {error}
          <button onClick={loadEnrollments} className="ml-4 underline font-semibold">Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by class name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'APPROVED', 'PENDING', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Cards Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
          <FaChalkboardTeacher className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {searchTerm || filter !== 'all' ? 'No Matching Classes Found' : 'No Enrolled Classes Yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Enroll in a class to get started on your art journey!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => {
            const statusBadge = getStatusBadge(enrollment.status);
            const StatusIcon = statusBadge.icon;

            return (
              <div
                key={enrollment.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white truncate">
                        {enrollment.className || 'Art Class'}
                      </h3>
                      {enrollment.rollNo && (
                        <div className="flex items-center gap-1 mt-1">
                          <FaIdBadge className="text-indigo-200" size={12} />
                          <span className="text-indigo-100 text-xs font-medium">
                            {enrollment.rollNo}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusBadge.color}`}>
                      <StatusIcon size={10} />
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Description */}
                  {enrollment.classDescription && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {enrollment.classDescription}
                    </p>
                  )}

                  {/* Info Grid */}
                  <div className="space-y-2">
                    {enrollment.schedule && (
                      <div className="flex items-center gap-2 text-sm">
                        <FaClock className="text-blue-500 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{enrollment.schedule}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <FaCalendar className="text-green-500 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Enrolled: {formatDate(enrollment.createdAt)}
                      </span>
                    </div>

                    {enrollment.studentName && (
                      <div className="flex items-center gap-2 text-sm">
                        <FaUser className="text-purple-500 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{enrollment.studentName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleViewDetails(enrollment)}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedEnrollment.className || 'Class Details'}
                  </h2>
                  {selectedEnrollment.rollNo && (
                    <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                      <FaIdBadge /> Roll No: {selectedEnrollment.rollNo}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                {(() => {
                  const badge = getStatusBadge(selectedEnrollment.status);
                  const Icon = badge.icon;
                  return (
                    <span className={`px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 ${badge.color}`}>
                      <Icon />
                      {badge.label}
                    </span>
                  );
                })()}
              </div>

              {/* Description */}
              {selectedEnrollment.classDescription && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedEnrollment.classDescription}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Student Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedEnrollment.studentName || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Email</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedEnrollment.studentEmail || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedEnrollment.studentPhone || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Schedule</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedEnrollment.schedule || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Enrolled On</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatDate(selectedEnrollment.createdAt)}</p>
                </div>
                {selectedEnrollment.parentGuardianName && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Parent/Guardian</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedEnrollment.parentGuardianName}</p>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              {selectedEnrollment.additionalMessage && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Additional Message</h3>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    {selectedEnrollment.additionalMessage}
                  </p>
                </div>
              )}

              {/* Admin Notes (if any) */}
              {selectedEnrollment.adminNotes && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Admin Notes</h3>
                  <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    {selectedEnrollment.adminNotes}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegularClasses;
