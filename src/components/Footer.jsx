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
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
const Footer = () => {
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const footerLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Classes", link: "/classes" },
    { name: "Gallery", link: "/gallery" },
    { name: "Contact", link: "/contact" },
  ];
  const shopLinks = [
    { name: "Art Shop", link: "/shop/artworks" },
    { name: "Materials Shop", link: "/shop/materials" },
    { name: "Cart", link: "/cart" },
  ];
  const socialLinks = [
    { icon: FaFacebook, link: "#", color: "hover:bg-blue-600" },
    { icon: FaTwitter, link: "#", color: "hover:bg-sky-500" },
    { icon: FaInstagram, link: "https://www.instagram.com/jjartacademy?utm_source=qr&igsh=NjVtMGl5MHh1bm5n", color: "hover:bg-pink-600" },
    { icon: FaLinkedin, link: "#", color: "hover:bg-blue-700" },
    { icon: FaYoutube, link: "https://youtube.com/@jjartacademy108?si=0GThm9orG2EQRYUl", color: "hover:bg-red-600" },
  ];
  return (
    <footer className="bg-linear-to-b from-gray-900 via-gray-950 to-black text-white relative overflow-hidden pt-10 sm:pt-10 pb-3 sm:pb-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-16 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-5 mb-6">
              <div className="p-3 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl shadow-xl shadow-purple-600/30">
                <img 
                  src="/aa.jpeg" 
                  alt=" Logo" 
                  className="h-20 sm:h-24 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-bold leading-tight bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"></span>
                <span className="text-sm sm:text-base font-semibold text-transparent bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text"></span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mt-4 text-sm sm:text-base text-center sm:text-left font-light max-w-xs">
              Empowering young artists to discover their creativity and express themselves through exceptional art education and exhibitions.
            </p>
          </div>
          {/* Main Links */}
          <div>
            <div className="text-center sm:text-left">
              <button
                onClick={() => setIsPagesOpen(!isPagesOpen)}
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 mb-5 hover:opacity-80 transition-opacity"
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
                      className="text-gray-400 hover:text-transparent hover:bg-linear-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text transition-all duration-300 text-sm sm:text-base group relative"
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform">→</span> {link.name}
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
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 mb-5 hover:opacity-80 transition-opacity"
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
                      className="text-gray-400 hover:text-transparent hover:bg-linear-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text transition-all duration-300 text-sm sm:text-base group relative">
                      <span className="group-hover:translate-x-1 inline-block transition-transform">→</span> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8 pb-4">
          <div className="flex justify-center">
            {/* Copyright */}
            <p className="text-gray-500 text-xs sm:text-sm text-center hover:text-gray-300 transition-colors">
              © {new Date().getFullYear()} ArtClass. Made with{" "}
              <FaHeart className="inline text-red-500 animate-pulse" /> by
              passionate artists.
            </p>
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
