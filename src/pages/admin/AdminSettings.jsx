import { useState } from 'react';
import { FaSave, FaPalette, FaBell, FaLock, FaUser, FaSchool } from 'react-icons/fa';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    schoolName: 'Creative Kids Art Studio',
    email: 'info@artschool.com',
    phone: '+91 1234567890',
    address: '123 Art Street, Mumbai, India',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    enrollmentFee: 5000,
    enableNotifications: true,
    emailNotifications: true,
    autoApproveEnrollments: false,
    maxStudentsPerClass: 30
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('schoolSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your art school preferences and system settings
        </p>
      </div>

      {saved && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-xl mb-6 flex items-center justify-between">
          <span className="font-semibold">Settings saved successfully!</span>
          <button onClick={() => setSaved(false)} className="text-green-800 hover:text-green-900">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* School Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <FaSchool className="text-2xl text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              School Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                School Name
              </label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows="2"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FaPalette className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Financial Settings
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar (₹)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Default Enrollment Fee (₹)
              </label>
              <input
                type="number"
                value={settings.enrollmentFee}
                onChange={(e) => handleChange('enrollmentFee', parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Class Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FaUser className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Class Management
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Maximum Students Per Class
              </label>
              <input
                type="number"
                value={settings.maxStudentsPerClass}
                onChange={(e) => handleChange('maxStudentsPerClass', parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApproveEnrollments}
                  onChange={(e) => handleChange('autoApproveEnrollments', e.target.checked)}
                  className="w-6 h-6 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Auto-approve Enrollments
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <FaBell className="text-2xl text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                className="w-6 h-6 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <div>
                <span className="text-gray-800 dark:text-white font-medium block">
                  Enable Notifications
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications about new enrollments and messages
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="w-6 h-6 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <div>
                <span className="text-gray-800 dark:text-white font-medium block">
                  Email Notifications
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email alerts for important events
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg transform hover:scale-105"
          >
            <FaSave />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
