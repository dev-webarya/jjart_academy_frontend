import { useState, useRef, useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaCalendar, FaCertificate,
  FaSignOutAlt, FaPalette, FaBell, FaUser, FaBars, FaTimes,
  FaClipboardList, FaCog, FaChalkboardTeacher, FaVideo, FaMoneyBillWave, FaImage
} from 'react-icons/fa';

const StudentPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    navigate('/student/notifications');
  };

  const handleStudentProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleNavigateProfile = () => {
    navigate('/student/profile');
    setShowProfileDropdown(false);
  };

  const handleChangePassword = () => {
    navigate('/student/settings');
    setShowProfileDropdown(false);
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
    setShowProfileDropdown(false);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: FaHome },
    { name: 'Regular Classes', path: '/student/classes', icon: FaChalkboardTeacher },
    { name: 'Online Classes', path: '/student/online-classes', icon: FaVideo },
    { name: 'Attendance', path: '/student/attendance', icon: FaCalendar },
    { name: 'Subscriptions', path: '/student/subscriptions', icon: FaMoneyBillWave },
    { name: 'My Orders', path: '/student/orders', icon: FaClipboardList },
    { name: 'Events', path: '/student/events', icon: FaCalendar },
    { name: 'My Uploads', path: '/student/my-gallery', icon: FaImage },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Student Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-lg z-50">
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition-all"
            >
              {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FaPalette className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  Student Portal
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
              <FaBell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700" ref={profileDropdownRef}>
              <button
                onClick={handleStudentProfileClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-all"
              >
                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.name || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute top-16 right-6 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* Header with user info */}
                  <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-4">
                    <p className="font-semibold text-sm">{user?.name || 'Student'}</p>
                    <p className="text-xs text-blue-100 truncate">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={handleNavigateProfile}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all text-sm"
                    >
                      <FaUser size={16} />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={handleChangePassword}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all text-sm"
                    >
                      <FaCog size={16} />
                      <span>Update Password</span>
                    </button>

                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all text-sm border-t border-gray-200 dark:border-gray-700 mt-2 pt-2"
                    >
                      <FaSignOutAlt size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={`flex flex-1 mt-16 overflow-hidden ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Sidebar - Always Fixed */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 z-30 overflow-y-auto ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
            }`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isDropdownOpen = openDropdown === item.name;
              const hasSubmenu = item.submenu;

              return (
                <div key={item.name || item.path}>
                  {hasSubmenu ? (
                    // Dropdown Menu Item
                    <button
                      onClick={() => setOpenDropdown(isDropdownOpen ? null : item.name)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-medium ${isDropdownOpen
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                        } ${!sidebarOpen && 'lg:justify-center'}`}
                    >
                      <Icon size={20} className="shrink-0" />
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <span className={`ml-auto transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    // Regular Menu Item
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                        } ${!sidebarOpen && 'lg:justify-center'}`}
                    >
                      <Icon size={20} className="shrink-0" />
                      {sidebarOpen && (
                        <span>{item.name}</span>
                      )}
                    </Link>
                  )}

                  {/* Submenu Items */}
                  {hasSubmenu && isDropdownOpen && sidebarOpen && (
                    <div className="space-y-1 mt-2 pl-4 border-l-2 border-blue-300 dark:border-blue-700">
                      {item.submenu.map((subitem) => {
                        const SubIcon = subitem.icon;
                        const isSubActive = location.pathname === subitem.path;

                        return (
                          <Link
                            key={subitem.path}
                            to={subitem.path}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all text-sm font-medium ${isSubActive
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                              }`}
                          >
                            <SubIcon size={18} />
                            <span>{subitem.name}</span>
                          </Link>
                        );
                      })}


                    </div>
                  )}
                </div>
              );
            })}

            {/* Logout Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
              <button
                onClick={handleLogoutClick}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium ${!sidebarOpen && 'lg:justify-center'}`}
              >
                <FaSignOutAlt size={20} className="shrink-0" />
                {sidebarOpen && (
                  <span>Logout</span>
                )}
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full bg-gray-100 dark:bg-gray-900">
          <div className="p-4 md:p-8">
            <Outlet context={{ student: user }} />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentPanel;
