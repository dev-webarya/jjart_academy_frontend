import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  FaBook, FaCalendar, FaTrophy, FaCertificate, FaArrowUp,
  FaArrowDown, FaClipboardList, FaAward
} from 'react-icons/fa';
const StudentDashboard = () => {
  const { student } = useOutletContext();
  const stats = [
    {
      title: 'Enrolled Classes',
      value: '3',
      icon: FaBook,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      change: '+1 this month',
      changeType: 'increase'
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      icon: FaCalendar,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      change: 'Excellent',
      changeType: 'stable'
    },
    {
      title: 'Achievements',
      value: '7',
      icon: FaTrophy,
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      change: '+2 new',
      changeType: 'increase'
    },
    {
      title: 'Certificates',
      value: '2',
      icon: FaCertificate,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      change: '+1 pending',
      changeType: 'info'
    }
  ];
  const enrolledClasses = [
    { 
      id: 1, 
      name: 'Watercolor Painting', 
      instructor: 'Priya Sharma', 
      schedule: 'Mon, Wed 4:00 PM', 
      progress: 75, 
      nextClass: 'Today, 4:00 PM',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Digital Art', 
      instructor: 'Raj Kumar', 
      schedule: 'Tue, Thu 5:00 PM', 
      progress: 60, 
      nextClass: 'Tomorrow, 5:00 PM',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Clay Modeling', 
      instructor: 'Ananya Desai', 
      schedule: 'Fri 3:00 PM', 
      progress: 40, 
      nextClass: 'Friday, 3:00 PM',
      status: 'active'
    }
  ];
  const recentActivities = [
    { id: 1, activity: 'Completed assignment: Sunset Watercolor', time: '2 hours ago', type: 'assignment' },
    { id: 2, activity: 'Attended Digital Art class', time: '1 day ago', type: 'attendance' },
    { id: 3, activity: 'Earned "Creative Artist" badge', time: '2 days ago', type: 'achievement' },
    { id: 4, activity: 'Submitted project: Clay Sculpture', time: '3 days ago', type: 'project' },
  ];
  const quickLinks = [];
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
                <div className={`w-12 h-12 bg-linear-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                {stat.changeType === 'increase' && (
                  <FaArrowUp className="text-green-500 text-xl" />
                )}
                {stat.changeType === 'decrease' && (
                  <FaArrowDown className="text-red-500 text-xl" />
                )}
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                {stat.title}
              </h3>
              <p className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                {stat.value}
              </p>
              <p className={`text-sm ${
                stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' :
                stat.changeType === 'decrease' ? 'text-red-600 dark:text-red-400' :
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
              className={`bg-linear-to-br from-${link.color}-500 to-${link.color}-600 text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:scale-105`}
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
              to="/student/dashboard"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.type === 'assignment' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                  activity.type === 'attendance' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  activity.type === 'achievement' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                }`}>
                  {activity.type === 'assignment' ? '📝' : 
                   activity.type === 'attendance' ? '✓' :
                   activity.type === 'achievement' ? '🏆' : '📦'}
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
            ))}
          </div>
        </div>
    </div>
  );
};
export default StudentDashboard;