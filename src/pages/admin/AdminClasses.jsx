import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaClock, FaChalkboardTeacher, FaTimes, FaSearch, FaEye, FaWhatsapp, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import { onlineClassesAPI } from '../../services/api';

const AdminClasses = () => {
  const initialClasses = [
    { id: 1, name: 'Drawing Basics', instructor: 'Priya Sharma', students: 25, duration: '8 weeks', level: 'Beginner', status: 'Active', price: 5000, schedule: 'Mon, Wed 4-6 PM', description: 'Learn fundamental drawing techniques, shading, and perspective.' },
    { id: 2, name: 'Watercolor Painting', instructor: 'Raj Kumar', students: 20, duration: '10 weeks', level: 'Intermediate', status: 'Active', price: 6000, schedule: 'Tue, Thu 4-6 PM', description: 'Master watercolor techniques, blending, and color theory.' },
    { id: 3, name: 'Acrylic Art', instructor: 'Ananya Desai', students: 18, duration: '12 weeks', level: 'Advanced', status: 'Active', price: 7000, schedule: 'Wed, Fri 5-7 PM', description: 'Advanced acrylic painting with focus on composition and style.' },
    { id: 4, name: 'Clay Modeling', instructor: 'Arjun Mehta', students: 22, duration: '6 weeks', level: 'Beginner', status: 'Active', price: 4500, schedule: 'Sat 10AM-12PM', description: 'Explore 3D art through clay modeling and sculpture.' },
    { id: 5, name: 'Digital Art', instructor: 'Neha Patel', students: 15, duration: '10 weeks', level: 'Intermediate', status: 'Active', price: 8000, schedule: 'Sun 2-4 PM', description: 'Create digital artwork using modern design tools and software.' },
    { id: 6, name: 'Craft Making', instructor: 'Priya Sharma', students: 28, duration: '8 weeks', level: 'Beginner', status: 'Active', price: 4000, schedule: 'Mon, Fri 3-5 PM', description: 'Learn various craft techniques and create beautiful handmade items.' },
    { id: 7, name: 'Comic Creation', instructor: 'Raj Kumar', students: 16, duration: '12 weeks', level: 'Advanced', status: 'Active', price: 7500, schedule: 'Tue, Thu 5-7 PM', description: 'Develop storytelling and illustration skills for comic art.' },
    { id: 8, name: 'Portrait Drawing', instructor: 'Ananya Desai', students: 14, duration: '10 weeks', level: 'Intermediate', status: 'Active', price: 6500, schedule: 'Sat 2-4 PM', description: 'Master portrait techniques, proportions, and facial features.' },
  ];
  
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('regularClasses');
    if (saved) {
      return JSON.parse(saved);
    }
    // Save initial data to localStorage
    localStorage.setItem('regularClasses', JSON.stringify(initialClasses));
    return initialClasses;
  });
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    students: 0,
    duration: '',
    level: 'Beginner',
    status: 'Active',
    price: '',
    schedule: ''
  });

  // Load students from localStorage
  const getEnrolledStudents = (className) => {
    const studentsData = localStorage.getItem('students');
    if (studentsData) {
      const allStudents = JSON.parse(studentsData);
      return allStudents.filter(student => student.enrolledClass === className);
    }
    return [];
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || cls.level === filterLevel;
    return matchesSearch && matchesLevel;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedClasses;
    if (editingClass) {
      updatedClasses = classes.map(c => c.id === editingClass.id ? { ...formData, id: c.id } : c);
    } else {
      updatedClasses = [...classes, { ...formData, id: Date.now() }];
    }
    setClasses(updatedClasses);
    // Save to localStorage so students can see it
    localStorage.setItem('regularClasses', JSON.stringify(updatedClasses));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      instructor: '',
      students: 0,
      duration: '',
      level: 'Beginner',
      status: 'Active',
      price: '',
      schedule: ''
    });
    setEditingClass(null);
    setShowModal(false);
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData(classItem);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this class?')) {
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      // Save to localStorage so students can see updated data
      localStorage.setItem('regularClasses', JSON.stringify(updatedClasses));
    }
  };

  const instructors = ['Priya Sharma', 'Raj Kumar', 'Ananya Desai', 'Arjun Mehta', 'Neha Patel'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Regular Classes Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all art classes, schedules, and enrollments
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{classes.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FaGraduationCap className="text-purple-600 dark:text-purple-300 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Active Classes</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {classes.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FaChalkboardTeacher className="text-green-600 dark:text-green-300 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {classes.reduce((sum, c) => sum + c.students, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FaUsers className="text-blue-600 dark:text-blue-300 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Avg Students</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {classes.length > 0 ? Math.round(classes.reduce((sum, c) => sum + c.students, 0) / classes.length) : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-orange-600 dark:text-orange-300 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Class Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentClasses.map((classItem) => (
              <tr key={classItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {classItem.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {classItem.instructor}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-bold rounded uppercase ${
                    classItem.level === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    classItem.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {classItem.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classItem.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classItem.schedule}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classItem.students}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    ₹{classItem.price.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const message = `Join our art class:\n\nClass: ${classItem.name}\nInstructor: ${classItem.instructor}\nSchedule: ${classItem.schedule}\nDuration: ${classItem.duration}\nLevel: ${classItem.level}\nPrice: ₹${classItem.price.toLocaleString()}\n\nContact us to enroll!`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-all"
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClass(classItem);
                        setShowStudentsModal(true);
                      }}
                      className="p-2 bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-all"
                      title="View Students"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEdit(classItem)}
                      className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all"
                      title="Edit Class"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(classItem.id)}
                      className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-all"
                      title="Delete Class"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        {filteredClasses.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredClasses.length)} of {filteredClasses.length} classes
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
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </h2>
              <button onClick={resetForm} className="text-white hover:bg-white/20 rounded-full p-2 transition-all">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Class Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 8 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Level *
                  </label>
                  <select
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Max Students
                  </label>
                  <input
                    type="number"
                    value={formData.students}
                    onChange={(e) => setFormData({...formData, students: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Schedule *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Mon, Wed 4-6 PM"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  {editingClass ? 'Update Class' : 'Add Class'}
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

      {/* Students Modal */}
      {showStudentsModal && selectedClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowStudentsModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
                  <p className="text-sm mt-1">Enrolled Students</p>
                </div>
                <button onClick={() => setShowStudentsModal(false)} className="text-white hover:bg-white/20 rounded-full p-2 transition-all">
                  <FaTimes size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {getEnrolledStudents(selectedClass.name).length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {getEnrolledStudents(selectedClass.name).map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {student.rollNumber || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {student.enrolledClass}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {student.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-bold rounded uppercase ${
                              student.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaUsers className="text-gray-400 text-6xl mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-xl">
                    No students enrolled in this class yet
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowStudentsModal(false)}
                className="w-full mt-6 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
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

export default AdminClasses;
