import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const error = useCallback((message, duration) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const info = useCallback((message, duration) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  const warning = useCallback((message, duration) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const value = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  }), [notifications, addNotification, removeNotification, success, error, info, warning]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onClose }) => {
  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-500" />;
      case 'error': return <FaExclamationCircle className="text-red-500" />;
      case 'warning': return <FaExclamationCircle className="text-yellow-500" />;
      default: return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-500';
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-500';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-500';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg backdrop-blur-sm animate-slide-in ${getStyles(notification.type)}`}
        >
          <div className="mt-0.5">{getIcon(notification.type)}</div>
          <p className="flex-1 text-sm text-gray-800 dark:text-gray-200">
            {notification.message}
          </p>
          <button
            onClick={() => onClose(notification.id)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
