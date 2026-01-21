import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaTrash, FaCheckCircle, FaClock, FaInfoCircle } from 'react-icons/fa';

const StudentNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    setNotifications(allNotifications.reverse());
  };

  const handleDeleteNotification = (id) => {
    if (confirm('Delete this notification?')) {
      const updatedNotifications = notifications.filter(n => n.id !== id);
      localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications.reverse()));
      setNotifications(updatedNotifications);
    }
  };

  const handleMarkAsRead = (id) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
  };

  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filterType);

  const unreadCount = notifications.filter(n => !n.read).length;
  const classNotifications = notifications.filter(n => n.type === 'class').length;
  const eventNotifications = notifications.filter(n => n.type === 'event').length;
  const otherNotifications = notifications.filter(n => n.type === 'other').length;

  const getTypeStyles = (type) => {
    switch (type) {
      case 'class':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'event':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    }
  };

  const getFilterButtonStyle = (isActive) => {
    return isActive
      ? 'bg-indigo-600 text-white shadow-lg'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';
  };

  const getFilterBadgeStyle = (isActive) => {
    return isActive ? 'bg-white text-indigo-600' : 'bg-gray-300 dark:bg-gray-600';
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h1>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All notifications read'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{notifications.length}</p>
            </div>
            <FaBell className="text-3xl text-blue-400 opacity-30" />
          </div>
        </div>

        <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Unread</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{unreadCount}</p>
            </div>
            <FaClock className="text-3xl text-orange-400 opacity-30" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Class Updates</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{classNotifications}</p>
            </div>
            <FaInfoCircle className="text-3xl text-green-400 opacity-30" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Events</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{eventNotifications}</p>
            </div>
            <FaBell className="text-3xl text-purple-400 opacity-30" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap">
        {[
          { label: 'All', value: 'all', count: notifications.length },
          { label: 'Class', value: 'class', count: classNotifications },
          { label: 'Events', value: 'event', count: eventNotifications },
          { label: 'Other', value: 'other', count: otherNotifications }
        ].map(filter => (
          <button
            key={filter.value}
            onClick={() => setFilterType(filter.value)}
            className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm ${getFilterButtonStyle(filterType === filter.value)}`}
          >
            {filter.label}
            {filter.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${getFilterBadgeStyle(filterType === filter.value)}`}>
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 transition-all ${notification.read ? 'bg-white dark:bg-gray-800' : 'bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-indigo-500'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 bg-indigo-600 rounded-full shrink-0"></span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${getTypeStyles(notification.type)}`}>
                        {notification.type}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
                      {notification.sender && (
                        <span>From: {notification.sender}</span>
                      )}
                      <span>{new Date(notification.timestamp).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                        title="Mark as read"
                      >
                        <FaCheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      title="Delete notification"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaBell className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">No notifications</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;
