import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaBook, FaUser, FaCalendar, FaClock, FaChartBar, FaDownload, FaPlay } from 'react-icons/fa';

const MyClasses = () => {
  const { student } = useOutletContext();
  const [classes] = useState([
    {
      id: 1,
      name: 'Watercolor Painting',
      instructor: 'Priya Sharma',
      image: 'https://via.placeholder.com/300x200?text=Watercolor',
      schedule: 'Mon, Wed 4:00 PM',
      duration: '1.5 hours',
      startDate: '2024-01-10',
      progress: 75,
      enrolled: '2024-01-10',
      status: 'active',
      totalClasses: 20,
      attendedClasses: 15,
      nextClass: '2026-01-14 at 4:00 PM',
    },
    {
      id: 2,
      name: 'Digital Art Fundamentals',
      instructor: 'Raj Kumar',
      image: 'https://via.placeholder.com/300x200?text=Digital+Art',
      schedule: 'Tue, Thu 5:00 PM',
      duration: '2 hours',
      startDate: '2024-02-01',
      progress: 60,
      enrolled: '2024-02-01',
      status: 'active',
      totalClasses: 16,
      attendedClasses: 10,
      nextClass: '2026-01-15 at 5:00 PM',
    },
    {
      id: 3,
      name: 'Clay Modeling & Sculpture',
      instructor: 'Ananya Desai',
      image: 'https://via.placeholder.com/300x200?text=Clay',
      schedule: 'Fri 3:00 PM',
      duration: '1.5 hours',
      startDate: '2024-03-01',
      progress: 40,
      enrolled: '2024-03-01',
      status: 'active',
      totalClasses: 12,
      attendedClasses: 5,
      nextClass: '2026-01-17 at 3:00 PM',
    },
  ]);

  const activeClasses = classes.filter(c => c.status === 'active').length;
  const totalProgress = Math.round(classes.reduce((sum, c) => sum + c.progress, 0) / classes.length);
  const totalAttendance = Math.round((classes.reduce((sum, c) => sum + c.attendedClasses, 0) / classes.reduce((sum, c) => sum + c.totalClasses, 0)) * 100);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Classes</h1>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Track your enrolled classes and progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700/30">
          <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Enrolled Classes</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{classes.length}</p>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700/30">
          <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeClasses}</p>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700/30">
          <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Avg Progress</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalProgress}%</p>
        </div>

        <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700/30">
          <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Avg Attendance</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalAttendance}%</p>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {classes.map(classItem => (
          <div
            key={classItem.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="relative h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src={classItem.image}
                alt={classItem.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              <span className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold bg-green-600 dark:bg-green-500 text-white">
                {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                  {classItem.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <FaUser size={12} />
                  <span>{classItem.instructor}</span>
                </div>
              </div>

              {/* Class Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaCalendar size={12} className="text-indigo-600 dark:text-indigo-400" />
                  <span>{classItem.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaClock size={12} className="text-blue-600 dark:text-blue-400" />
                  <span>{classItem.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaChartBar size={12} className="text-purple-600 dark:text-purple-400" />
                  <span>Attended: {classItem.attendedClasses}/{classItem.totalClasses}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{classItem.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 transition-all"
                    style={{ width: `${classItem.progress}%` }}
                  />
                </div>
              </div>

              {/* Next Class */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg border border-indigo-200 dark:border-indigo-700/30">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Next class:</span> {classItem.nextClass}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all flex items-center justify-center gap-1 text-sm font-medium">
                  <FaPlay size={12} />
                  <span>Join</span>
                </button>
                <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  <FaDownload size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {classes.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <FaBook className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">No Classes Enrolled</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Enroll in classes to start learning!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyClasses;
