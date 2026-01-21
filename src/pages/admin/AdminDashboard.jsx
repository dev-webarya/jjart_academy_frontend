import { useState, useEffect } from 'react';
import { 
  FaUsers, FaGraduationCap, FaChalkboardTeacher, FaChartLine,
  FaUserGraduate, FaMoneyBillWave, FaCalendarCheck, FaTrophy,
  FaArrowUp, FaArrowDown, FaEye
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEnrollments: 0,
    totalInstructors: 5,
    totalClasses: 8,
    pendingEnrollments: 0,
    activeClasses: 8,
    monthlyRevenue: 0,
    completionRate: 85,
    newStudentsThisMonth: 0,
    studentGrowth: 15,
    revenueGrowth: 22
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    
    const pending = enrollments.filter(e => e.status === 'pending').length;
    const thisMonthStudents = students.filter(s => {
      const joinDate = new Date(s.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length;

    setStats({
      ...stats,
      totalEnrollments: enrollments.length,
      totalStudents: students.length,
      pendingEnrollments: pending,
      monthlyRevenue: enrollments.length * 5000,
      newStudentsThisMonth: thisMonthStudents
    });

    // Set recent activity
    const recentEnrollments = enrollments.slice(-5).reverse().map(e => ({
      type: 'enrollment',
      title: `New enrollment: ${e.studentName}`,
      time: new Date(e.enrollmentDate).toLocaleString('en-IN'),
      status: e.status
    }));
    setRecentActivity(recentEnrollments);
  };

  const quickLinks = [
    { name: 'Manage Students', path: '/admin/students', icon: FaUsers, className: 'bg-linear-to-br from-blue-500 to-blue-600' },
    { name: 'View Enrollments', path: '/admin/enrollments', icon: FaGraduationCap, className: 'bg-linear-to-br from-green-500 to-green-600' },
    { name: 'Manage Classes', path: '/admin/classes', icon: FaChartLine, className: 'bg-linear-to-br from-purple-500 to-purple-600' },
    { name: 'View Messages', path: '/admin/messages', icon: FaEye, className: 'bg-linear-to-br from-orange-500 to-orange-600' }
  ];  

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Welcome back! Here's what's happening with your art school today.
        </p>
      </div>
     
      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={index}
              to={link.path}
              className={`${link.className} text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:scale-105`}
            >
              <Icon className="text-4xl mb-4" />
              <h3 className="text-xl font-bold">{link.name}</h3>
            </Link>
          );
        })}
      </div>
      {/* Recent Enrollments */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Recent Enrollments
            </h2>
            <Link
              to="/admin/enrollments"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : activity.status === 'approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No recent enrollments
              </p>
            )}
          </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
