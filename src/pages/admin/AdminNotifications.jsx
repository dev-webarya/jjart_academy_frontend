import { useState, useEffect } from 'react';
import { FaBell, FaTrash, FaPlus, FaTimes, FaUser, FaUsers } from 'react-icons/fa';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showIndividualForm, setShowIndividualForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Individual notification form
  const [individualForm, setIndividualForm] = useState({
    studentId: '',
    title: '',
    message: '',
    type: 'info' // info, warning, success, error
  });

  // Bulk notification form
  const [bulkForm, setBulkForm] = useState({
    recipientType: 'all', // all, class, specific
    className: '',
    title: '',
    message: '',
    type: 'info'
  });

  // Load notifications from localStorage
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const savedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    setNotifications(savedNotifications);
  };

  const getStudentName = (studentId) => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === studentId);
    return student?.name || `Student ₹{studentId}`;
  };

  const handleSendIndividual = () => {
    if (!individualForm.studentId || !individualForm.title || !individualForm.message) {
      alert('Please fill all fields');
      return;
    }

    const newNotification = {
      id: Date.now(),
      type: 'individual',
      recipientType: 'student',
      recipientId: individualForm.studentId,
      recipientName: getStudentName(individualForm.studentId),
      title: individualForm.title,
      message: individualForm.message,
      notificationType: individualForm.type,
      createdAt: new Date().toLocaleString('en-IN'),
      status: 'sent'
    };

    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));

    // Reset form
    setIndividualForm({
      studentId: '',
      title: '',
      message: '',
      type: 'info'
    });
    setShowIndividualForm(false);
    alert('Notification sent successfully!');
  };

  const handleSendBulk = () => {
    if (!bulkForm.title || !bulkForm.message) {
      alert('Please fill all fields');
      return;
    }

    let recipients = [];

    if (bulkForm.recipientType === 'all') {
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      recipients = students.map(s => ({ id: s.id, name: s.name }));
    } else if (bulkForm.recipientType === 'class') {
      const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
      const classEnrollments = enrollments.filter(e => e.className === bulkForm.className);
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      recipients = classEnrollments.map(e => {
        const student = students.find(s => s.id === e.studentId);
        return { id: e.studentId, name: student?.name || e.studentName };
      });
    }

    if (recipients.length === 0) {
      alert('No students found');
      return;
    }

    const newNotification = {
      id: Date.now(),
      type: 'bulk',
      recipientType: bulkForm.recipientType,
      className: bulkForm.className || 'सभी',
      recipients: recipients,
      title: bulkForm.title,
      message: bulkForm.message,
      notificationType: bulkForm.type,
      createdAt: new Date().toLocaleString('hi-IN'),
      status: 'sent',
      recipientCount: recipients.length
    };

    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));

    // Reset form
    setBulkForm({
      recipientType: 'all',
      className: '',
      title: '',
      message: '',
      type: 'info'
    });
    setShowBulkForm(false);
    alert(`Notification sent to ₹{recipients.length} students!`);
  };

  const handleDeleteNotification = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      localStorage.setItem('adminNotifications', JSON.stringify(updated));
    }
  };

  const getNotificationColor = (type) => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300',
      success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300'
    };
    return colors[type] || colors.info;
  };

  const getIconColor = (type) => {
    const colors = {
      info: 'text-blue-600',
      warning: 'text-yellow-600',
      success: 'text-green-600',
      error: 'text-red-600'
    };
    return colors[type] || colors.info;
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const allClasses = [...new Set(JSON.parse(localStorage.getItem('enrollments') || '[]').map(e => e.className))];
  const allStudents = JSON.parse(localStorage.getItem('students') || '[]');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <div className="p-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg text-white">
              <FaBell size={28} />
            </div>
            Manage Notifications
          </h1>
        </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">Send individual and bulk notifications to students</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => {
              setShowIndividualForm(true);
              setShowBulkForm(false);
            }}
            className="p-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 font-semibold"
          >
            <FaUser size={20} />
            Send Individual Notification
          </button>
          <button
            onClick={() => {
              setShowBulkForm(true);
              setShowIndividualForm(false);
            }}
            className="p-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 font-semibold"
          >
            <FaUsers size={20} />
            Send Bulk Notification
          </button>
        </div>

        {/* Individual Notification Form */}
        {showIndividualForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Individual Notification</h2>
              <button
                onClick={() => setShowIndividualForm(false)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Student
                </label>
                <select
                  value={individualForm.studentId}
                  onChange={(e) => setIndividualForm({ ...individualForm, studentId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Student --</option>
                  {allStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} (ID: {student.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  value={individualForm.title}
                  onChange={(e) => setIndividualForm({ ...individualForm, title: e.target.value })}
                  placeholder="e.g., Class Cancelled"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={individualForm.message}
                  onChange={(e) => setIndividualForm({ ...individualForm, message: e.target.value })}
                  placeholder="Write detailed message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notification Type
                </label>
                <select
                  value={individualForm.type}
                  onChange={(e) => setIndividualForm({ ...individualForm, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSendIndividual}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Send
                </button>
                <button
                  onClick={() => setShowIndividualForm(false)}
                  className="flex-1 px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Notification Form */}
        {showBulkForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bulk Notification</h2>
              <button
                onClick={() => setShowBulkForm(false)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Recipients
                </label>
                <select
                  value={bulkForm.recipientType}
                  onChange={(e) => setBulkForm({ ...bulkForm, recipientType: e.target.value, className: '' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Students</option>
                  <option value="class">Specific Class</option>
                </select>
              </div>

              {bulkForm.recipientType === 'class' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select Class
                  </label>
                  <select
                    value={bulkForm.className}
                    onChange={(e) => setBulkForm({ ...bulkForm, className: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Select Class --</option>
                    {allClasses.map(cls => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  value={bulkForm.title}
                  onChange={(e) => setBulkForm({ ...bulkForm, title: e.target.value })}
                  placeholder="e.g., New Class Schedule"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={bulkForm.message}
                  onChange={(e) => setBulkForm({ ...bulkForm, message: e.target.value })}
                  placeholder="Will be sent to all selected students"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notification Type
                </label>
                <select
                  value={bulkForm.type}
                  onChange={(e) => setBulkForm({ ...bulkForm, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSendBulk}
                  className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Send
                </button>
                <button
                  onClick={() => setShowBulkForm(false)}
                  className="flex-1 px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-300 dark:border-gray-700">
          {['all', 'individual', 'bulk'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ₹{
                activeTab === tab
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'all' ? 'All Notifications' : tab === 'individual' ? 'Individual' : 'Bulk'}
              <span className="ml-2 text-sm">({filteredNotifications.length})</span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <FaBell size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No notifications yet</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border-l-4 ₹{getNotificationColor(notification.notificationType)} transition-all hover:shadow-lg dark:bg-gray-800`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ₹{getNotificationColor(notification.notificationType)}`}>
                      <FaBell className={getIconColor(notification.notificationType)} size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 text-gray-800 dark:text-white">
                        {notification.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>📅 {notification.createdAt}</span>
                        {notification.type === 'individual' && (
                          <span>👤 {notification.recipientName}</span>
                        )}
                        {notification.type === 'bulk' && (
                          <>
                            <span>👥 {notification.recipientCount} students</span>
                            <span>📚 {notification.className}</span>
                          </>
                        )}
                        <span className="bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                          ✓ {notification.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  );
};

export default AdminNotifications;
