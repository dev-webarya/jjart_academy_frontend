import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserShield, FaUser, FaChevronDown, FaShoppingCart, FaCalendar } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import EnrollmentForm from "./EnrollmentForm";
import AdminLogin from "./auth/AdminLogin";
import StudentLogin from "./auth/StudentLogin";
import StudentRegister from "./auth/StudentRegister";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showMobileShopDropdown, setShowMobileShopDropdown] = useState(false);
  const [showMobileLoginDropdown, setShowMobileLoginDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const shopDropdownRef = useRef(null);
  const { cartCount } = useCart();
  const { isStudent, user, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLoginDropdown(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
        setShowShopDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleNavItemClick = (path) => {
    handleNavClick();
    if (location.pathname === path) {
      window.scrollTo(0, 0);
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Classes", path: "/classes" },
    { name: "Exhibitions", path: "/exhibitions" },
    { name: "Gallery", path: "/gallery" },
    { name: "Fee Payment", path: "/fee-payment" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg "
        : "bg-transparent  "
        }`}
    >
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" onClick={handleNavClick} className="mr-auto lg:mr-8">
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
              <img
                src="/logo.png"
                alt=" Logo"
                className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-all group-hover:scale-110"
              />
              <div className="flex flex-col">
                <span
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight transition-all ${scrolled
                    ? "text-gray-800 dark:text-white"
                    : "text-white drop-shadow-lg"
                    }`}
                >

                </span>
                <span
                  className={`text-xs sm:text-sm font-semibold -mt-0.5 sm:-mt-1 transition-all ${scrolled
                    ? "text-purple-600"
                    : "text-yellow-300 drop-shadow-lg"
                    }`}
                >

                </span>
              </div>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 ml-auto">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => handleNavItemClick(item.path)}>
                <div
                  className={`font-medium text-sm xl:text-base transition-all ${location.pathname === item.path
                    ? scrolled
                      ? "text-purple-600 dark:text-purple-400 font-bold scale-105"
                      : "text-yellow-300 font-bold scale-105"
                    : scrolled
                      ? "text-gray-700 dark:text-gray-300 hover:text-purple-600"
                      : "text-white hover:text-yellow-200"
                    }`}
                >
                  {item.name}
                </div>
              </Link>
            ))}
            {/* Shop Dropdown */}
            <div className="relative" ref={shopDropdownRef}>
              <button
                onClick={() => setShowShopDropdown(!showShopDropdown)}
                className={`font-medium text-sm xl:text-base transition-all flex items-center space-x-1 ${scrolled
                  ? "text-gray-700 dark:text-gray-300 hover:text-purple-600"
                  : "text-white hover:text-yellow-200"
                  }`}
              >
                <span>Shop</span>
                <FaChevronDown className={`text-xs transition-transform ${showShopDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showShopDropdown && (
                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                  <Link
                    to="/shop/artworks"
                    onClick={() => { setShowShopDropdown(false); handleNavItemClick("/shop/artworks"); }}
                    className="block px-4 py-3 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">Student Artworks</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Student creations</p>
                  </Link>
                  <Link
                    to="/shop/materials"
                    onClick={() => { setShowShopDropdown(false); handleNavItemClick("/shop/materials"); }}
                    className="block px-4 py-3 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all border-t border-gray-200 dark:border-gray-700"
                  >
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">Art Materials</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Supplies & tools</p>
                  </Link>
                </div>
              )}
            </div>
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <div className={`p-2 rounded-full transition-all ${scrolled
                ? "text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700"
                : "text-white hover:text-yellow-200 hover:bg-white/10"
                }`}>
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
            {/* CTA Buttons */}
            {/* CTA Buttons */}
            <div className="flex items-center space-x-2 xl:space-x-3">
              {/* Authenticated Student View */}
              {isStudent && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/20"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || <FaUser />}
                    </div>
                    <span className={`hidden sm:block font-medium ${scrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}>
                      {user?.name?.split(' ')[0] || 'Student'}
                    </span>
                    <FaChevronDown className={`text-xs transition-transform ${showLoginDropdown ? 'rotate-180' : ''} ${scrolled ? 'text-gray-600' : 'text-white/80'}`} />
                  </button>

                  {showLoginDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in border border-gray-100 dark:border-gray-700">
                      <div className="px-4 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white">
                        <p className="text-sm font-bold truncate">{user?.name || 'Student'}</p>
                        <p className="text-xs opacity-90 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/student/dashboard"
                        onClick={() => setShowLoginDropdown(false)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                      >
                        <FaUserShield className="text-purple-500" />
                        <span className="font-medium text-sm">Student Portal</span>
                      </Link>

                      <button
                        onClick={() => {
                          setShowLoginDropdown(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center space-x-3 text-red-600 dark:text-red-400 border-t border-gray-100 dark:border-gray-700"
                      >
                        <FaTimes className="text-red-500" />
                        <span className="font-medium text-sm">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Guest View */}
              {!isStudent && (
                <>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-4 xl:px-6 py-2 xl:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-sm xl:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Register Now
                  </button>

                  {/* Login Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                      className="px-4 xl:px-6 py-2 xl:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-sm xl:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
                    >
                      <span>Login</span>
                      <FaChevronDown className={`text-xs transition-transform ${showLoginDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showLoginDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                        <button
                          onClick={() => {
                            setShowAdminLogin(true);
                            setShowLoginDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-gray-700 transition-all flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700"
                        >
                          <FaUserShield className="text-purple-600" size={20} />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white text-sm">Admin Login</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Access admin panel</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setShowStudentLogin(true);
                            setShowLoginDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-all flex items-center space-x-3"
                        >
                          <FaUser className="text-blue-600" size={20} />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white text-sm">Student Login</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Access student portal</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`text-xl sm:text-2xl p-2 ${scrolled ? "text-gray-800 dark:text-white" : "text-white"
                }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="flex flex-col p-2 sm:p-3 space-y-1 sm:space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => handleNavItemClick(item.path)}>
                  <div
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 text-left text-sm sm:text-base font-medium rounded-lg transition-all ${location.pathname === item.path
                      ? "text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              {/* Shop Dropdown in Mobile */}
              <div className="space-y-1">
                <button
                  onClick={() => setShowMobileShopDropdown(!showMobileShopDropdown)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-sm sm:text-base font-medium rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  <span>Shop</span>
                  <FaChevronDown className={`text-xs transition-transform ${showMobileShopDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showMobileShopDropdown && (
                  <div className="space-y-1 pl-2">
                    <Link to="/shop/artworks" onClick={() => handleNavItemClick("/shop/artworks")}>
                      <div className="px-5 sm:px-6 py-1.5 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all">
                        Student Artworks
                      </div>
                    </Link>
                    <Link to="/shop/materials" onClick={() => handleNavItemClick("/shop/materials")}>
                      <div className="px-5 sm:px-6 py-1.5 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all">
                        Art Materials
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              {/* Cart in Mobile */}
              <Link to="/cart" onClick={handleNavClick}>
                <div className="px-3 sm:px-4 py-2 sm:py-2.5 text-left text-sm sm:text-base font-medium rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
                  <span>Shopping Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              <button
                onClick={() => { setShowRegisterModal(true); setIsOpen(false); }}
                className="w-full mt-1 px-4 sm:px-6 py-2 sm:py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                Register Now
              </button>
              {/* Login Dropdown for mobile */}
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => setShowMobileLoginDropdown(!showMobileLoginDropdown)}
                  className="w-full px-4 sm:px-6 py-2 sm:py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <span>Login</span>
                  <FaChevronDown className={`text-xs transition-transform ${showMobileLoginDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showMobileLoginDropdown && (
                  <div className="space-y-2">
                    <button
                      onClick={() => { setShowAdminLogin(true); setIsOpen(false); setShowMobileLoginDropdown(false); }}
                      className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                    >
                      <FaUserShield size={14} />
                      <span>Admin Login</span>
                    </button>

                    <button
                      onClick={() => { setShowStudentLogin(true); setIsOpen(false); setShowMobileLoginDropdown(false); }}
                      className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                    >
                      <FaUser size={14} />
                      <span>Student Login</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      <EnrollmentForm isOpen={showEnrollForm} onClose={() => setShowEnrollForm(false)} />
      <StudentRegister
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onLoginClick={() => {
          setShowRegisterModal(false);
          setShowStudentLogin(true);
        }}
      />
      <AdminLogin isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
      <StudentLogin isOpen={showStudentLogin} onClose={() => setShowStudentLogin(false)} />
    </nav>
  );
};
export default Navbar;
