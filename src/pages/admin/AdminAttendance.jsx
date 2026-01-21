import { useState, useEffect } from 'react';
import { FaCalendar, FaCheck, FaTimes, FaClock, FaDownload, FaSearch, FaFilter, FaSave, FaRedo } from 'react-icons/fa';

const AdminAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const classes = [
    'Drawing Basics', 'Watercolor Painting', 'Acrylic Art', 'Clay Modeling',
    'Digital Art', 'Craft Making', 'Comic Creation', 'Portrait Drawing'
  ];
  const [students, setStudents] = useState([]);
  useEffect(() => {
    loadStudents();
    loadAttendanceForDate();
  }, [selectedDate]);
  const loadStudents = () => {
    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(storedStudents);
  };
  const loadAttendanceForDate = () => {
    const attendanceKey = `attendance_${selectedDate}`;
    const storedAttendance = JSON.parse(localStorage.getItem(attendanceKey) || '{}');
    setAttendanceData(storedAttendance);
  };
  const markAttendance = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  const markAllPresent = () => {
    const filteredStudents = getFilteredStudents();
    const newAttendance = { ...attendanceData };
    filteredStudents.forEach(student => {
      newAttendance[student.id] = 'present';
    });
    setAttendanceData(newAttendance);
  };
  const markAllAbsent = () => {
    const filteredStudents = getFilteredStudents();
    const newAttendance = { ...attendanceData };
    filteredStudents.forEach(student => {
      newAttendance[student.id] = 'absent';
    });
    setAttendanceData(newAttendance);
  };
  const getFilteredStudents = () => {
    return students.filter(student => {
      const matchesClass = selectedClass === 'all' || student.enrolledClass === selectedClass;
      const matchesSearch = 
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toString().includes(searchTerm.toLowerCase());
      return matchesClass && matchesSearch;
    });
  };
  const saveAttendance = () => {
    const attendanceKey = `attendance_${selectedDate}`;
    localStorage.setItem(attendanceKey, JSON.stringify(attendanceData));
    // Also save to attendance history
    const history = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
    const record = {
      date: selectedDate,
      timestamp: new Date().toISOString(),
      data: attendanceData,
      totalStudents: Object.keys(attendanceData).length,
      presentCount: Object.values(attendanceData).filter(s => s === 'present').length,
      absentCount: Object.values(attendanceData).filter(s => s === 'absent').length
    };
    // Remove existing record for this date if any
    const filteredHistory = history.filter(h => h.date !== selectedDate);
    filteredHistory.push(record);
    localStorage.setItem('attendanceHistory', JSON.stringify(filteredHistory));
    alert('Attendance saved successfully!');
  };
  const resetAttendance = () => {
    if (confirm('Are you sure you want to reset attendance for this date?')) {
      setAttendanceData({});
    }
  };
  const exportAttendance = () => {
    const filteredStudents = getFilteredStudents();
    let csv = 'Roll No,Student Name,Class,Status\n';
    filteredStudents.forEach(student => {
      const status = attendanceData[student.id] || 'Not Marked';
      csv += `${student.rollNumber},${student.name},${student.enrolledClass},${status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}.csv`;
    a.click();
  };
  const getAttendanceStats = () => {
    const filteredStudents = getFilteredStudents();
    const present = filteredStudents.filter(s => attendanceData[s.id] === 'present').length;
    const absent = filteredStudents.filter(s => attendanceData[s.id] === 'absent').length;
    const notMarked = filteredStudents.length - present - absent;
    const percentage = filteredStudents.length > 0 ? ((present / filteredStudents.length) * 100).toFixed(1) : 0;
    return { present, absent, notMarked, total: filteredStudents.length, percentage };
  };
  const stats = getAttendanceStats();
  const filteredStudents = getFilteredStudents();
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Attendance Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Mark and manage student attendance for {selectedDate}</p>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FaCalendar className="inline mr-2" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FaFilter className="inline mr-2" />
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classes.map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FaSearch className="inline mr-2" />
              Search Student
            </label>
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.total}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl shadow-lg">
          <div className="text-sm text-green-600 dark:text-green-400">Present</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.present}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-lg">
          <div className="text-sm text-red-600 dark:text-red-400">Absent</div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{stats.absent}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl shadow-lg">
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Not Marked</div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{stats.notMarked}</div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={markAllPresent}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg"
        >
          <FaCheck />
          <span>Mark All Present</span>
        </button>
        <button
          onClick={markAllAbsent}
          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg"
        >
          <FaTimes />
          <span>Mark All Absent</span>
        </button>
        <button
          onClick={saveAttendance}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg"
        >
          <FaSave />
          <span>Save Attendance</span>
        </button>
        <button
          onClick={exportAttendance}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
        >
          <FaDownload />
          <span>Export CSV</span>
        </button>
      </div>
      {/* Attendance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {currentStudents.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Class
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
              {currentStudents.map((student) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold rounded uppercase ${
                      attendanceData[student.id] === 'present'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : attendanceData[student.id] === 'absent'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {attendanceData[student.id] || 'Not Marked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => markAttendance(student.id, 'present')}
                        className={`p-2 rounded-lg transition-all ${
                          attendanceData[student.id] === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                        }`}
                        title="Mark Present"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, 'absent')}
                        className={`p-2 rounded-lg transition-all ${
                          attendanceData[student.id] === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                        }`}
                        title="Mark Absent"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <FaClock className="text-gray-400 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-xl">
              No students found for the selected filters
            </p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} students
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-2 rounded-lg transition-all ${
                      currentPage === index + 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminAttendance;