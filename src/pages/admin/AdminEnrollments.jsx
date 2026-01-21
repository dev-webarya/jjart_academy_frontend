import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaTrash, FaFilter, FaDownload, FaSearch, FaPlus } from 'react-icons/fa';
import EnrollmentForm from '../../components/EnrollmentForm';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadEnrollments();
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [enrollments, filterStatus, searchTerm]);

  const loadEnrollments = () => {
    const existingData = localStorage.getItem('enrollments');
    
    if (existingData) {
      const data = JSON.parse(existingData);
      setEnrollments(data);
    } else {
      setEnrollments([]);
    }
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    setFilteredEnrollments(filtered);
  };

  const updateEnrollmentStatus = (id, status) => {
    const updated = enrollments.map(e => 
      e.id === id ? { ...e, status } : e
    );
    setEnrollments(updated);
    localStorage.setItem('enrollments', JSON.stringify(updated));
    
    // If approved, add to students
    if (status === 'approved') {
      const enrollment = enrollments.find(e => e.id === id);
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const newStudent = {
        id: Date.now(),
        name: enrollment.studentName,
        email: enrollment.email,
        phone: enrollment.phone,
        age: enrollment.age,
        parentName: enrollment.parentName,
        enrolledClass: enrollment.selectedClass,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        address: '',
        emergencyContact: enrollment.phone
      };
      students.push(newStudent);
      localStorage.setItem('students', JSON.stringify(students));
    }
  };

  const deleteEnrollment = (id) => {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      const updated = enrollments.filter(e => e.id !== id);
      setEnrollments(updated);
      localStorage.setItem('enrollments', JSON.stringify(updated));
      setSelectedEnrollment(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const stats = {
    total: enrollments.length,
    pending: enrollments.filter(e => e.status === 'pending').length,
    approved: enrollments.filter(e => e.status === 'approved').length,
    rejected: enrollments.filter(e => e.status === 'rejected').length
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnrollments = filteredEnrollments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Enrollments Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage student enrollment applications
          </p>
        </div>
        <button
          onClick={() => setShowEnrollmentForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-xl hover:shadow-lg transition-all font-semibold"
        >
          <FaPlus />
          <span>Add New Enrollment</span>
        </button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Total Enrollments</h3>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-linear-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl shadow-lg p-6">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Pending Review</h3>
          <p className="text-4xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-linear-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg p-6">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Approved</h3>
          <p className="text-4xl font-bold">{stats.approved}</p>
        </div>
        <div className="bg-linear-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-lg p-6">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Rejected</h3>
          <p className="text-4xl font-bold">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-600 dark:text-gray-400" />
            <div className="flex space-x-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-white dark:bg-white text-black dark:text-black hover:bg-gray-100 dark:hover:bg-gray-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-200">
                      {status === 'pending' ? stats.pending : status === 'approved' ? stats.approved : stats.rejected}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
        {filteredEnrollments.length > 0 ? (
          <>
            <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Parent Name
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {enrollment.studentName}
                    </div>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {enrollment.age}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {enrollment.parentName}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {enrollment.email}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {enrollment.phone}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {enrollment.selectedClass}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                      enrollment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : enrollment.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {enrollment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateEnrollmentStatus(enrollment.id, 'approved')}
                            className="p-1.5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-all text-sm"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => updateEnrollmentStatus(enrollment.id, 'rejected')}
                            className="p-1.5 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-all text-sm"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedEnrollment(enrollment)}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all text-sm"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => deleteEnrollment(enrollment.id)}
                        className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 pb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEnrollments.length)} of {filteredEnrollments.length} enrollments
            </div>
            <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === index + 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-xl">
              No enrollments found
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedEnrollment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Enrollment Details</h2>
                <p className="text-purple-100 text-sm mt-1">Complete application information</p>
              </div>
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Student Name</label>
                  <p className="text-lg text-gray-800 dark:text-white font-medium">{selectedEnrollment.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Age</label>
                  <p className="text-lg text-gray-800 dark:text-white font-medium">{selectedEnrollment.age} years</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Parent/Guardian</label>
                  <p className="text-lg text-gray-800 dark:text-white font-medium">{selectedEnrollment.parentName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedEnrollment.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Phone</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedEnrollment.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedEnrollment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : selectedEnrollment.status === 'approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {selectedEnrollment.status}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Selected Class</label>
                  <p className="text-lg text-purple-600 dark:text-purple-400 font-bold">{selectedEnrollment.selectedClass}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Preferred Schedule</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedEnrollment.preferredSchedule}</p>
                </div>

                {selectedEnrollment.message && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Message</label>
                    <p className="text-gray-800 dark:text-white">{selectedEnrollment.message}</p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Enrollment Date</label>
                  <p className="text-gray-800 dark:text-white">{formatDate(selectedEnrollment.enrollmentDate)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedEnrollment.status === 'pending' && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={() => {
                      updateEnrollmentStatus(selectedEnrollment.id, 'approved');
                      setSelectedEnrollment(null);
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold shadow-lg"
                  >
                    <FaCheck />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => {
                      updateEnrollmentStatus(selectedEnrollment.id, 'rejected');
                      setSelectedEnrollment(null);
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold shadow-lg"
                  >
                    <FaTimes />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Form Modal */}
      <EnrollmentForm 
        isOpen={showEnrollmentForm} 
        onClose={() => setShowEnrollmentForm(false)}
        onSuccess={() => {
          loadEnrollments();
          setShowEnrollmentForm(false);
        }}
      />
    </div>
  );
};

export default AdminEnrollments;
