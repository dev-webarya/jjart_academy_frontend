import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaUsers, FaClock, FaMapMarkerAlt, FaTimes, FaCheck } from 'react-icons/fa';
import { eventsData } from '../../data/eventsData';

const AdminEvents = () => {
  const [events, setEvents] = useState(eventsData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'workshop',
    date: '',
    startTime: '',
    endTime: '',
    instructor: '',
    capacity: 20,
    price: 0,
    location: '',
    image: '',
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      type: 'workshop',
      date: '',
      startTime: '',
      endTime: '',
      instructor: '',
      capacity: 20,
      price: 0,
      location: '',
      image: '',
    });
    setEditingEvent(null);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (event) => {
    setFormData(event);
    setEditingEvent(event.id);
    setShowCreateModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      // Edit existing event
      setEvents(events.map(evt => 
        evt.id === editingEvent 
          ? { ...evt, ...formData }
          : evt
      ));
    } else {
      // Create new event
      const newEvent = {
        ...formData,
        id: `event-${Date.now()}`,
        bookedSlots: 0,
        isRecurring: false
      };
      setEvents([...events, newEvent]);
    }
    setShowCreateModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(evt => evt.id !== id));
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Events Management</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Create and manage events</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base"
        >
          <FaPlus />
          <span>Create Event</span>
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {currentEvents.map((event) => (
          <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all">
            {/* Image */}
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 sm:px-3 py-1 bg-purple-600 text-white text-xs sm:text-sm font-semibold rounded-full">
                {event.type}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                {event.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {event.description}
              </p>

              {/* Details */}
              <div className="space-y-2 mb-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaCalendarAlt className="text-purple-600 shrink-0" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaClock className="text-purple-600 shrink-0" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaMapMarkerAlt className="text-purple-600 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaUsers className="text-purple-600 shrink-0" />
                  <span>{event.bookedSlots}/{event.capacity} booked</span>
                </div>
              </div>

              {/* Price & Instructor */}
              <div className="py-3 border-t border-gray-200 dark:border-gray-700 mb-4 text-xs sm:text-sm">
                <p className="text-gray-600 dark:text-gray-400">Instructor: <span className="font-semibold text-gray-800 dark:text-white">{event.instructor}</span></p>
                <p className="text-gray-600 dark:text-gray-400">Price: <span className="font-semibold text-purple-600">₹{event.price}</span></p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(event)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FaEdit className="text-sm" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FaTrash className="text-sm" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, events.length)} of {events.length} events
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

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <EventModal
          formData={formData}
          onFormChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => setShowCreateModal(false)}
          isEditing={!!editingEvent}
        />
      )}
    </div>
  );
};

const EventModal = ({ formData, onFormChange, onSubmit, onClose, isEditing }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onFormChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              placeholder="Enter event title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onFormChange}
              required
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              placeholder="Enter event description"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Event Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={onFormChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="workshop">Workshop</option>
                <option value="exhibition">Exhibition</option>
                <option value="seminar">Seminar</option>
                <option value="competition">Competition</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onFormChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={onFormChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={onFormChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Instructor & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Instructor *
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={onFormChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="Instructor name"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onFormChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="Event location"
              />
            </div>
          </div>

          {/* Capacity & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={onFormChange}
                min="1"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="Participant capacity"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onFormChange}
                min="0"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="0 for free event"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={onFormChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FaCheck /> {isEditing ? 'Update' : 'Create'} Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEvents;
