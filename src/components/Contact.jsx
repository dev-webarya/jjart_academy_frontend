import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      details: '+91 7337880767',
      link: 'tel:+917337880767',
      color: 'from-violet-500 to-pink-500',
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: 'info@jjartacademy.com',
      link: 'mailto:info@jjartacademy.com',
      color: 'from-violet-500 to-pink-500',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      details: 'Borewell Road, Whitefield, Bangalore 560066',
      link: '#',
      color: 'from-violet-500 to-pink-500',
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save message to localStorage for admin
      const contactMessage = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        date: new Date().toISOString(),
        status: 'unread'
      };
      
      const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      existingMessages.push(contactMessage);
      localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
      
      // Simulate form submission
      setTimeout(() => {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setSubmitted(false), 5000);
      }, 1000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <section
      id="contact"
      className="bg-linear-to-b from-white via-violet-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 md:py-8"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="space-y-10 sm:space-y-12 md:space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <span className="inline-block bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white px-4">
              Start Your{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-pink-500">
                Creative Journey
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-violet-200/50 ring-1 ring-slate-200/50 dark:ring-gray-700/50 transition-all group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br ${info.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-violet-200/50 group-hover:shadow-xl group-hover:shadow-violet-300/50 transition-all`}>
                  <info.icon className="text-2xl sm:text-3xl text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                  {info.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300">
                  {info.details}
                </p>
              </a>
            ))}
          </div>

          {/* Follow Us Section */}
          <div className="bg-linear-to-r from-violet-600 to-pink-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-violet-200/50">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Follow Us On Social Media</h3>
            <p className="text-base sm:text-lg mb-8 opacity-90">Connect with us for daily art inspiration and updates</p>
            <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
              <a
                href="https://www.instagram.com/jjartacademy?utm_source=qr&igsh=NjVtMGl5MHh1bm5n"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="text-2xl sm:text-3xl text-pink-600" />
              </a>
              <a
                href="https://youtube.com/@jjartacademy108?si=0GThm9orG2EQRYUl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Follow us on YouTube"
              >
                <FaYoutube className="text-2xl sm:text-3xl text-red-600" />
              </a>
              <a
                href="https://wa.me/917337880767"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Chat with us on WhatsApp"
              >
                <FaWhatsapp className="text-2xl sm:text-3xl text-green-600" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* Left - Form */}
            <div>
              <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 dark:ring-gray-700/50">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 sm:mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base ${
                        errors.name
                          ? 'ring-2 ring-red-500'
                          : 'ring-1 ring-slate-200 dark:ring-gray-700'
                      } bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 sm:mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base ${
                        errors.email
                          ? 'ring-2 ring-red-500'
                          : 'ring-1 ring-slate-200 dark:ring-gray-700'
                      } bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 sm:mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base ring-1 ring-slate-200 dark:ring-gray-700 bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 sm:mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base ring-1 ring-slate-200 dark:ring-gray-700 bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                      placeholder="Class Inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 sm:mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base ${
                        errors.message
                          ? 'ring-2 ring-red-500'
                          : 'ring-1 ring-slate-200 dark:ring-gray-700'
                      } bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all resize-none`}
                      placeholder="Tell us about your interest in our classes..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-violet-600 to-pink-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-violet-200/50 hover:shadow-xl hover:shadow-violet-300/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    {submitted ? (
                      <>
                        <FaCheckCircle />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right - Map & Info */}
            <div className="space-y-6 sm:space-y-8">
              {/* Map Placeholder */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 dark:ring-gray-700/50 h-64 sm:h-80 md:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095919355!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>

              {/* Opening Hours */}
              <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 dark:ring-gray-700/50">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                  Opening Hours
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { day: 'Monday - Friday', hours: '9:00 AM - 9:00 PM' },
                    { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
                    { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex flex-col xs:flex-row justify-between xs:items-center py-2.5 sm:py-3 border-b border-slate-200 dark:border-gray-700 last:border-0 gap-1 xs:gap-0"
                    >
                      <span className="font-semibold text-sm sm:text-base text-slate-700 dark:text-gray-300">
                        {schedule.day}
                      </span>
                      <span className="text-sm sm:text-base text-violet-600 dark:text-violet-400 font-bold">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 
