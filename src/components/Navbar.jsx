import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserShield, FaUser, FaChevronDown, FaShoppingCart, FaCalendar } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";
import { useCart } from "../context/CartContext";
import EnrollmentForm from "./EnrollmentForm";
import AdminLogin from "./auth/AdminLogin";
import StudentLogin from "./auth/StudentLogin";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const shopDropdownRef = useRef(null);
  const { cartCount } = useCart();
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
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg " 
          : "bg-transparent  "
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={handleNavClick} className="mr-12 lg:mr-8">
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
              <img 
                src="/logo.png" 
                alt=" Logo" 
                className="h-16 sm:h-20 md:h-25 w-auto object-contain transition-all group-hover:scale-110"
              />
              <div className="flex flex-col">
                <span
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight transition-all ${
                    scrolled 
                      ? "text-gray-800 dark:text-white" 
                      : "text-white drop-shadow-lg"
                  }`}
                >
                  
                </span>
                <span
                  className={`text-xs sm:text-sm font-semibold -mt-0.5 sm:-mt-1 transition-all ${
                    scrolled 
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
                  className={`font-medium text-sm xl:text-base transition-all ${
                    location.pathname === item.path
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
                className={`font-medium text-sm xl:text-base transition-all flex items-center space-x-1 ${
                  scrolled
                    ? "text-gray-700 dark:text-gray-300 hover:text-purple-600"
                    : "text-white hover:text-yellow-200"
                }`}
              >
                <span>Shop</span>
                <FaChevronDown className={`text-xs transition-transform ${showShopDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showShopDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                  <Link
                    to="/shop/materials"
                    onClick={() => { setShowShopDropdown(false); handleNavItemClick("/shop/materials"); }}
                    className="block px-4 py-3 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">Art Materials</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Supplies & tools</p>
                  </Link>
                  <Link
                    to="/shop/artworks"
                    onClick={() => { setShowShopDropdown(false); handleNavItemClick("/shop/artworks"); }}
                    className="block px-4 py-3 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all border-t border-gray-200 dark:border-gray-700"
                  >
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">Artworks</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Student creations</p>
                  </Link>
                </div>
              )}
            </div>
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <div className={`p-2 rounded-full transition-all ${
                scrolled 
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
            <div className="flex items-center space-x-2 xl:space-x-3">
              <button 
                onClick={() => setShowEnrollForm(true)}
                className="px-4 xl:px-6 py-2 xl:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-sm xl:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Enroll Now
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
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`text-xl sm:text-2xl p-2 ${
                scrolled ? "text-gray-800 dark:text-white" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="flex flex-col p-3 sm:p-4 space-y-2 sm:space-y-3">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => handleNavItemClick(item.path)}>
                  <div
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 text-left text-base sm:text-lg font-medium rounded-lg transition-all ${
                      location.pathname === item.path
                        ? "text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              {/* Shop Submenu in Mobile */}
              <div className="space-y-2">
                <div className="px-3 sm:px-4 py-2 text-left text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Shop
                </div>
                <Link to="/shop/artworks" onClick={() => handleNavItemClick("/shop/artworks")}>
                  <div className="px-5 sm:px-6 py-2 text-left text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all">
                    Student Artworks
                  </div>
                </Link>
                <Link to="/shop/materials" onClick={() => handleNavItemClick("/shop/materials")}>
                  <div className="px-5 sm:px-6 py-2 text-left text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all">
                    Art Materials
                  </div>
                </Link>
              </div>
              {/* Cart in Mobile */}
              <Link to="/cart" onClick={handleNavClick}>
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-base sm:text-lg font-medium rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between">
                  <span>Shopping Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              <button 
                onClick={() => { setShowEnrollForm(true); setIsOpen(false); }}
                className="w-full mt-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
              >
                Enroll Now
              </button>
              <div className="w-full mt-2 space-y-2">
                <button 
                  onClick={() => { setShowAdminLogin(true); setIsOpen(false); }}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <FaUserShield />
                  <span>Admin Login</span>
                </button>
                
                <button 
                  onClick={() => { setShowStudentLogin(true); setIsOpen(false); }}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <FaUser />
                  <span>Student Login</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      <EnrollmentForm isOpen={showEnrollForm} onClose={() => setShowEnrollForm(false)} />
      <AdminLogin isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
      <StudentLogin isOpen={showStudentLogin} onClose={() => setShowStudentLogin(false)} />
    </nav>
  );
};
export default Navbar;
