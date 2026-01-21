import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaUsers, FaGraduationCap, FaUserTie, FaEnvelope, 
  FaChartBar, FaCog, FaSignOutAlt, FaBars, FaTimes, FaImage, FaBell, FaPalette,
  FaCalendarCheck, FaPaintBrush, FaBoxes, FaShoppingCart, FaCalendarAlt, FaUser,
  FaChalkboardTeacher, FaVideo, FaRedo, FaTheaterMasks, FaCertificate, FaMoneyBillWave, FaUserCheck
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
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
    navigate('/admin/notifications');
  };

  const handleAdminProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleNavigateProfile = () => {
    navigate('/admin/profile');
    setShowProfileDropdown(false);
  };

  const handleChangePassword = () => {
    navigate('/admin/settings');
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileDropdown(false);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
    { 
      name: 'Students', 
      icon: FaUsers, 
      submenu: [
        { name: 'Student Management', path: '/admin/students', icon: FaUsers },
        { name: 'Attendance', path: '/admin/attendance', icon: FaCalendarCheck },
        { name: 'Fee Management', path: '/admin/fees', icon: FaMoneyBillWave }
      ]
    },
    { 
      name: 'Classes', 
      icon: FaChartBar, 
      submenu: [
        { name: 'Regular Classes', path: '/admin/classes', icon: FaChalkboardTeacher },
        { name: 'Online Classes', path: '/admin/online-classes', icon: FaVideo }
      ]
    },
    { name: 'Enrollments', path: '/admin/enrollments', icon: FaGraduationCap },
    { name: 'Certificates', path: '/admin/certificates', icon: FaCertificate },
    { name: 'Exhibitions', path: '/admin/exhibitions', icon: FaTheaterMasks },
    { name: 'Events', path: '/admin/events', icon: FaCalendarAlt },
    { name: 'Gallery', path: '/admin/gallery', icon: FaImage },
    { 
      name: 'Shop', 
      icon: FaShoppingCart, 
      submenu: [
        { name: 'Artworks', path: '/admin/shop/artworks', icon: FaPaintBrush },
        { name: 'Materials', path: '/admin/shop/materials', icon: FaBoxes }
      ]
    },
    { name: 'Orders', path: '/admin/orders', icon: FaShoppingCart },
    { name: 'Messages', path: '/admin/messages', icon: FaEnvelope },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Admin Navbar - Fixed at top */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-lg z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="h-full flex items-center justify-between px-4 md:px-6">
          {/* Left - Logo and Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg p-2 hover:shadow-lg transition-all duration-300"
            >
              {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <div className="flex items-center space-x-3">
             
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                   Admin
                </h1>
              </div>
            </div>
          </div>

          {/* Right - User Info and Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={handleAdminProfileClick}
                className="flex items-center space-x-2 md:space-x-3 pl-3 md:pl-4 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2 py-1 transition-colors"
              >
                <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || 'Administrator'}
                  </p>
                </div>
              </button>
              
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleNavigateProfile}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-gray-700 transition-all flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <FaUser className="text-purple-600" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">My Profile</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Edit your profile</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleChangePassword}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-all flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <FaCog className="text-blue-600" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">Settings</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Change password</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center space-x-3"
                  >
                    <FaSignOutAlt className="text-red-600" size={18} />
                    <div>
                      <p className="font-semibold text-red-600 dark:text-red-400 text-sm">Logout</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Sign out</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout Container - Flexbox */}
      <div className={`flex flex-1 mt-16 overflow-hidden ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Sidebar - Always Fixed */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 overflow-y-auto shadow-lg ${
            sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
          }`}
        >
          {/* Menu Items */}
          <nav className="p-4 space-y-1">
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
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium ${
                        isDropdownOpen
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium ${
                        isActive
                          ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                    <div className="space-y-1 mt-2 pl-4 border-l-2 border-purple-300 dark:border-purple-700">
                      {item.submenu.map((subitem) => {
                        const SubIcon = subitem.icon;
                        const isSubActive = location.pathname === subitem.path;
                        
                        return (
                          <Link
                            key={subitem.path}
                            to={subitem.path}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                              isSubActive
                                ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
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

            {/* Logout */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 font-medium ${!sidebarOpen && 'lg:justify-center'}`}
              >
                <FaSignOutAlt size={20} className="shrink-0" />
                {sidebarOpen && (
                  <span>Logout</span>
                )}
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area - Flexible and Responsive */}
        <main className="flex-1 overflow-y-auto w-full bg-gray-50 dark:bg-gray-900">
          <div className="p-4 md:p-8">
            <Outlet />
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

export default AdminPanel;
