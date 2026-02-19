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
    { icon: FaInstagram, link: "https://www.instagram.com/jjartacademy?utm_source=qr&igsh=NjVtMGl5MHh1bm5n", name: "Instagram" },
    { icon: FaYoutube, link: "https://youtube.com/@jjartacademy108?si=0GThm9orG2EQRYUl", name: "YouTube" },
    { icon: FaFacebook, link: "https://facebook.com", name: "Facebook" },
    // TODO: Add actual links when available
    // { icon: FaTwitter, link: "https://twitter.com", name: "Twitter" },
    // { icon: FaLinkedin, link: "https://linkedin.com", name: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden pt-12 sm:pt-16 pb-6 sm:pb-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" onClick={scrollToTop}>
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-6 group cursor-pointer">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl shadow-xl group-hover:shadow-violet-500/40 transition-all duration-200 group-hover:scale-105">
                  <img
                    src="/logo.png"
                    alt="Art Academy Logo"
                    className="h-16 sm:h-20 w-auto object-contain"
                  />
                </div>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6 text-sm sm:text-base text-center sm:text-left">
              Empowering young artists to discover their creativity and express themselves through exceptional art education.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-slate-400">
              <a href="tel:+917337880767" className="flex items-center gap-3 hover:text-violet-400 transition-colors duration-200">
                <FaPhone className="text-violet-500" />
                <span>+91 73378 80767</span>
              </a>
              <a href="mailto:info@artacademy.com" className="flex items-center gap-3 hover:text-violet-400 transition-colors duration-200">
                <FaEnvelope className="text-violet-500" />
                <span>info@artacademy.com</span>
              </a>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-violet-500 mt-1 shrink-0" />
                <span>Art Academy, City Center, Your City</span>
              </div>
            </div>
          </div>

          {/* Pages Links */}
          <div>
            <div className="text-center sm:text-left">
              <button
                onClick={() => setIsPagesOpen(!isPagesOpen)}
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 mb-6 hover:opacity-80 transition-opacity duration-200"
              >
                <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full"></div>
                <h4 className="font-bold text-lg sm:text-xl text-white">Pages</h4>
                <FaChevronDown className={`sm:hidden transition-transform duration-200 ${isPagesOpen ? 'rotate-180' : ''}`} />
              </button>
              <ul className={`space-y-3 ${isPagesOpen ? 'block' : 'hidden sm:block'}`}>
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.link}
                      onClick={scrollToTop}
                      className="text-slate-400 hover:text-violet-400 transition-colors duration-200 text-sm sm:text-base group relative inline-flex items-center gap-2"
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
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
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 mb-6 hover:opacity-80 transition-opacity duration-200"
              >
                <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full"></div>
                <h4 className="font-bold text-lg sm:text-xl text-white">Shop</h4>
                <FaChevronDown className={`sm:hidden transition-transform duration-200 ${isShopOpen ? 'rotate-180' : ''}`} />
              </button>
              <ul className={`space-y-3 ${isShopOpen ? 'block' : 'hidden sm:block'}`}>
                {shopLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.link}
                      onClick={scrollToTop}
                      className="text-slate-400 hover:text-violet-400 transition-colors duration-200 text-sm sm:text-base group relative inline-flex items-center gap-2"
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
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
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 mb-6 hover:opacity-80 transition-opacity duration-200"
              >
                <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full"></div>
                <h4 className="font-bold text-lg sm:text-xl text-white">Quick Links</h4>
                <FaChevronDown className={`sm:hidden transition-transform duration-200 ${isQuickLinksOpen ? 'rotate-180' : ''}`} />
              </button>
              <ul className={`space-y-3 mb-6 ${isQuickLinksOpen ? 'block' : 'hidden sm:block'}`}>
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.link}
                      onClick={scrollToTop}
                      className="text-slate-400 hover:text-violet-400 transition-colors duration-200 text-sm sm:text-base group relative inline-flex items-center gap-2"
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              <div className="text-center sm:text-left">
                <h4 className="font-semibold text-sm text-slate-300 mb-4">Follow Us</h4>
                <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800/80 border border-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-violet-500 hover:to-pink-500 hover:border-transparent transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-violet-500/25"
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

        {/* Designed by WebArya Credit Section (Compact) */}
        <div className="border-t border-slate-800/80 bg-slate-950/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">

              {/* Left Side: Copyright */}
              <div className="order-2 md:order-1 text-center md:text-left">
                © {new Date().getFullYear()} Art Academy. All rights reserved.
              </div>

              {/* Right Side: WebArya & Tools */}
              <div className="flex items-center gap-3 sm:gap-6 order-1 md:order-2 flex-wrap justify-center md:justify-end">

                {/* Designed By */}
                <div className="flex items-center gap-2">
                  <span>Designed by</span>
                  <a
                    href="https://webarya.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 group hover:text-white transition-colors"
                  >
                    <img
                      src="/WebAryaLogo.jpeg"
                      alt="WebArya"
                      className="w-5 h-5 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="font-bold text-green-500 group-hover:text-green-400 transition-colors">WebArya</span>
                  </a>
                </div>

                {/* Divider */}
                <span className="hidden sm:block text-slate-700">|</span>

                {/* Phone */}
                <a href="tel:+919187385124" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <FaPhone className="text-xs text-green-500" />
                  <span>+91 9187 385 124</span>
                </a>

                {/* WhatsApp */}
                <a href="https://wa.me/919187385124" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <FaWhatsapp className="text-sm text-green-500" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>

                {/* Scroll Top Button (Inline) */}
                <button
                  onClick={scrollToTop}
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ml-2"
                  title="Back to top"
                  aria-label="Scroll to top"
                >
                  <FaArrowUp className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white text-xl sm:text-2xl hover:shadow-violet-500/40 hover:scale-110 transition-all duration-200 z-40"
        aria-label="Scroll to top">
        <FaArrowUp />
      </button>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/917337880767"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center text-white text-xl sm:text-2xl hover:scale-110 transition-all duration-200 z-40"
        aria-label="Contact on WhatsApp">
        <FaWhatsapp />
      </a>
    </footer>
  );
};

export default Footer;
