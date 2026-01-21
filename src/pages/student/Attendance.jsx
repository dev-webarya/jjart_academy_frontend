import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaCalendar, FaCheckCircle, FaTimes, FaClock, FaChartBar } from 'react-icons/fa';
const Attendance = () => {
  const { student } = useOutletContext();
  const [attendanceData] = useState({
    present: 47,
    absent: 5,
    late: 3,
    percentage: 89,
  });
  const [monthlyData] = useState([
    { month: 'January', present: 15, absent: 2, late: 1 },
    { month: 'February', present: 14, absent: 1, late: 0 },
    { month: 'March', present: 18, absent: 2, late: 2 },
  ]);
  const [attendanceRecords] = useState([
    { id: 1, date: '2026-01-10', class: 'Watercolor Painting', status: 'present', time: '4:05 PM' },
    { id: 2, date: '2026-01-09', class: 'Digital Art', status: 'present', time: '5:02 PM' },
    { id: 3, date: '2026-01-08', class: 'Clay Modeling', status: 'absent', time: '-' },
    { id: 4, date: '2026-01-07', class: 'Watercolor Painting', status: 'present', time: '4:00 PM' },
    { id: 5, date: '2026-01-06', class: 'Digital Art', status: 'late', time: '5:15 PM' },
  ]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'present':
        return {
          badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
          icon: FaCheckCircle,
          color: 'green'
        };
      case 'absent':
        return {
          badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
          icon: FaTimes,
          color: 'red'
        };
      case 'late':
        return {
          badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
          icon: FaClock,
          color: 'orange'
        };
      default:
        return {
          badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
          icon: FaCalendar,
          color: 'gray'
        };
    }
  };
  const totalClasses = attendanceData.present + attendanceData.absent + attendanceData.late;
  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance</h1>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Track your attendance and class participation</p>
      </div>
      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Present</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{attendanceData.present}</p>
            </div>
            <FaCheckCircle className="text-3xl text-green-400 opacity-30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4 border border-red-200 dark:border-red-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Absent</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{attendanceData.absent}</p>
            </div>
            <FaTimes className="text-3xl text-red-400 opacity-30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Late</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{attendanceData.late}</p>
            </div>
            <FaClock className="text-3xl text-orange-400 opacity-30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Attendance Rate</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{attendanceData.percentage}%</p>
            </div>
            <FaChartBar className="text-3xl text-indigo-400 opacity-30" />
          </div>
        </div>
      </div>
      {/* Monthly Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaChartBar className="text-indigo-600 dark:text-indigo-400" />
          Monthly Breakdown
        </h2>
        <div className="space-y-3">
          {monthlyData.map((month, idx) => {
            const monthTotal = month.present + month.absent + month.late;
            const monthPercentage = Math.round((month.present / monthTotal) * 100);
            return (
              <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {month.month}
                  </span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {monthPercentage}%
                  </span>
                </div>
                <div className="flex gap-1 text-xs">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${(month.present / monthTotal) * 100}%` }}
                    title={`Present: ${month.present}`}
                  />
                  <div
                    className="h-2 bg-red-500 rounded-full"
                    style={{ width: `${(month.absent / monthTotal) * 100}%` }}
                    title={`Absent: ${month.absent}`}
                  />
                  <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `${(month.late / monthTotal) * 100}%` }}
                    title={`Late: ${month.late}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Recent Attendance Records */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaCalendar className="text-indigo-600 dark:text-indigo-400" />
          Recent Records
        </h2>
        <div className="space-y-2">
          {attendanceRecords.map(record => {
            const statusStyles = getStatusStyles(record.status);
            const StatusIcon = statusStyles.icon;
            return (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <StatusIcon className={`text-lg text-${statusStyles.color}-600 dark:text-${statusStyles.color}-400 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                      {record.class}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(record.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${statusStyles.badge}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right">
                    {record.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/30">
          <FaCheckCircle className="text-green-600 dark:text-green-400" size={16} />
          <span className="text-xs text-gray-700 dark:text-gray-300">Present: On time</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700/30">
          <FaClock className="text-orange-600 dark:text-orange-400" size={16} />
          <span className="text-xs text-gray-700 dark:text-gray-300">Late: 5+ mins</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700/30">
          <FaTimes className="text-red-600 dark:text-red-400" size={16} />
          <span className="text-xs text-gray-700 dark:text-gray-300">Absent: No class</span>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
