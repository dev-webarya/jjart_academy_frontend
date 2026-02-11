import { useState, useEffect } from 'react';
import { FaCalendarCheck, FaCheckCircle, FaTimesCircle, FaClock, FaSpinner, FaExclamationTriangle, FaChartBar } from 'react-icons/fa';
import lmsService from '../../services/lmsService';
import { useAuth } from '../../context/AuthContext';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch attendance and subscription data in parallel
      const [attendanceRes, subscriptionRes] = await Promise.all([
        lmsService.getMyAttendance(0, 100),
        lmsService.getMyActiveSubscription()
      ]);

      if (attendanceRes.success) {
        const data = attendanceRes.data?.content || attendanceRes.data || [];
        setAttendanceRecords(Array.isArray(data) ? data : []);
      }

      if (subscriptionRes.success && subscriptionRes.data) {
        setSubscription(subscriptionRes.data);
      }
    } catch (err) {
      console.error('Error loading attendance:', err);
      setError('Failed to load attendance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter records by selected month/year
  const getMonthlyRecords = () => {
    return attendanceRecords.filter(record => {
      if (record.sessionMonth && record.sessionYear) {
        return record.sessionMonth === selectedMonth + 1 && record.sessionYear === selectedYear;
      }
      if (record.sessionDate) {
        const date = new Date(record.sessionDate);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      }
      return false;
    });
  };

  const monthlyRecords = getMonthlyRecords();

  // Calculate attendance statistics
  const attendanceData = {
    total: monthlyRecords.length,
    present: monthlyRecords.filter(r => r.status === 'PRESENT' || r.status === 'present').length,
    absent: monthlyRecords.filter(r => r.status === 'ABSENT' || r.status === 'absent').length,
    late: monthlyRecords.filter(r => r.status === 'LATE' || r.status === 'late').length,
    overLimit: monthlyRecords.filter(r => r.isOverLimit).length,
    percentage: monthlyRecords.length > 0
      ? ((monthlyRecords.filter(r => r.status === 'PRESENT' || r.status === 'present').length / monthlyRecords.length) * 100).toFixed(1)
      : 0,
  };

  // Calendar data
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusForDate = (day) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = monthlyRecords.find(r => {
      if (r.sessionDate) {
        const recordDate = r.sessionDate.split('T')[0];
        return recordDate === dateStr;
      }
      return false;
    });
    return record;
  };

  const getStatusColor = (record) => {
    if (!record) return 'bg-gray-100 dark:bg-gray-700 text-gray-400';

    const status = record.status?.toUpperCase();
    if (status === 'PRESENT') {
      if (record.isOverLimit) {
        return 'bg-orange-500 text-white'; // Present but over limit
      }
      return 'bg-green-500 text-white';
    }
    if (status === 'ABSENT') return 'bg-red-500 text-white';
    if (status === 'LATE') return 'bg-yellow-500 text-white';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <FaCalendarCheck className="text-4xl" />
          <div>
            <h1 className="text-3xl font-bold">My Attendance</h1>
            <p className="text-green-100 mt-1">Track your class attendance</p>
          </div>
        </div>

        {/* Subscription Info */}
        {subscription && (
          <div className="bg-white/10 rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-green-100 text-sm">Current Subscription</p>
                <p className="font-bold text-lg">
                  {months[subscription.subscriptionMonth - 1]} {subscription.subscriptionYear}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">Sessions</p>
                <p className="font-bold text-lg">
                  {subscription.attendedSessions || 0} / {subscription.allowedSessions || 8}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">Remaining</p>
                <p className="font-bold text-lg text-yellow-300">
                  {subscription.remainingSessions || 0}
                </p>
              </div>
              {subscription.isOverLimit && (
                <div className="flex items-center gap-2 bg-red-500/30 px-3 py-2 rounded-lg">
                  <FaExclamationTriangle />
                  <span className="text-sm font-semibold">Over Limit</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl">
          {error}
          <button onClick={loadAttendanceData} className="ml-4 underline font-semibold">Retry</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={FaCalendarCheck}
          title="Total Sessions"
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
        <StatCard
          icon={FaChartBar}
          title="Attendance %"
          value={`${attendanceData.percentage}%`}
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Over Limit Warning */}
      {attendanceData.overLimit > 0 && (
        <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-center gap-3">
          <FaExclamationTriangle className="text-orange-600 dark:text-orange-400 text-xl shrink-0" />
          <div>
            <p className="font-semibold text-orange-800 dark:text-orange-300">Over Limit Sessions</p>
            <p className="text-sm text-orange-700 dark:text-orange-400">
              You have {attendanceData.overLimit} session(s) beyond your monthly limit this month.
            </p>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Attendance Calendar
          </h2>
          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2024, 2025, 2026, 2027].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2 text-sm">
              {day}
            </div>
          ))}

          {/* Empty cells for first week */}
          {[...Array(firstDay)].map((_, index) => (
            <div key={`empty-${index}`} className="h-10" />
          ))}

          {/* Calendar Days */}
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const record = getStatusForDate(day);
            const isToday = day === new Date().getDate() &&
              selectedMonth === new Date().getMonth() &&
              selectedYear === new Date().getFullYear();

            return (
              <div
                key={day}
                className={`h-10 w-10 mx-auto flex items-center justify-center rounded-lg font-semibold text-sm transition-all cursor-pointer hover:scale-110 ${isToday ? 'ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-gray-800' : ''
                  } ${getStatusColor(record)}`}
                title={record ? `${record.status}${record.isOverLimit ? ' (Over Limit)' : ''}` : 'No Class'}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Over Limit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">No Class</span>
          </div>
        </div>
      </div>

      {/* Recent Attendance Records */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Attendance</h2>
        </div>

        {monthlyRecords.length === 0 ? (
          <div className="p-8 text-center">
            <FaCalendarCheck className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No attendance records for this month</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {monthlyRecords.slice(0, 10).map((record, index) => (
              <div key={record.id || index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.status?.toUpperCase() === 'PRESENT'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : record.status?.toUpperCase() === 'ABSENT'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                      }`}>
                      {record.status?.toUpperCase() === 'PRESENT' ? <FaCheckCircle /> : <FaTimesCircle />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {new Date(record.sessionDate).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Session #{record.sessionCountThisMonth || index + 1}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {record.isOverLimit && (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold">
                        Over Limit
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${record.status?.toUpperCase() === 'PRESENT'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : record.status?.toUpperCase() === 'ABSENT'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                      {record.status}
                    </span>
                  </div>
                </div>
                {record.remarks && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 ml-14">
                    {record.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-all">
      <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="text-white" size={18} />
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {title}
      </p>
    </div>
  );
};

export default StudentAttendance;
