import { useState, useEffect } from 'react';
import { FaPlus, FaRedo, FaSearch, FaCheckCircle, FaTimes, FaEdit, FaUser } from 'react-icons/fa';
import { ClassesAPI, onlineClassesAPI, attendanceAPI, enrollmentsAPI } from '../../services/api';

const AdminClasses = () => {
  const [s, sets] = useState([]);
  const [onlineClasses, setOnlineClasses] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    missedClassId: '',
    missedClassName: '',
    missedDate: '',
    reason: '',
    ClassId: '',
    Title: '',
    Date: '',
    Time: '',
    instructor: '',
    instructorId: '',
    assignedBy: 'Admin'
  });

  const regularClasses = [
    { id: 1, name: 'Beginner Drawing' },
    { id: 2, name: 'Watercolor Painting' },
    { id: 3, name: 'Acrylic Art' },
    { id: 4, name: 'Clay Modeling' },
    { id: 5, name: 'Digital Art' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compResponse, classResponse, absenceResponse, studentsResponse] = await Promise.all([
        ClassesAPI.getAll(),
        onlineClassesAPI.getAll(),
        attendanceAPI.getAll({ status: 'absent' }),
        enrollmentsAPI.getEnrolledStudents()
      ]);

      if (compResponse.success) sets(compResponse.data);
      if (classResponse.success) setOnlineClasses(classResponse.data);
      if (absenceResponse.success) setAbsences(absenceResponse.data);
      if (studentsResponse.success) setStudents(studentsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ClassesAPI.assign(formData);
      if (response.success) {
        await loadData();
        resetForm();
        alert(' class assigned successfully!');
      }
    } catch (error) {
      console.error('Error assigning  class:', error);
      alert('Error assigning  class');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await ClassesAPI.update(id, { status });
      await loadData();
      alert(`Status updated to ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this  class?')) {
      try {
        await ClassesAPI.delete(id);
        await loadData();
        alert(' class deleted successfully!');
      } catch (error) {
        console.error('Error deleting  class:', error);
        alert('Error deleting  class');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      studentName: '',
      missedClassId: '',
      missedClassName: '',
      missedDate: '',
      reason: '',
      ClassId: '',
      Title: '',
      Date: '',
      Time: '',
      instructor: '',
      instructorId: '',
      assignedBy: 'Admin'
    });
    setStudentSearch('');
    setShowModal(false);
  };

  const getFilteredStudents = () => {
    if (!studentSearch) return students;
    const searchLower = studentSearch.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower)
    );
  };

  const handleStudentChange = (e) => {
    const studentId = parseInt(e.target.value);
    const student = students.find(s => s.id === studentId);
    setFormData({
      ...formData,
      studentId,
      studentName: student ? student.name : ''
    });
  };

  const handleMissedClassChange = (e) => {
    const classId = parseInt(e.target.value);
    const classItem = regularClasses.find(c => c.id === classId);
    setFormData({
      ...formData,
      missedClassId: classId,
      missedClassName: classItem ? classItem.name : ''
    });
  };

  const handleClassChange = (e) => {
    const classId = parseInt(e.target.value);
    const classItem = onlineClasses.find(c => c.id === classId);
    if (classItem) {
      setFormData({
        ...formData,
        ClassId: classId,
        Title: classItem.title,
        Date: classItem.date,
        Time: classItem.time,
        instructor: classItem.instructor || '',
        instructorId: classItem.instructorId || ''
      });
    }
  };

  const getFiltereds = () => {
    let filtered = s;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.missedClassName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    return filtered.sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));
  };

  const filtereds = getFiltereds();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
             Classes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage  classes for missed sessions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center space-x-2"
        >
          <FaPlus />
          <span>Assign </span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Assigned</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{s.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FaRedo className="text-purple-600 dark:text-purple-300 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Active</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {s.filter(c => c.status === 'assigned').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FaRedo className="text-blue-600 dark:text-blue-300 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {s.filter(c => c.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600 dark:text-green-300 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Recent Absences</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{absences.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <FaTimes className="text-red-600 dark:text-red-300 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search s..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* s Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Missed Class
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                   Class
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtereds.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800 dark:text-white">{comp.studentName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-800 dark:text-white font-medium">{comp.missedClassName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(comp.missedDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{comp.reason}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-800 dark:text-white font-medium">{comp.Title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(comp.Date).toLocaleDateString()} - {comp.Time}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      comp.status === 'assigned' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                      comp.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {comp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {comp.status === 'assigned' && (
                        <button
                          onClick={() => handleStatusUpdate(comp.id, 'completed')}
                          className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-all"
                          title="Mark as completed"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comp.id)}
                        className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-all"
                        title="Delete"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Assign  Class
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <FaTimes className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Student Name * <span className="text-gray-500 text-xs">(Only enrolled students)</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Enter student name..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Missed Class *
                </label>
                <select
                  required
                  value={formData.missedClassId}
                  onChange={handleMissedClassChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select missed class</option>
                  {regularClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Missed Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.missedDate}
                  onChange={(e) => setFormData({ ...formData, missedDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Absence *
                </label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                  rows="2"
                  placeholder="Enter reason for absence..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                   Class *
                </label>
                <select
                  required
                  value={formData.ClassId}
                  onChange={handleClassChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select  class</option>
                  {onlineClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.title} - {new Date(cls.date).toLocaleDateString()} at {cls.time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter instructor name..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Auto-filled from selected class, can be modified
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                >
                  Assign 
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClasses;
