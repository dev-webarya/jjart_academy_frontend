import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserShield, FaUser, FaChevronDown, FaShoppingCart, FaCalendar } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import EnrollmentForm from "./EnrollmentForm";
import StudentLogin from "./auth/StudentLogin";
import StudentRegister from "./auth/StudentRegister";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
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
        ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-700/50"
        : "bg-slate-900/80 backdrop-blur-md"
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
                className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight transition-all ${scrolled
                    ? "text-gray-800 dark:text-white"
                    : "text-white"
                    }`}
                >

                </span>
                <span
                  className={`text-xs sm:text-sm font-semibold -mt-0.5 sm:-mt-1 transition-all duration-200 ${scrolled
                    ? "text-violet-600"
                    : "text-violet-300"
                    }`}
                >

                </span>
              </div>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 ml-auto">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => handleNavItemClick(item.path)}>
                <div
                  className={`px-3 py-2 font-medium text-sm xl:text-base transition-all duration-200 rounded-lg ${location.pathname === item.path
                    ? scrolled
                      ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 font-semibold"
                      : "text-white bg-white/20 font-semibold"
                    : scrolled
                      ? "text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      : "text-white hover:text-violet-300 hover:bg-white/10"
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
                className={`px-3 py-2 font-medium text-sm xl:text-base transition-all duration-200 rounded-lg flex items-center space-x-1.5 ${scrolled
                  ? "text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  : "text-white hover:text-violet-300 hover:bg-white/10"
                  }`}
              >
                <span>Shop</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${showShopDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showShopDropdown && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/shop/artworks"
                    onClick={() => { setShowShopDropdown(false); handleNavItemClick("/shop/artworks"); }}
                    className="block px-4 py-3 hover:bg-violet-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                  >
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">Student Artworks</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Student creations</p>
                  </Link>
                  <Link
                    to="/shop/materials"
                    onClick={() => { setShowShopDropdown(false); handleNavItemClick("/shop/materials"); }}
                    className="block px-4 py-3 hover:bg-violet-50 dark:hover:bg-slate-700/50 transition-colors duration-150 border-t border-slate-100 dark:border-slate-700"
                  >
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">Art Materials</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Supplies & tools</p>
                  </Link>
                </div>
              )}
            </div>
            {/* Cart Icon */}
            <Link to="/cart" className="relative group">
              <div className={`p-2.5 rounded-xl transition-all duration-200 ${scrolled
                ? "text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800"
                : "text-white hover:text-violet-300 hover:bg-white/15"
                }`}>
                <FaShoppingCart size={18} className="transition-transform duration-200 group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg shadow-pink-500/30 animate-pulse">
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
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 border ${scrolled 
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700'
                      : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user?.name?.charAt(0).toUpperCase() || <FaUser />}
                    </div>
                    <span className={`hidden sm:block font-medium text-sm ${scrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white'}`}>
                      {user?.name?.split(' ')[0] || 'Student'}
                    </span>
                    <FaChevronDown className={`text-xs transition-transform duration-200 ${showLoginDropdown ? 'rotate-180' : ''} ${scrolled ? 'text-slate-500' : 'text-white/80'}`} />
                  </button>

                  {showLoginDropdown && (
                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden z-50 border border-slate-200/80 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 bg-gradient-to-r from-violet-600 to-pink-500 text-white">
                        <p className="text-sm font-semibold truncate">{user?.name || 'Student'}</p>
                        <p className="text-xs text-white/80 truncate mt-0.5">{user?.email}</p>
                      </div>

                      <Link
                        to="/student/dashboard"
                        onClick={() => setShowLoginDropdown(false)}
                        className="w-full px-4 py-3 text-left hover:bg-violet-50 dark:hover:bg-slate-700/50 transition-colors duration-150 flex items-center space-x-3 text-slate-700 dark:text-slate-300"
                      >
                        <FaUserShield className="text-violet-500" />
                        <span className="font-medium text-sm">Student Portal</span>
                      </Link>

                      <button
                        onClick={() => {
                          setShowLoginDropdown(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 flex items-center space-x-3 text-red-600 dark:text-red-400 border-t border-slate-100 dark:border-slate-700"
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
                    className="px-5 xl:px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Register Now
                  </button>

                  {/* Login Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                      className={`px-5 xl:px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98] ${scrolled
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
                        : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'}`}
                    >
                      <span>Login</span>
                      <FaChevronDown className={`text-xs transition-transform duration-200 ${showLoginDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showLoginDropdown && (
                      <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                        <button
                          onClick={() => {
                            setShowStudentLogin(true);
                            setShowLoginDropdown(false);
                          }}
                          className="w-full px-4 py-3.5 text-left hover:bg-violet-50 dark:hover:bg-slate-700/50 transition-colors duration-150 flex items-center space-x-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                            <FaUser className="text-violet-600 dark:text-violet-400" size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white text-sm">Student Login</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Access student portal</p>
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
              className={`text-xl sm:text-2xl p-2.5 rounded-lg transition-all duration-200 ${scrolled 
                ? "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800" 
                : "text-white hover:bg-white/15"
                }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="flex flex-col p-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => handleNavItemClick(item.path)}>
                  <div
                    className={`px-4 py-2.5 text-left text-sm font-medium rounded-xl transition-all duration-150 ${location.pathname === item.path
                      ? "text-violet-600 font-semibold bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400"
                      : "text-slate-700 dark:text-slate-300 hover:text-violet-600 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                  className="w-full px-4 py-2.5 text-left text-sm font-medium rounded-xl transition-all duration-150 text-slate-700 dark:text-slate-300 hover:text-violet-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Shop</span>
                  <FaChevronDown className={`text-xs transition-transform duration-200 ${showMobileShopDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showMobileShopDropdown && (
                  <div className="space-y-1 ml-3 pl-3 border-l-2 border-violet-200 dark:border-violet-800">
                    <Link to="/shop/artworks" onClick={() => handleNavItemClick("/shop/artworks")}>
                      <div className="px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-150">
                        Student Artworks
                      </div>
                    </Link>
                    <Link to="/shop/materials" onClick={() => handleNavItemClick("/shop/materials")}>
                      <div className="px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-150">
                        Art Materials
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              {/* Cart in Mobile */}
              <Link to="/cart" onClick={handleNavClick}>
                <div className="px-4 py-2.5 text-left text-sm font-medium rounded-xl transition-all duration-150 text-slate-700 dark:text-slate-300 hover:text-violet-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between">
                  <span>Shopping Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <button
                  onClick={() => { setShowRegisterModal(true); setIsOpen(false); }}
                  className="w-full px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 active:scale-[0.98]"
                >
                  Register Now
                </button>
                {/* Login Dropdown for mobile */}
                <button
                  onClick={() => setShowMobileLoginDropdown(!showMobileLoginDropdown)}
                  className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <span>Login</span>
                  <FaChevronDown className={`text-xs transition-transform duration-200 ${showMobileLoginDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showMobileLoginDropdown && (
                  <div className="pt-1">
                    <button
                      onClick={() => { setShowStudentLogin(true); setIsOpen(false); setShowMobileLoginDropdown(false); }}
                      className="w-full px-4 py-3 bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2 border border-violet-200 dark:border-violet-800"
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
      <StudentLogin isOpen={showStudentLogin} onClose={() => setShowStudentLogin(false)} />
    </nav>
  );
};
export default Navbar;
