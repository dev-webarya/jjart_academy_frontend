import { useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaTimes, FaMapMarkerAlt, FaUser, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

const MyEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [myBookings, setMyBookings] = useState([
    {
      id: 1,
      eventName: 'Watercolor Workshop',
      type: 'Workshop',
      date: '2024-12-15',
      time: '10:00 AM - 1:00 PM',
      location: 'Art Studio A - Room 101',
      instructor: 'Priya Sharma',
      status: 'confirmed',
      bookingDate: '2024-12-01',
      price: 500,
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
      description: 'Learn professional watercolor techniques from expert artists. Perfect for beginners and intermediate students.',
      bookedSlots: '12/20',
    },
    {
      id: 2,
      eventName: 'Annual Art Exhibition',
      type: 'Exhibition',
      date: '2024-12-20',
      time: '5:00 PM - 8:00 PM',
      location: 'Main Gallery',
      status: 'confirmed',
      bookingDate: '2024-11-25',
      price: 0,
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400',
      description: 'Showcase of outstanding student artworks from various mediums and styles.',
      bookedSlots: 'Free Entry',
    },
    {
      id: 3,
      eventName: 'Portrait Drawing Competition',
      type: 'Competition',
      date: '2024-12-10',
      time: '9:00 AM - 12:00 PM',
      location: 'Competition Hall',
      instructor: 'Raj Kumar',
      status: 'completed',
      bookingDate: '2024-11-20',
      price: 300,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
      description: 'Test your portrait drawing skills and compete with fellow artists.',
      bookedSlots: '25/30',
    },
    {
      id: 4,
      eventName: 'Digital Art Masterclass',
      type: 'Workshop',
      date: '2025-01-05',
      time: '2:00 PM - 5:00 PM',
      location: 'Computer Lab - Building B',
      instructor: 'Vikram Singh',
      status: 'confirmed',
      bookingDate: '2024-12-15',
      price: 800,
      image: 'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=400',
      description: 'Master digital art tools and techniques using industry-standard software.',
      bookedSlots: '8/15',
    },
  ]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
          icon: FaCheckCircle
        };
      case 'pending':
        return {
          badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
          icon: FaClock
        };
      case 'cancelled':
        return {
          badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
          icon: FaTimes
        };
      case 'completed':
        return {
          badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
          icon: FaCheckCircle
        };
      default:
        return {
          badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
          icon: FaClock
        };
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'Workshop':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      case 'Exhibition':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Competition':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const confirmedCount = myBookings.filter(b => b.status === 'confirmed').length;
  const completedCount = myBookings.filter(b => b.status === 'completed').length;
  const upcomingCount = myBookings.filter(b => new Date(b.date) > new Date() && b.status === 'confirmed').length;

  const handleCancelBooking = (id) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setMyBookings(myBookings.filter(b => b.id !== id));
      alert('Booking cancelled successfully!');
    }
  };

  const getFilteredBookings = () => {
    return myBookings.filter(booking => {
      const matchesFilter = filter === 'all' || booking.status === filter;
      const matchesSearch = booking.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };

  const filteredBookings = getFilteredBookings();
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">My Events & Bookings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View your registered events and workshops</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Total Bookings</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white">{myBookings.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-indigo-600 dark:text-indigo-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Confirmed</p>
              <p className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{confirmedCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600 dark:text-green-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Completed</p>
              <p className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{completedCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-blue-600 dark:text-blue-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Upcoming</p>
              <p className="text-xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{upcomingCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <FaClock className="text-orange-600 dark:text-orange-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by event name, type or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {currentBookings.map(booking => {
          const statusStyles = getStatusStyles(booking.status);
          const StatusIcon = statusStyles.icon;

          return (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Event Image */}
                <div className="relative h-48 lg:h-auto">
                  <img 
                    src={booking.image} 
                    alt={booking.eventName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeStyles(booking.type)}`}>
                      {booking.type}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles.badge} flex items-center gap-1`}>
                      <StatusIcon size={12} />
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="lg:col-span-3 p-4 sm:p-6">
                  {/* Title */}
                  <div className="mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {booking.eventName}
                    </h3>
                    {booking.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {booking.description}
                      </p>
                    )}
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FaCalendarAlt className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Date & Time</p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{booking.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <FaMapMarkerAlt className="text-red-600 dark:text-red-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{booking.location}</p>
                      </div>
                    </div>

                    {booking.instructor && (
                      <div className="flex items-center gap-2 text-sm">
                        <FaUser className="text-purple-600 dark:text-purple-400 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Instructor</p>
                          <p className="font-semibold text-gray-800 dark:text-white">{booking.instructor}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <FaClock className="text-orange-600 dark:text-orange-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Booked On</p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      {booking.price > 0 ? (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Price</p>
                          <p className="text-xl font-bold text-purple-600">₹{booking.price}</p>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
                          Free Entry
                        </span>
                      )}
                      {booking.bookedSlots && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Slots</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{booking.bookedSlots}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                      >
                        <FaTrash size={14} />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {currentBookings.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700 shadow-lg">
          <FaCalendarAlt className="text-5xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
            {searchTerm || filter !== 'all' ? 'No Bookings Found' : 'No Bookings Yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Browse events and workshops to get started!'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length} bookings
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Previous
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
