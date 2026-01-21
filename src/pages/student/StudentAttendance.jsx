import { useState, useEffect } from 'react';
import { FaCalendarCheck, FaCheckCircle, FaTimesCircle, FaClock, FaFileAlt, FaVideo, FaRedo, FaChalkboardTeacher } from 'react-icons/fa';
import { attendanceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedClassType, setSelectedClassType] = useState('all');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, [selectedMonth, selectedYear, selectedClassType]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getByStudent(user?.id || 1);
      if (response.success) {
        setAttendanceRecords(response.data);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate attendance data
  const attendanceData = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    percentage: attendanceRecords.length > 0 
      ? ((attendanceRecords.filter(r => r.status === 'present').length / attendanceRecords.length) * 100).toFixed(1)
      : 0,
  };

  // Filter by class type
  const getFilteredRecords = () => {
    if (selectedClassType === 'all') return attendanceRecords;
    return attendanceRecords.filter(r => r.classType === selectedClassType);
  };

  // Calendar data
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-500 text-white';
      case 'absent': return 'bg-red-500 text-white';
      case 'late': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          My Attendance
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your class attendance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          icon={FaCalendarCheck}
          title="Total Days"
          value={attendanceData.total}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={FaCheckCircle}
          title="Present"
          value={attendanceData.present}
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={FaTimesCircle}
          title="Absent"
          value={attendanceData.absent}
          color="from-red-500 to-red-600"
        />
      </div>

      {/* Class Type Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Filter by Class Type</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedClassType('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedClassType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FaCalendarCheck size={12} />
            <span>All Classes</span>
          </button>
          <button
            onClick={() => setSelectedClassType('regular')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedClassType === 'regular'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FaChalkboardTeacher size={12} />
            <span>Regular</span>
          </button>
          <button
            onClick={() => setSelectedClassType('online')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedClassType === 'online'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FaVideo size={12} />
            <span>Online</span>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-800 dark:text-white">
            Attendance Calendar
          </h2>
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-1 text-xs">
              {day}
            </div>
          ))}

          {/* Empty cells for first week */}
          {[...Array(firstDay)].map((_, index) => (
            <div key={`empty-${index}`} className="h-8" />
          ))}

          {/* Calendar Days */}
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = attendanceRecords.find(r => r.date?.startsWith(dateStr));
            const status = record?.status;
            const isToday = day === new Date().getDate() && 
                           selectedMonth === new Date().getMonth() && 
                           selectedYear === new Date().getFullYear();

            return (
              <div
                key={day}
                className={`h-8 w-8 flex items-center justify-center rounded font-semibold text-xs transition-all cursor-pointer hover:scale-105 ${
                  isToday ? 'ring-2 ring-purple-600' : ''
                } ${getStatusColor(status)}`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Late</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">No Class</span>
          </div>
        </div>
      </div>
    </div>
  );
};
const StatCard = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 hover:shadow-lg transition-all">
      <div className={`w-8 h-8 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mb-2`}>
        <Icon className="text-white" size={16} />
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white mb-0.5">
        {value}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {title}
      </p>
    </div>
  );
};

export default StudentAttendance;
