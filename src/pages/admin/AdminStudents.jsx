import { useState, useEffect } from 'react';
import {
  FaUserPlus, FaEdit, FaTrash, FaSearch, FaDownload, FaFilter,
  FaUserGraduate, FaPhone, FaEnvelope, FaCalendar, FaSortAmountDown,
  FaEye, FaTimes, FaWhatsapp, FaPaperPlane, FaComments, FaSync,
  FaSpinner
} from 'react-icons/fa';
import StudentManagementDetail from './StudentManagementDetail';
import { BASE_URL, API_ENDPOINTS } from '../../data/apiEndpoints';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewDetailStudent, setViewDetailStudent] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageStudent, setMessageStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    studentAge: '',
    parentGuardianName: '',
    preferredSchedule: 'WEEKEND_MORNING',
    additionalMessage: '',
    roles: ['ROLE_CUSTOMER']
  });

  useEffect(() => {
    loadStudents();
    loadMessages();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterClass, filterStatus, filterRole]);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.USERS.GET_ALL}?page=0&size=100`, {
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

      // Map API response to component's expected format
      // Using actual fields from backend UserResponse
      const mappedStudents = data.content
        .map((user) => ({
          id: user.id,
          rollNumber: user.rollNo || 'N/A',
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phoneNumber || 'N/A',
          age: user.studentAge || 'N/A',
          parentName: user.parentGuardianName || 'N/A',
          preferredSchedule: user.preferredSchedule || 'N/A',
          additionalMessage: user.additionalMessage || '',
          status: user.enabled ? 'active' : 'inactive',
          deleted: user.deleted,
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          roles: user.roles || []
        }));

      setStudents(mappedStudents);
      setTotalElements(data.totalElements || mappedStudents.length);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = () => {
    const existingMessages = localStorage.getItem('studentMessages');

    if (!existingMessages || JSON.parse(existingMessages).length === 0) {
      const dummyMessages = [
        {
          id: 1701234567920,
          studentId: 1701234567890,
          studentName: 'Aarav Sharma',
          message: 'Dear Parent, Your child Aarav has successfully completed the Drawing Basics module. His progress has been excellent!',
          sentVia: 'whatsapp',
          sentTo: '+91 98765 43210',
          sentAt: new Date('2024-11-20').toISOString(),
          status: 'sent'
        },
        {
          id: 1701234567921,
          studentId: 1701234567891,
          studentName: 'Priya Patel',
          message: 'Hello, We are excited to inform you that Priya has been selected for the advanced Watercolor Painting workshop next month!',
          sentVia: 'email',
          sentTo: 'priya.patel@email.com',
          sentAt: new Date('2024-11-25').toISOString(),
          status: 'sent'
        }
      ];
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
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.enrolledClass && s.enrolledClass.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterClass !== 'all') {
      filtered = filtered.filter(s => s.enrolledClass === filterClass);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(s => s.roles && s.roles.includes(filterRole));
    }

    setFilteredStudents(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      // Create payload - remove read-only fields and handle password
      const payload = { ...formData };

      // Remove fields not needed for request
      delete payload.id;
      delete payload.rollNo;
      delete payload.createdAt;
      delete payload.updatedAt;

      // Handle password - remove if empty (for updates)
      if (!payload.password) {
        delete payload.password;
      }

      if (editingStudent) {
        // Update existing student
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.USERS.GET_BY_ID(editingStudent.id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to update student');
      } else {
        // Create new student
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.USERS.CREATE}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to create student');
      }

      // Reload students and close modal
      await loadStudents();
      resetForm();
    } catch (err) {
      console.error('Error saving student:', err);
      alert(`Error saving student: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      studentAge: '',
      parentGuardianName: '',
      preferredSchedule: 'WEEKEND_MORNING',
      additionalMessage: '',
      roles: ['ROLE_CUSTOMER']
    });
    setEditingStudent(null);
    setShowAddModal(false);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phone,
      password: '', // Password not shown for edit
      studentAge: student.age || '',
      parentGuardianName: student.parentName || '',
      preferredSchedule: student.preferredSchedule || 'WEEKEND_MORNING',
      additionalMessage: student.additionalMessage || '',
      roles: student.roles || ['ROLE_CUSTOMER']
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.USERS.DELETE(id)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete student');

        // Reload students
        await loadStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        alert(`Error deleting student: ${err.message}`);
      }
    }
  };

  const handleSendMessage = (student) => {
    setMessageStudent(student);
    setShowMessageModal(true);
  };

  const sendViaWhatsApp = (student, customMessage = '') => {
    const message = customMessage || `Hello ${student.parentName},\n\nStudent Details:\n👤 Name: ${student.name}\n📧 Email: ${student.email}\n📱 Phone: ${student.phone}\n🎂 Age: ${student.age} years\n👨‍👩‍👦 Parent: ${student.parentName}\n📚 Class: ${student.enrolledClass}\n✅ Status: ${student.status}\n📅 Join Date: ${new Date(student.joinDate).toLocaleDateString('en-IN')}\n🏠 Address: ${student.address}\n🚨 Emergency: ${student.emergencyContact}\n\nBest regards,\nSchool Administration`;

    const phoneNumber = student.phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Save message to history
    const newMessage = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      message: customMessage || 'Student details shared via WhatsApp',
      sentVia: 'whatsapp',
      sentTo: student.phone,
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
    const subject = `Student Details - ${student.name}`;
    const body = customMessage || `Dear ${student.parentName},\n\nHere are the details for ${student.name}:\n\nStudent Name: ${student.name}\nEmail: ${student.email}\nPhone: ${student.phone}\nAge: ${student.age} years\nParent Name: ${student.parentName}\nEnrolled Class: ${student.enrolledClass}\nStatus: ${student.status}\nJoin Date: ${new Date(student.joinDate).toLocaleDateString('en-IN')}\nAddress: ${student.address}\nEmergency Contact: ${student.emergencyContact}\n\nBest regards,\nSchool Administration`;

    const mailtoUrl = `mailto:${student.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Save message to history
    const newMessage = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      message: customMessage || 'Student details shared via Email',
      sentVia: 'email',
      sentTo: student.email,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('studentMessages', JSON.stringify(updatedMessages));

    window.location.href = mailtoUrl;
    setShowMessageModal(false);
  };



  const classes = [
    'Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'Drawing Basics', 'Watercolor Painting', 'Acrylic Art', 'Clay Modeling',
    'Digital Art', 'Craft Making', 'Comic Creation', 'Portrait Drawing'
  ];

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
            Manage Students
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => loadStudents()}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            title="Refresh"
          >
            <FaSync className="text-lg" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <FaUserPlus className="text-lg" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filter by Role */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">All Roles</option>
              <option value="ROLE_CUSTOMER">Customer</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>

          {/* Filter by Class */}
          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 md:space-y-0">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Showing <span className="font-bold text-purple-600">{filteredStudents.length}</span> of <span className="font-bold">{students.length}</span> students
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
          <span className="font-medium">Error loading users:</span> {error}
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
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading users...</p>
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
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Parent/Guardian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Role
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
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.age !== 'N/A' ? `${student.age} yrs` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.parentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {student.roles && student.roles.map((role, idx) => (
                            <span key={idx} className={`px-2 py-1 text-xs font-bold rounded ${role === 'ROLE_ADMIN'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              }`}>
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
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
                            title="Edit Student"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center gap-1"
                            title="Delete Student"
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
                        No students found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} students
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button
                onClick={resetForm}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="student@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+91 1234567890"
                  />
                </div>

                {!editingStudent && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter password"
                    />
                  </div>
                )}

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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Schedule
                  </label>
                  <select
                    value={formData.preferredSchedule}
                    onChange={(e) => setFormData({ ...formData, preferredSchedule: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="WEEKEND_MORNING">Weekend Morning</option>
                    <option value="WEEKEND_AFTERNOON">Weekend Afternoon</option>
                    <option value="WEEKDAY_EVENING">Weekday Evening</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    value={formData.additionalMessage}
                    onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Any notes or medical conditions..."
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  {editingStudent ? 'Update Student' : 'Add Student'}
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Student Details</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Age: {selectedStudent.age} years
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Phone</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Parent/Guardian</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.parentName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Emergency Contact</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.emergencyContact}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Enrolled Class</label>
                  <p className="text-purple-600 dark:text-purple-400 font-bold">{selectedStudent.enrolledClass}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</label>
                  <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full ₹{
                    selectedStudent.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : selectedStudent.status === 'inactive'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {selectedStudent.status}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Address</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedStudent.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Join Date</label>
                  <p className="text-gray-800 dark:text-white font-medium">
                    {new Date(selectedStudent.joinDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-4">
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
            <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FaComments className="text-3xl" />
                <h2 className="text-2xl font-bold">Send Student Details</h2>
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
              <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {messageStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {messageStudent.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {messageStudent.enrolledClass} • Age {messageStudent.age}
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
                  <p className="text-gray-800 dark:text-white font-bold">{messageStudent.phone}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <FaEnvelope />
                    <span className="text-sm font-semibold">Email Address</span>
                  </div>
                  <p className="text-gray-800 dark:text-white font-bold break-all">{messageStudent.email}</p>
                </div>
              </div>

              {/* Details Preview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                  <FaUserGraduate className="mr-2 text-purple-600" />
                  Student Details to be Shared
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Student Name:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{messageStudent.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Parent Name:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{messageStudent.parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Class:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{messageStudent.enrolledClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`font-medium ₹{
                      messageStudent.status === 'active' ? 'text-green-600' : 
                      messageStudent.status === 'inactive' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {messageStudent.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Join Date:</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {new Date(messageStudent.joinDate).toLocaleDateString('en-IN')}
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
                  className="flex-1 flex items-center justify-center space-x-3 bg-linear-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaWhatsapp className="text-2xl" />
                  <span>Send via WhatsApp</span>
                </button>
                <button
                  onClick={() => sendViaEmail(messageStudent)}
                  className="flex-1 flex items-center justify-center space-x-3 bg-linear-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
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
