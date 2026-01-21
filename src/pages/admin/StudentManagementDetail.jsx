import { useState, useEffect } from 'react';
import { 
  FaUser, FaCheck, FaTimes, FaCalendar, FaChartLine, 
  FaImage, FaComments, FaWhatsapp, FaEnvelope, FaPhone,
  FaArrowLeft
} from 'react-icons/fa';

const StudentManagementDetail = ({ student, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [attendance, setAttendance] = useState([]);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    // Load attendance data
    const attendanceData = [
      { id: 1, date: '2024-12-01', class: 'Watercolor Painting', status: 'present' },
      { id: 2, date: '2024-12-03', class: 'Digital Art', status: 'present' },
      { id: 3, date: '2024-12-05', class: 'Clay Modeling', status: 'absent' },
      { id: 4, date: '2024-12-07', class: 'Watercolor Painting', status: 'present' },
    ];
    setAttendance(attendanceData);

    // Load artworks
    const studentArtworks = [
      { id: 1, title: 'Sunset Watercolor', uploadDate: '2024-12-01', rating: 4.5 },
      { id: 2, title: 'Digital Portrait', uploadDate: '2024-12-03', rating: 4.8 },
    ];
    setArtworks(studentArtworks);
  }, [student]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FaChartLine },
    { id: 'details', name: 'Student Details', icon: FaUser },
    { id: 'artwork', name: 'Upload Artwork', icon: FaImage },
    { id: 'analysis', name: 'Art Analysis', icon: FaChartLine },
    { id: 'communication', name: 'Communication', icon: FaComments },
    { id: 'attendance', name: 'Attendance', icon: FaCalendar },
  ];

  const attendanceStats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    percentage: Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100) || 0
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4"
        >
          <FaArrowLeft />
          <span>Back to Students List</span>
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-linear-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-4xl">
              {student.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {student.name}
              </h2>
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-2">
                  <FaUser />
                  <span>Age: {student.age}</span>
                </span>
                <span>•</span>
                <span>Class: {student.class}</span>
                <span>•</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ₹{
                  student.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {student.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ₹{
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
                }`}
              >
                <Icon />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Student Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Classes</p>
                <p className="text-3xl font-bold text-blue-600">{attendanceStats.total}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Present</p>
                <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Absent</p>
                <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Attendance</p>
                <p className="text-3xl font-bold text-purple-600">{attendanceStats.percentage}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Recent Artworks</h4>
                <div className="space-y-2">
                  {artworks.map(art => (
                    <div key={art.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-800 dark:text-white">{art.title}</span>
                      <span className="text-yellow-600">★ {art.rating}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Creativity</span>
                      <span className="text-gray-800 dark:text-white">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-linear-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Technical Skills</span>
                      <span className="text-gray-800 dark:text-white">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-linear-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Participation</span>
                      <span className="text-gray-800 dark:text-white">{attendanceStats.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-linear-to-r from-green-600 to-blue-600 h-2 rounded-full" style={{ width: `₹{attendanceStats.percentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Student Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <p className="text-gray-800 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{student.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age</label>
                <p className="text-gray-800 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{student.age}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <p className="text-gray-800 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{student.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <p className="text-gray-800 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{student.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Parent Name</label>
                <p className="text-gray-800 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{student.parentName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Emergency Contact</label>
                <p className="text-gray-800 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{student.emergencyContact}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <p className="text-gray-800 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{student.address}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'artwork' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Upload Student Artwork</h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
              <FaImage className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-600 dark:text-gray-400 mb-4">Drag and drop artwork here or click to browse</p>
              <button className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold">
                Select Files
              </button>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Uploaded Artworks</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {artworks.map(art => (
                  <div key={art.id} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                    <div className="w-full h-32 bg-gray-300 dark:bg-gray-600 rounded-lg mb-2"></div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{art.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{art.uploadDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Art Analysis & Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Overall Rating</h4>
                <p className="text-5xl font-bold text-purple-600 mb-2">4.7/5</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Based on 12 artworks</p>
              </div>
              <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Improvement</h4>
                <p className="text-5xl font-bold text-blue-600 mb-2">+25%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last 3 months</p>
              </div>
              <div className="bg-linear-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Achievements</h4>
                <p className="text-5xl font-bold text-green-600 mb-2">7</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Badges earned</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Strengths & Areas for Improvement</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <h5 className="font-semibold text-green-800 dark:text-green-400 mb-2">✓ Strengths</h5>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Excellent color theory understanding</li>
                    <li>• Creative composition skills</li>
                    <li>• Consistent attendance</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                  <h5 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">→ Areas to Improve</h5>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Perspective drawing techniques</li>
                    <li>• Shading and depth</li>
                    <li>• Time management on projects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Communication Center</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <a
                href={`mailto:₹{student.email}`}
                className="flex items-center space-x-3 p-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <FaEnvelope size={24} />
                <div>
                  <p className="font-semibold">Send Email</p>
                  <p className="text-sm opacity-90">{student.email}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/₹{student.phone?.replace(/[^0-9]/g, '')}?text=Hello ₹{student.name}, `}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 bg-linear-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all"
              >
                <FaWhatsapp size={24} />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm opacity-90">{student.phone}</p>
                </div>
              </a>

              <a
                href={`tel:₹{student.phone}`}
                className="flex items-center space-x-3 p-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                <FaPhone size={24} />
                <div>
                  <p className="font-semibold">Call</p>
                  <p className="text-sm opacity-90">{student.phone}</p>
                </div>
              </a>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Communication History</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-600 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-r-lg">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">Email sent - Progress Report</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">2 days ago</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-r-lg">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">WhatsApp - Reminder for class</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">5 days ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Attendance Record</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{attendanceStats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{attendanceStats.percentage}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Class</th>
                    <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 text-gray-800 dark:text-white">{new Date(record.date).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-white">{record.class}</td>
                      <td className="py-3 px-4 text-center">
                        {record.status === 'present' ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-semibold">
                            <FaCheck size={12} />
                            <span>Present</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-semibold">
                            <FaTimes size={12} />
                            <span>Absent</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagementDetail;
