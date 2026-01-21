import { useState } from 'react';
import { FaChartBar, FaDownload, FaCalendar, FaShoppingCart, FaUsers, FaArrowUp } from 'react-icons/fa';

const AdminReports = () => {
  const [reportType, setReportType] = useState('attendance'); // attendance, revenue, inventory, students

  const reportData = {
    attendance: {
      icon: FaCalendar,
      color: 'from-blue-600 to-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      description: 'Track student attendance patterns and trends'
    },
    revenue: {
      icon: FaShoppingCart,
      color: 'from-green-600 to-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      description: 'Monitor revenue streams and financial performance'
    },
    inventory: {
      icon: FaChartBar,
      color: 'from-orange-600 to-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
      description: 'Manage inventory levels and stock movements'
    },
    students: {
      icon: FaUsers,
      color: 'from-purple-600 to-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      description: 'View student enrollment and demographics'
    }
  };

  const currentReport = reportData[reportType];
  const CurrentIcon = currentReport.icon;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Comprehensive insights and data analysis</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
          <FaDownload />
          <span>Export Report</span>
        </button>
      </div>

      {/* Tab Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
        {Object.entries(reportData).map(([key, data]) => {
          const Icon = data.icon;
          return (
            <button
              key={key}
              onClick={() => setReportType(key)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                reportType === key 
                  ? `bg-linear-to-r ${data.color} text-white shadow-lg` 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Icon className="inline mr-2" />
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            </button>
          );
        })}
      </div>

      {/* Main Report Section */}
      <div className={`${currentReport.bgColor} p-12 rounded-2xl text-center shadow-xl border-2 border-opacity-20`}>
        <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-2xl mb-6 shadow-lg transform hover:scale-110 transition-all">
          <CurrentIcon className={`text-6xl ${currentReport.iconColor}`} />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Reports
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          {currentReport.description}
        </p>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <FaArrowUp className="text-green-600 text-2xl" />
              <span className="text-4xl font-bold text-gray-800 dark:text-white">85%</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Growth Rate</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            <p className="text-4xl font-bold text-gray-800 dark:text-white mb-2">1,245</p>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Total Records</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            <p className="text-4xl font-bold text-gray-800 dark:text-white mb-2">94%</p>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Completion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
