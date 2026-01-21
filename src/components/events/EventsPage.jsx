import { useState } from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers, FaTicketAlt } from 'react-icons/fa';
import { eventsData, weeklyActivitiesData } from '../../data/eventsData';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import { useNotification } from '../../context/NotificationContext';

const EventsPage = () => {
  const [events, setEvents] = useState(eventsData);
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'weekly'
  const { success } = useNotification();

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredEvents(events);
      return;
    }
    
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const getAvailableSlots = (event) => {
    return event.capacity - event.bookedSlots;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 bg-linear-to-r from-purple-900 via-purple-700 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=1600&q=80"
            alt="Events"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Events & Activities
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-6 drop-shadow-lg">
            Discover workshops, exhibitions, and weekly activities that inspire creativity and learning
          </p>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 text-white">
              <p className="text-3xl font-bold">{eventsData.length}+</p>
              <p className="text-sm">Events</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 text-white">
              <p className="text-3xl font-bold">{weeklyActivitiesData.length}+</p>
              <p className="text-sm">Weekly Activities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-semibold transition-all ₹{
              activeTab === 'events'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-3 font-semibold transition-all ₹{
              activeTab === 'weekly'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
            }`}
          >
            Weekly Activities
          </button>
        </div>

        {/* Search */}
        {activeTab === 'events' && (
          <div className="mb-6">
            <SearchBar 
              placeholder="Search events..." 
              onSearch={handleSearch}
            />
          </div>
        )}

        {/* Events Grid */}
        {activeTab === 'events' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                availableSlots={getAvailableSlots(event)}
                onBook={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}

        {/* Weekly Activities */}
        {activeTab === 'weekly' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {weeklyActivitiesData.map((activity) => (
              <WeeklyActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSuccess={() => {
            success(`Successfully booked "₹{selectedEvent.title}"!`);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

const EventCard = ({ event, availableSlots, onBook }) => {
  const eventDate = new Date(event.date);
  const isFullyBooked = availableSlots <= 0;
  const isFilling = availableSlots > 0 && availableSlots <= 5;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
      {/* Image */}
      <div className="relative h-36 sm:h-40 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 px-3 py-1 bg-purple-600 text-white text-xs sm:text-sm font-semibold rounded-full">
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </div>
        {isFullyBooked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Fully Booked</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <FaCalendar className="text-purple-600 shrink-0" />
            <span className="truncate">{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <FaClock className="text-purple-600 shrink-0" />
            <span className="truncate">{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <FaMapMarkerAlt className="text-purple-600 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <FaUsers className="text-purple-600 shrink-0" />
            <span className="truncate">
              {availableSlots} / {event.capacity} slots
              {isFilling && <span className="text-orange-600 font-semibold ml-1">(Fast!)</span>}
            </span>
          </div>
        </div>

        {/* Instructor */}
        <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Instructor</p>
          <p className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-white truncate">{event.instructor}</p>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between gap-2">
          <div>
            {event.price === 0 ? (
              <span className="text-lg sm:text-xl font-bold text-green-600">FREE</span>
            ) : (
              <span className="text-lg sm:text-xl font-bold text-purple-600">₹{event.price}</span>
            )}
          </div>
          <button
            onClick={onBook}
            disabled={isFullyBooked}
            className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
          >
            <FaTicketAlt className="text-xs sm:text-sm" /> Book
          </button>
        </div>
      </div>
    </div>
  );
};

const WeeklyActivityCard = ({ activity }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 hover:shadow-2xl transition-all transform hover:-translate-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-lg font-bold text-purple-600">{activity.day}</h3>
        <span className="px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-xs rounded-full">
          Weekly
        </span>
      </div>
      
      <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
        {activity.title}
      </h4>
      
      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
        {activity.description}
      </p>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <FaClock className="text-purple-600 shrink-0" />
          <span>{activity.time}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <FaUsers className="text-purple-600 shrink-0" />
          <span>Max {activity.capacity} participants</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
        <span className="font-semibold">Instructor:</span> {activity.instructor}
      </p>

      <button className="w-full px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium text-xs sm:text-sm">
        Register
      </button>
    </div>
  );
};

const BookingModal = ({ event, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would make an API call to book the event
    onSuccess();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Book Event" size="md">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(event.date).toLocaleDateString()} • {event.startTime}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Participants
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Total */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800 dark:text-white">Total Amount:</span>
            <span className="text-2xl font-bold text-purple-600">
              {event.price === 0 ? 'FREE' : `₹₹{(event.price * formData.participants).toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventsPage;
