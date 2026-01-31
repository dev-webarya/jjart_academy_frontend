import { useState, useEffect } from 'react';
import {
  FaEdit, FaTrash, FaSearch,
  FaUserGraduate, FaPhone, FaEnvelope, FaCalendar,
  FaEye, FaTimes, FaWhatsapp, FaComments, FaSync,
  FaSpinner, FaMapMarkerAlt, FaChalkboardTeacher
} from 'react-icons/fa';
import { BASE_URL, API_ENDPOINTS } from '../../data/apiEndpoints';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageStudent, setMessageStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',
    studentPhone: '',
    studentAge: '',
    parentGuardianName: '',
    address: '',
    schedule: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    additionalMessage: '',
    status: 'APPROVED',
    adminNotes: ''
  });

  useEffect(() => {
    loadStudents();
    loadMessages();
    loadClasses();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterClass, filterStatus]);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ENROLLMENTS.GET_ALL}?page=0&size=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Map API response to component's expected format based on enrollment data
      const mappedStudents = data.content.map((enrollment) => ({
        id: enrollment.id,
        rollNo: enrollment.rollNo || 'N/A',
        userId: enrollment.userId,
        studentName: enrollment.studentName,
        studentEmail: enrollment.studentEmail,
        studentPhone: enrollment.studentPhone || 'N/A',
        address: enrollment.address || 'N/A',
        classId: enrollment.classId,
        className: enrollment.className,
        classDescription: enrollment.classDescription,
        parentGuardianName: enrollment.parentGuardianName || 'N/A',
        studentAge: enrollment.studentAge || 'N/A',
        schedule: enrollment.schedule || 'N/A',
        additionalMessage: enrollment.additionalMessage || '',
        emergencyContactName: enrollment.emergencyContactName || 'N/A',
        emergencyContactPhone: enrollment.emergencyContactPhone || 'N/A',
        status: enrollment.status,
        adminNotes: enrollment.adminNotes || '',
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt
      }));

      setStudents(mappedStudents);
      setTotalElements(data.totalElements || mappedStudents.length);
    } catch (err) {
      console.error('Error fetching enrolled students:', err);
      setError(err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ART_CLASSES.GET_ALL}?page=0&size=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableClasses(data.content || []);
      }
    } catch (err) {
      console.error('Error loading classes:', err);
    }
  };

  const loadMessages = () => {
    const existingMessages = localStorage.getItem('studentMessages');

    if (!existingMessages || JSON.parse(existingMessages).length === 0) {
      const dummyMessages = [];
      localStorage.setItem('studentMessages', JSON.stringify(dummyMessages));
      setMessages(dummyMessages);
    } else {
      setMessages(JSON.parse(existingMessages));
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentPhone.includes(searchTerm) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.className && s.className.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterClass !== 'all') {
      filtered = filtered.filter(s => s.className === filterClass);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    setFilteredStudents(filtered);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      studentName: student.studentName || '',
      studentPhone: student.studentPhone || '',
      studentAge: student.studentAge !== 'N/A' ? student.studentAge : '',
      parentGuardianName: student.parentGuardianName !== 'N/A' ? student.parentGuardianName : '',
      address: student.address !== 'N/A' ? student.address : '',
      schedule: student.schedule !== 'N/A' ? student.schedule : '',
      emergencyContactName: student.emergencyContactName !== 'N/A' ? student.emergencyContactName : '',
      emergencyContactPhone: student.emergencyContactPhone !== 'N/A' ? student.emergencyContactPhone : '',
      additionalMessage: student.additionalMessage || '',
      status: student.status,
      adminNotes: student.adminNotes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateEnrollment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      // Build payload with all editable fields
      const payload = {
        studentName: formData.studentName,
        studentPhone: formData.studentPhone,
        studentAge: formData.studentAge ? parseInt(formData.studentAge) : null,
        parentGuardianName: formData.parentGuardianName,
        address: formData.address,
        schedule: formData.schedule,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        additionalMessage: formData.additionalMessage,
        status: formData.status,
        adminNotes: formData.adminNotes
      };

      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ENROLLMENTS.UPDATE(editingStudent.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update enrollment');

      await loadStudents();
      resetForm();
    } catch (err) {
      console.error('Error updating enrollment:', err);
      alert(`Error updating enrollment: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      studentPhone: '',
      studentAge: '',
      parentGuardianName: '',
      address: '',
      schedule: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      additionalMessage: '',
      status: 'APPROVED',
      adminNotes: ''
    });
    setEditingStudent(null);
    setShowEditModal(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ENROLLMENTS.DELETE(id)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete enrollment');

        await loadStudents();
      } catch (err) {
        console.error('Error deleting enrollment:', err);
        alert(`Error deleting enrollment: ${err.message}`);
      }
    }
  };

  const handleSendMessage = (student) => {
    setMessageStudent(student);
    setShowMessageModal(true);
  };

  const sendViaWhatsApp = (student, customMessage = '') => {
    const message = customMessage || `Hello ${student.parentGuardianName},\n\nStudent Details:\n👤 Name: ${student.studentName}\n📧 Email: ${student.studentEmail}\n📱 Phone: ${student.studentPhone}\n🎂 Age: ${student.studentAge} years\n👨‍👩‍👦 Parent: ${student.parentGuardianName}\n📚 Class: ${student.className}\n⏰ Schedule: ${student.schedule}\n✅ Status: ${student.status}\n📅 Enrolled: ${new Date(student.createdAt).toLocaleDateString('en-IN')}\n🏠 Address: ${student.address}\n🚨 Emergency: ${student.emergencyContactName} - ${student.emergencyContactPhone}\n\nBest regards,\nArt Academy Administration`;

    const phoneNumber = student.studentPhone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const newMessage = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.studentName,
      message: customMessage || 'Student details shared via WhatsApp',
      sentVia: 'whatsapp',
      sentTo: student.studentPhone,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('studentMessages', JSON.stringify(updatedMessages));

    window.open(whatsappUrl, '_blank');
    setShowMessageModal(false);
  };

  const sendViaEmail = (student, customMessage = '') => {
    const subject = `Student Enrollment Details - ${student.studentName}`;
    const body = customMessage || `Dear ${student.parentGuardianName},\n\nHere are the enrollment details for ${student.studentName}:\n\nStudent Name: ${student.studentName}\nEmail: ${student.studentEmail}\nPhone: ${student.studentPhone}\nAge: ${student.studentAge} years\nParent Name: ${student.parentGuardianName}\nEnrolled Class: ${student.className}\nSchedule: ${student.schedule}\nStatus: ${student.status}\nEnrolled Date: ${new Date(student.createdAt).toLocaleDateString('en-IN')}\nAddress: ${student.address}\nEmergency Contact: ${student.emergencyContactName} - ${student.emergencyContactPhone}\n\nBest regards,\nArt Academy Administration`;

    const mailtoUrl = `mailto:${student.studentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const newMessage = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.studentName,
      message: customMessage || 'Student details shared via Email',
      sentVia: 'email',
      sentTo: student.studentEmail,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('studentMessages', JSON.stringify(updatedMessages));

    window.location.href = mailtoUrl;
    setShowMessageModal(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  // Get unique class names for filter dropdown
  const uniqueClasses = [...new Set(students.map(s => s.className).filter(Boolean))];

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Enrolled Students
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage student enrollments in art classes
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => loadStudents()}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            title="Refresh"
          >
            <FaSync className="text-lg" />
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filter by Class */}
          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 md:space-y-0">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Showing <span className="font-bold text-purple-600">{filteredStudents.length}</span> of <span className="font-bold">{students.length}</span> enrollments
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
          <span className="font-medium">Error loading enrollments:</span> {error}
          <button
            onClick={() => loadStudents()}
            className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 mb-6 flex flex-col items-center justify-center">
          <FaSpinner className="text-purple-600 text-5xl animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading enrollments...</p>
        </div>
      )}

      {/* Students Table */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium" title={student.id}>
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>
                          <div className="font-medium">{student.studentName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{student.studentEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.studentAge !== 'N/A' ? `${student.studentAge} yrs` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 dark:text-purple-400 font-medium">
                        {student.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.schedule}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded transition-colors flex items-center gap-1"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors flex items-center gap-1"
                            title="Update Status"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center gap-1"
                            title="Delete Enrollment"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FaUserGraduate className="text-gray-400 text-6xl mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-xl">
                        No enrollments found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 pb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} enrollments
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
                    className={`px-4 py-2 rounded-lg transition-all ${currentPage === index + 1
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
          )}
        </div>
      )}

      {/* Edit Enrollment Modal */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Edit Enrollment
              </h2>
              <button
                onClick={resetForm}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateEnrollment} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Student Info Header */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {editingStudent.studentName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Class: {editingStudent.className}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Roll No: {editingStudent.rollNo}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Student Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Student name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.studentPhone}
                    onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+91 1234567890"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="100"
                    value={formData.studentAge}
                    onChange={(e) => setFormData({ ...formData, studentAge: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Age"
                  />
                </div>

                {/* Parent/Guardian Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    value={formData.parentGuardianName}
                    onChange={(e) => setFormData({ ...formData, parentGuardianName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Parent's name"
                  />
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Schedule
                  </label>
                  <select
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Schedule</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Weekend Morning">Weekend Morning</option>
                    <option value="Weekend Afternoon">Weekend Afternoon</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Full address"
                  />
                </div>

                {/* Emergency Contact Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Emergency contact name"
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Emergency phone number"
                  />
                </div>

                {/* Additional Message */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    value={formData.additionalMessage}
                    onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Any notes or special requirements..."
                  />
                </div>

                {/* Admin Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={formData.adminNotes}
                    onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Internal admin notes..."
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Enrollment'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* View Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Enrollment Details</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {selectedStudent.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedStudent.studentName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Roll No: {selectedStudent.rollNo}
                  </p>
                  <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${getStatusBadgeClass(selectedStudent.status)}`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-purple-500 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</label>
                    <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.studentEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-purple-500 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Phone</label>
                    <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.studentPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaUserGraduate className="text-purple-500 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Age</label>
                    <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.studentAge} years</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaUserGraduate className="text-purple-500 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Parent/Guardian</label>
                    <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.parentGuardianName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaChalkboardTeacher className="text-purple-500 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Enrolled Class</label>
                    <p className="text-purple-600 dark:text-purple-400 font-bold">{selectedStudent.className}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedStudent.classDescription}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCalendar className="text-purple-500 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Schedule</label>
                    <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.schedule}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <FaMapMarkerAlt className="text-purple-500 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Address</label>
                    <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-red-500 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Emergency Contact</label>
                    <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.emergencyContactName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStudent.emergencyContactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCalendar className="text-purple-500 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Enrollment Date</label>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {new Date(selectedStudent.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {selectedStudent.additionalMessage && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mt-4">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Additional Message</label>
                  <p className="text-gray-800 dark:text-white mt-1">{selectedStudent.additionalMessage}</p>
                </div>
              )}

              {selectedStudent.adminNotes && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mt-4">
                  <label className="text-sm font-semibold text-purple-600 dark:text-purple-400">Admin Notes</label>
                  <p className="text-gray-800 dark:text-white mt-1">{selectedStudent.adminNotes}</p>
                </div>
              )}

              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => handleSendMessage(selectedStudent)}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <FaComments /> Send Message
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && messageStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FaComments className="text-3xl" />
                <h2 className="text-2xl font-bold">Send Enrollment Details</h2>
              </div>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageStudent(null);
                }}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Student Info Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {messageStudent.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {messageStudent.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {messageStudent.className} • Age {messageStudent.studentAge}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <FaPhone />
                    <span className="text-sm font-semibold">Phone Number</span>
                  </div>
                  <p className="text-gray-800 dark:text-white font-bold">{messageStudent.studentPhone}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <FaEnvelope />
                    <span className="text-sm font-semibold">Email Address</span>
                  </div>
                  <p className="text-gray-800 dark:text-white font-bold break-all">{messageStudent.studentEmail}</p>
                </div>
              </div>

              {/* Details Preview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                  <FaUserGraduate className="mr-2 text-purple-600" />
                  Details to be Shared
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Student Name:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{messageStudent.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Parent Name:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{messageStudent.parentGuardianName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Class:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{messageStudent.className}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Schedule:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{messageStudent.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`font-medium ${messageStudent.status === 'APPROVED' ? 'text-green-600' :
                        messageStudent.status === 'REJECTED' ? 'text-red-600' :
                          messageStudent.status === 'PENDING' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                      {messageStudent.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Enrollment Date:</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {new Date(messageStudent.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message History */}
              {messages.filter(m => m.studentId === messageStudent.id).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3">Recent Messages</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {messages
                      .filter(m => m.studentId === messageStudent.id)
                      .slice(-3)
                      .map(msg => (
                        <div key={msg.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-800 dark:text-white flex items-center">
                              {msg.sentVia === 'whatsapp' ? (
                                <FaWhatsapp className="text-green-500 mr-2" />
                              ) : (
                                <FaEnvelope className="text-blue-500 mr-2" />
                              )}
                              {msg.sentVia.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(msg.sentAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{msg.message}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => sendViaWhatsApp(messageStudent)}
                  className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaWhatsapp className="text-2xl" />
                  <span>Send via WhatsApp</span>
                </button>
                <button
                  onClick={() => sendViaEmail(messageStudent)}
                  className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaEnvelope className="text-2xl" />
                  <span>Send via Email</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageStudent(null);
                }}
                className="w-full mt-4 px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
