import { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaClock, FaCalendar, FaUser, FaRupeeSign, FaSearch, FaGraduationCap, FaBook, FaEye } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
const RegularClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, beginner, intermediate, advanced
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    setLoading(true);
    try {
      // Get all regular classes from localStorage
      const savedClasses = localStorage.getItem('regularClasses');
      let allClasses = [];
      
      if (savedClasses) {
        allClasses = JSON.parse(savedClasses);
      } else {
        // Default mock data if not in localStorage
        allClasses = [
          { id: 1, name: 'Drawing Basics', instructor: 'Priya Sharma', students: 25, duration: '8 weeks', level: 'Beginner', status: 'Active', price: 5000, schedule: 'Mon, Wed 4-6 PM', description: 'Learn fundamental drawing techniques, shading, and perspective.' },
          { id: 2, name: 'Watercolor Painting', instructor: 'Raj Kumar', students: 20, duration: '10 weeks', level: 'Intermediate', status: 'Active', price: 6000, schedule: 'Tue, Thu 4-6 PM', description: 'Master watercolor techniques, blending, and color theory.' },
          { id: 3, name: 'Acrylic Art', instructor: 'Ananya Desai', students: 18, duration: '12 weeks', level: 'Advanced', status: 'Active', price: 7000, schedule: 'Wed, Fri 5-7 PM', description: 'Advanced acrylic painting with focus on composition and style.' },
          { id: 4, name: 'Clay Modeling', instructor: 'Arjun Mehta', students: 22, duration: '6 weeks', level: 'Beginner', status: 'Active', price: 4500, schedule: 'Sat 10AM-12PM', description: 'Explore 3D art through clay modeling and sculpture.' },
          { id: 5, name: 'Digital Art', instructor: 'Neha Patel', students: 15, duration: '10 weeks', level: 'Intermediate', status: 'Active', price: 8000, schedule: 'Sun 2-4 PM', description: 'Create digital artwork using modern design tools and software.' },
          { id: 6, name: 'Craft Making', instructor: 'Priya Sharma', students: 28, duration: '8 weeks', level: 'Beginner', status: 'Active', price: 4000, schedule: 'Mon, Fri 3-5 PM', description: 'Learn various craft techniques and create beautiful handmade items.' },
          { id: 7, name: 'Comic Creation', instructor: 'Raj Kumar', students: 16, duration: '12 weeks', level: 'Advanced', status: 'Active', price: 7500, schedule: 'Tue, Thu 5-7 PM', description: 'Develop storytelling and illustration skills for comic art.' },
          { id: 8, name: 'Portrait Drawing', instructor: 'Ananya Desai', students: 14, duration: '10 weeks', level: 'Intermediate', status: 'Active', price: 6500, schedule: 'Sat 2-4 PM', description: 'Master portrait techniques, proportions, and facial features.' },
          { id: 9, name: 'Oil Painting Masterclass', instructor: 'Vikram Singh', students: 12, duration: '14 weeks', level: 'Advanced', status: 'Active', price: 9500, schedule: 'Thu, Sun 3-6 PM', description: 'Master the art of oil painting with advanced techniques, color mixing, glazing, and creating stunning realistic artworks.' },
        ];
        localStorage.setItem('regularClasses', JSON.stringify(allClasses));
      }

      // Get student's enrolled classes from enrollment data
      // Using mock data - in production this would come from API
      const studentEnrollments = [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', enrolledClasses: [1, 9], status: 'active' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', enrolledClasses: [1, 3], status: 'active' },
        { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', enrolledClasses: [1, 4], status: 'active' },
        { id: 4, name: 'Diana Prince', email: 'diana@example.com', enrolledClasses: [2, 3], status: 'active' },
        { id: 5, name: 'Emma Watson', email: 'emma@example.com', enrolledClasses: [1, 2], status: 'active' },
      ];
      // Find current student's enrollment (using user.id from AuthContext)
      const currentStudent = studentEnrollments.find(s => s.id === (user?.id || 1));
      
      if (currentStudent && currentStudent.enrolledClasses) {
        // Filter classes to show only enrolled ones
        const enrolledClasses = allClasses.filter(c => 
          currentStudent.enrolledClasses.includes(c.id) && c.status === 'Active'
        );
        setClasses(enrolledClasses);
      } else {
        // If no enrollment found, show empty array
        setClasses([]);
      }
    } catch (error) {
      console.error('Error loading regular classes:', error);
    } finally {
      setLoading(false);
    }
  };
  const getFilteredClasses = () => {
    let filtered = classes.filter(c => c.status === 'Active');

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply level filter
    if (filter !== 'all') {
      filtered = filtered.filter(c => c.level.toLowerCase() === filter.toLowerCase());
    }

    return filtered;
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleViewDetails = (classItem) => {
    setSelectedClass(classItem);
    setShowDetailsModal(true);
  };

  const filteredClasses = getFilteredClasses();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading regular classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          
          <div>
            <h1 className="text-3xl font-bold">My Regular Classes</h1>
            <p className="text-blue-100 mt-1">View your enrolled art classes</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">My Classes</p>
            <p className="text-2xl font-bold">{classes.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Total Instructors</p>
            <p className="text-2xl font-bold">
              {[...new Set(classes.map(c => c.instructor))].length}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">Total Duration</p>
            <p className="text-2xl font-bold">
              {classes.reduce((sum, c) => sum + parseInt(c.duration), 0)} weeks
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your enrolled classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('beginner')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'beginner'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setFilter('intermediate')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'intermediate'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setFilter('advanced')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'advanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {filteredClasses.length === 0 ? (
          <div className="p-8 text-center">
            <FaChalkboardTeacher className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No enrolled classes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search criteria' : 'You are not enrolled in any classes yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredClasses.map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 dark:text-white">{classItem.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 dark:text-gray-300">{classItem.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        classItem.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        classItem.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {classItem.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {classItem.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {classItem.schedule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {classItem.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        ₹{classItem.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(classItem)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedClass.name}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(selectedClass.level)}`}>
                    {selectedClass.level}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Enrolled
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400">{selectedClass.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-purple-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedClass.instructor}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaCalendar className="text-green-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Schedule</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedClass.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaClock className="text-orange-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedClass.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaGraduationCap className="text-blue-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedClass.students} Enrolled</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaRupeeSign className="text-green-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-bold text-lg text-purple-600 dark:text-purple-400">
                        ₹{selectedClass.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegularClasses;
