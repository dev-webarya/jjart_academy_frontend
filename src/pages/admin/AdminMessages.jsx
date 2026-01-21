import { useState, useEffect } from 'react';
import { FaEnvelope, FaTrash, FaReply, FaCheck, FaSearch, FaTimes, FaWhatsapp, FaPaperPlane, FaEdit } from 'react-icons/fa';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [composeData, setComposeData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    message: ''
  });

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, filter, searchTerm]);

  const loadMessages = () => {
    // Load from contact form submissions stored in localStorage
    const existingMessages = localStorage.getItem('contactMessages');
    
    // Add dummy data if no messages exist
    if (!existingMessages || JSON.parse(existingMessages).length === 0) {
      const dummyMessages = [
        {
          id: 1701234567930,
          name: 'Rahul Sharma',
          email: 'rahul.sharma@email.com',
          phone: '+91 98765 43400',
          subject: 'Inquiry about Drawing Classes',
          message: 'Hello, I am interested in enrolling my 8-year-old daughter in your drawing classes. Could you please provide more information about the schedule and fees?',
          date: new Date('2024-11-28').toISOString(),
          status: 'unread'
        },
        {
          id: 1701234567931,
          name: 'Priya Mehta',
          email: 'priya.mehta@email.com',
          phone: '+91 98765 43410',
          subject: 'Watercolor Painting Workshop',
          message: 'I saw your advertisement about the watercolor painting workshop. Is there any age restriction? My son is 12 years old and very interested in learning.',
          date: new Date('2024-11-29').toISOString(),
          status: 'read'
        },
        {
          id: 1701234567932,
          name: 'Amit Kumar',
          email: 'amit.kumar@email.com',
          phone: '+91 98765 43420',
          subject: 'Schedule Inquiry',
          message: 'Can you please send me the complete schedule for all classes? We are planning to enroll both our children.',
          date: new Date('2024-12-01').toISOString(),
          status: 'unread'
        },
        {
          id: 1701234567933,
          name: 'Sneha Patel',
          email: 'sneha.patel@email.com',
          phone: '+91 98765 43430',
          subject: 'Digital Art Classes',
          message: 'Do you offer online digital art classes? My daughter is interested but we live quite far from your location.',
          date: new Date('2024-12-02').toISOString(),
          status: 'unread'
        }
      ];
      localStorage.setItem('contactMessages', JSON.stringify(dummyMessages));
      setMessages(dummyMessages);
    } else {
      const contacts = JSON.parse(existingMessages);
      setMessages(contacts);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter(m => m.status === filter);
    }

    setFilteredMessages(filtered);
  };

  const markAsRead = (id) => {
    const updated = messages.map(m =>
      m.id === id ? { ...m, status: 'read' } : m
    );
    setMessages(updated);
    localStorage.setItem('contactMessages', JSON.stringify(updated));
  };

  const deleteMessage = (id) => {
    if (confirm('Are you sure you want to delete this message?')) {
      const updated = messages.filter(m => m.id !== id);
      setMessages(updated);
      localStorage.setItem('contactMessages', JSON.stringify(updated));
      setSelectedMessage(null);
    }
  };

  const openComposeModal = (message = null) => {
    if (message) {
      setComposeData({
        recipientName: message.name,
        recipientEmail: message.email,
        recipientPhone: message.phone || '',
        message: ''
      });
    }
    setShowComposeModal(true);
    setSelectedMessage(null);
  };

  const sendViaWhatsApp = () => {
    const { recipientName, recipientPhone, message } = composeData;
    const phoneNumber = recipientPhone.replace(/[^0-9]/g, '');
    const whatsappMessage = `Hello ${recipientName},\n\n${message}\n\nBest regards,\nSchool Administration`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Save sent message
    const sentMessage = {
      id: Date.now(),
      type: 'sent',
      name: recipientName,
      email: composeData.recipientEmail,
      phone: recipientPhone,
      message: message,
      sentVia: 'whatsapp',
      date: new Date().toISOString(),
      status: 'sent'
    };
    
    const sentMessages = JSON.parse(localStorage.getItem('sentMessages') || '[]');
    sentMessages.push(sentMessage);
    localStorage.setItem('sentMessages', JSON.stringify(sentMessages));
    
    window.open(whatsappUrl, '_blank');
    setShowComposeModal(false);
    resetComposeForm();
  };

  const sendViaEmail = () => {
    const { recipientName, recipientEmail, message } = composeData;
    const subject = `Message from School Administration`;
    const body = `Dear ${recipientName},\n\n${message}\n\nBest regards,\nSchool Administration`;
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Save sent message
    const sentMessage = {
      id: Date.now(),
      type: 'sent',
      name: recipientName,
      email: recipientEmail,
      phone: composeData.recipientPhone,
      message: message,
      sentVia: 'email',
      date: new Date().toISOString(),
      status: 'sent'
    };
    
    const sentMessages = JSON.parse(localStorage.getItem('sentMessages') || '[]');
    sentMessages.push(sentMessage);
    localStorage.setItem('sentMessages', JSON.stringify(sentMessages));
    
    window.location.href = mailtoUrl;
    setShowComposeModal(false);
    resetComposeForm();
  };

  const resetComposeForm = () => {
    setComposeData({
      recipientName: '',
      recipientEmail: '',
      recipientPhone: '',
      message: ''
    });
  };

  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    read: messages.filter(m => m.status === 'read').length
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Messages & Inquiries
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer inquiries and contact messages
          </p>
        </div>
        <button
          onClick={() => {
            resetComposeForm();
            setShowComposeModal(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaPaperPlane className="text-xl" />
          <span>Compose Message</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Total Messages</h3>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Unread</h3>
          <p className="text-4xl font-bold">{stats.unread}</p>
        </div>
        <div className="bg-linear-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Read</h3>
          <p className="text-4xl font-bold">{stats.read}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'unread', 'read'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  filter === status
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages List - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {currentMessages.length > 0 ? (
          currentMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-102 h-fit ${
                message.status === 'unread' ? 'border-t-4 border-orange-500' : ''
              }`}
              onClick={() => {
                setSelectedMessage(message);
                if (message.status === 'unread') {
                  markAsRead(message.id);
                }
              }}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {message.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-gray-800 dark:text-white truncate">
                        {message.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{message.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{new Date(message.date).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message.id);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all shrink-0 ml-2"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
                
                <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-3 mb-3 min-h-[60px]">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                    {message.subject || 'General Inquiry'}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {message.message}
                  </p>
                </div>

                {message.status === 'unread' && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">
                      Unread
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openComposeModal(message);
                    }}
                    className="flex items-center justify-center space-x-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex-1"
                  >
                    <FaReply className="text-xs" />
                    <span>Reply</span>
                  </button>
                  {message.phone && (
                    <a
                      href={`https://wa.me/${message.phone.replace(/[^0-9]/g, '')}?text=Hello ${message.name}, regarding your inquiry...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center space-x-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex-1"
                    >
                      <FaWhatsapp className="text-xs" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <FaEnvelope className="text-gray-400 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-xl">
              No messages found
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMessages.length)} of {filteredMessages.length} messages
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === index + 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Message Details</h2>
                <p className="text-purple-100 text-sm mt-1">From {selectedMessage.name}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Name</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Date</label>
                  <p className="text-gray-800 dark:text-white font-medium">
                    {new Date(selectedMessage.date).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedMessage.status === 'unread'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              {selectedMessage.subject && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Subject</label>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Message</label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => openComposeModal(selectedMessage)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold"
                >
                  <FaReply />
                  <span>Compose Reply</span>
                </button>
                <button
                  onClick={() => {
                    deleteMessage(selectedMessage.id);
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose Message Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-4 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <FaPaperPlane className="text-xl" />
                <h2 className="text-xl font-bold">Compose Message to Parent</h2>
              </div>
              <button
                onClick={() => {
                  setShowComposeModal(false);
                  resetComposeForm();
                }}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-4">
              <form className="space-y-3">
                {/* Recipient Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={composeData.recipientName}
                    onChange={(e) => setComposeData({...composeData, recipientName: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="Enter student's name"
                  />
                </div>

                {/* Recipient Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={composeData.recipientEmail}
                    onChange={(e) => setComposeData({...composeData, recipientEmail: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="parent@example.com"
                  />
                </div>

                {/* Recipient Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={composeData.recipientPhone}
                    onChange={(e) => setComposeData({...composeData, recipientPhone: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="+91 1234567890"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Include country code for WhatsApp (optional)
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    value={composeData.message}
                    onChange={(e) => setComposeData({...composeData, message: e.target.value})}
                    rows="4"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="Write your message here..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This message will be sent to the parent/guardian
                  </p>
                </div>

                {/* Message Preview */}
                {composeData.message && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-white mb-2">Message Preview:</h4>
                    <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      <p>Hello {composeData.recipientName || '[Name]'},</p>
                      <p className="whitespace-pre-wrap">{composeData.message}</p>
                      <p>Best regards,<br/>School Administration</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={sendViaEmail}
                    disabled={!composeData.recipientName || !composeData.recipientEmail || !composeData.message}
                    className="flex-1 flex items-center justify-center space-x-2 bg-linear-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <FaEnvelope className="text-xl" />
                    <span>Send via Email</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={sendViaWhatsApp}
                    disabled={!composeData.recipientName || !composeData.recipientPhone || !composeData.message}
                    className="flex-1 flex items-center justify-center space-x-2 bg-linear-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <FaWhatsapp className="text-xl" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowComposeModal(false);
                    resetComposeForm();
                  }}
                  className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
