import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPalette,
  FaHeart,
  FaArrowUp,
  FaChevronDown,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
const Footer = () => {
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const footerLinks = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Classes", link: "/classes" },
    { name: "Exhibitions", link: "/exhibitions" },
    { name: "Gallery", link: "/gallery" },
    { name: "Instructors", link: "/instructors" },
    { name: "Testimonials", link: "/testimonials" },
    { name: "Contact", link: "/contact" },
  ];
  
  const shopLinks = [
    { name: "Student Artworks", link: "/shop/artworks" },
    { name: "Art Materials", link: "/shop/materials" },
    { name: "Shopping Cart", link: "/cart" },
  ];
  
  const quickLinks = [
    { name: "Fee Payment", link: "/fee-payment" },
    { name: "Enrollment", link: "/" },
    { name: "Events", link: "/exhibitions" },
  ];
  
  const socialLinks = [
    { icon: FaInstagram, link: "https://www.instagram.com/jjartacademy?utm_source=qr&igsh=NjVtMGl5MHh1bm5n", color: "hover:bg-pink-600", name: "Instagram" },
    { icon: FaYoutube, link: "https://youtube.com/@jjartacademy108?si=0GThm9orG2EQRYUl", color: "hover:bg-red-600", name: "YouTube" },
    { icon: FaFacebook, link: "https://facebook.com", color: "hover:bg-blue-600", name: "Facebook" },
    { icon: FaTwitter, link: "https://twitter.com", color: "hover:bg-sky-500", name: "Twitter" },
    { icon: FaLinkedin, link: "https://linkedin.com", color: "hover:bg-blue-700", name: "LinkedIn" },
  ];
  return (
    <footer className="bg-linear-to-b from-gray-900 via-gray-950 to-black text-white relative overflow-hidden pt-12 sm:pt-16 pb-6 sm:pb-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" onClick={scrollToTop}>
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-6 group cursor-pointer">
                <div className="p-2 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl shadow-xl group-hover:shadow-purple-500/50 transition-all group-hover:scale-105">
                  <img 
                    src="/logo.png" 
                    alt="Art Academy Logo" 
                    className="h-16 sm:h-20 w-auto object-contain"
                  />
                </div>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base text-center sm:text-left">
              Empowering young artists to discover their creativity and express themselves through exceptional art education.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <a href="tel:+917337880767" className="flex items-center gap-3 hover:text-purple-400 transition-colors">
                <FaPhone className="text-purple-500" />
                <span>+91 73378 80767</span>
              </a>
              <a href="mailto:info@artacademy.com" className="flex items-center gap-3 hover:text-purple-400 transition-colors">
                <FaEnvelope className="text-purple-500" />
                <span>info@artacademy.com</span>
              </a>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-purple-500 mt-1" />
                <span>Art Academy, City Center, Your City</span>
              </div>
            </div>
          </div>
          
          {/* Pages Links */}
          <div>
            <div className="text-center sm:text-left">
              <button
                onClick={() => setIsPagesOpen(!isPagesOpen)}
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 mb-6 hover:opacity-80 transition-opacity"
              >
                <div className="w-1 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h4 className="font-bold text-lg sm:text-xl text-white">Pages</h4>
                <FaChevronDown className={`sm:hidden transition-transform duration-300 ${isPagesOpen ? 'rotate-180' : ''}`} />
              </button>
              <ul className={`space-y-3 ${isPagesOpen ? 'block' : 'hidden sm:block'}`}>
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.link}
                      onClick={scrollToTop}
                      className="text-gray-400 hover:text-purple-400 transition-all duration-300 text-sm sm:text-base group relative inline-flex items-center gap-2"
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform">→</span> 
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <div className="text-center sm:text-left">
              <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 mb-6 hover:opacity-80 transition-opacity"
              >
                <div className="w-1 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h4 className="font-bold text-lg sm:text-xl text-white">Shop</h4>
                <FaChevronDown className={`sm:hidden transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
              </button>
              <ul className={`space-y-3 ${isShopOpen ? 'block' : 'hidden sm:block'}`}>
                {shopLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.link}
                      onClick={scrollToTop}
                      className="text-gray-400 hover:text-purple-400 transition-all duration-300 text-sm sm:text-base group relative inline-flex items-center gap-2"
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform">→</span> 
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <div className="text-center sm:text-left">
              <button
                onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 mb-6 hover:opacity-80 transition-opacity"
              >
                <div className="w-1 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h4 className="font-bold text-lg sm:text-xl text-white">Quick Links</h4>
                <FaChevronDown className={`sm:hidden transition-transform duration-300 ${isQuickLinksOpen ? 'rotate-180' : ''}`} />
              </button>
              <ul className={`space-y-3 mb-6 ${isQuickLinksOpen ? 'block' : 'hidden sm:block'}`}>
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.link}
                      onClick={scrollToTop}
                      className="text-gray-400 hover:text-purple-400 transition-all duration-300 text-sm sm:text-base group relative inline-flex items-center gap-2"
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform">→</span> 
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Social Links */}
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-sm text-gray-400 mb-4">Follow Us</h4>
                <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                      aria-label={social.name}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-xs sm:text-sm text-center hover:text-gray-300 transition-colors">
              © {new Date().getFullYear()} Art Academy. Made with{" "}
              <FaHeart className="inline text-red-500 animate-pulse" /> for young artists.
            </p>
            
            {/* Additional Links */}
            <div className="flex gap-6 text-xs sm:text-sm text-gray-500">
              <Link to="/contact" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/*Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white text-xl sm:text-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all z-40"
        aria-label="Scroll to top">
        <FaArrowUp />
      </button>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/917337880767"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center text-white text-xl sm:text-2xl hover:scale-110 transition-all z-40"
        aria-label="Contact on WhatsApp">
        <FaWhatsapp />
      </a>
    </footer>
  );
};
export default Footer;
