import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  FaBook, FaCalendar, FaTrophy, FaCertificate, FaArrowUp,
  FaImage, FaSpinner
} from 'react-icons/fa';
import enrollmentService from '../../services/enrollmentService';
import lmsService from '../../services/lmsService';

const StudentDashboard = () => {
  const { student } = useOutletContext();

  // State for API data
  const [enrollments, setEnrollments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [myGallery, setMyGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all student data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [enrollmentsRes, attendanceRes, subscriptionRes, galleryRes] = await Promise.all([
          enrollmentService.getMyEnrollments(0, 100),
          lmsService.getMyAttendance(0, 100),
          lmsService.getMyActiveSubscription(),
          lmsService.getMyGalleryUploads(0, 100),
        ]);

        if (enrollmentsRes.success) {
          const data = enrollmentsRes.data?.content || enrollmentsRes.data || [];
          setEnrollments(Array.isArray(data) ? data : []);
        }

        if (attendanceRes.success) {
          const data = attendanceRes.data?.content || attendanceRes.data || [];
          setAttendance(Array.isArray(data) ? data : []);
        }

        if (subscriptionRes.success) {
          setSubscription(subscriptionRes.data);
        }

        if (galleryRes.success) {
          const data = galleryRes.data?.content || galleryRes.data || [];
          setMyGallery(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate stats from real data
  const enrolledClassesCount = enrollments.filter(e => e.status === 'APPROVED').length;
  const totalAttendance = attendance.length;
  const attendanceRate = subscription?.classesAttended && subscription?.classLimit
    ? Math.round((subscription.classesAttended / subscription.classLimit) * 100)
    : 0;
  const approvedGallery = myGallery.filter(g => g.status === 'APPROVED').length;
  const pendingGallery = myGallery.filter(g => g.status === 'PENDING').length;

  const stats = [
    {
      title: 'Enrolled Classes',
      value: enrolledClassesCount.toString(),
      icon: FaBook,
      gradient: 'from-blue-500 to-blue-600',
      change: subscription ? `${subscription.classesAttended || 0}/${subscription.classLimit || 8} sessions` : 'No active subscription',
      changeType: 'stable'
    },
    {
      title: 'Classes Attended',
      value: totalAttendance.toString(),
      icon: FaCalendar,
      gradient: 'from-green-500 to-green-600',
      change: attendanceRate > 0 ? `${attendanceRate}% of limit` : 'Track your attendance',
      changeType: attendanceRate > 80 ? 'increase' : 'stable'
    },
    {
      title: 'My Gallery',
      value: myGallery.length.toString(),
      icon: FaImage,
      gradient: 'from-yellow-500 to-yellow-600',
      change: `${approvedGallery} approved, ${pendingGallery} pending`,
      changeType: pendingGallery > 0 ? 'info' : 'stable'
    },
    {
      title: 'Subscription',
      value: subscription?.status || 'None',
      icon: FaCertificate,
      gradient: 'from-purple-500 to-purple-600',
      change: subscription?.monthYear || 'No active subscription',
      changeType: subscription?.status === 'ACTIVE' ? 'increase' : 'info'
    }
  ];

  // Build recent activities from attendance data
  const recentActivities = attendance.slice(0, 5).map((record, index) => ({
    id: record.id || index,
    activity: `Attended class: ${record.className || 'Art Class'}`,
    time: record.attendedAt ? new Date(record.attendedAt).toLocaleDateString() : 'Recently',
    type: 'attendance'
  }));

  // Add gallery submissions to activities
  myGallery.slice(0, 3).forEach((item, index) => {
    recentActivities.push({
      id: `gallery-${item.id || index}`,
      activity: `Submitted artwork: ${item.title || 'Artwork'}`,
      time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
      type: item.status === 'APPROVED' ? 'achievement' : 'project'
    });
  });

  // Sort by date (newest first)
  recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

  const quickLinks = [
    { name: 'My Classes', path: '/student/classes', icon: FaBook, color: 'blue' },
    { name: 'My Gallery', path: '/student/my-gallery', icon: FaImage, color: 'yellow' },
    { name: 'Attendance', path: '/student/attendance', icon: FaCalendar, color: 'green' },
    { name: 'Certificates', path: '/student/certificates', icon: FaCertificate, color: 'purple' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome back, {student?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Continue your creative journey and track your progress
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                {stat.changeType === 'increase' && (
                  <FaArrowUp className="text-green-500 text-xl" />
                )}
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                {stat.title}
              </h3>
              <p className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                {stat.value}
              </p>
              <p className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' :
                  stat.changeType === 'info' ? 'text-blue-600 dark:text-blue-400' :
                    'text-gray-500 dark:text-gray-400'
                }`}>
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={index}
              to={link.path}
              className={`bg-gradient-to-br from-${link.color}-500 to-${link.color}-600 text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:scale-105`}
            >
              <Icon className="text-4xl mb-4" />
              <h3 className="text-xl font-bold">{link.name}</h3>
            </Link>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Recent Activities
          </h2>
          <Link
            to="/student/attendance"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent activities. Start by attending classes or uploading artwork!
            </p>
          ) : (
            recentActivities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'assignment' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    activity.type === 'attendance' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      activity.type === 'achievement' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  }`}>
                  {activity.type === 'assignment' ? '📝' :
                    activity.type === 'attendance' ? '✓' :
                      activity.type === 'achievement' ? '🏆' : '🎨'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {activity.activity}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;