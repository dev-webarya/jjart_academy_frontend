import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaUsers, FaClock, FaMapMarkerAlt, FaTimes, FaCheck, FaSpinner, FaSync, FaExclamationTriangle, FaTicketAlt } from 'react-icons/fa';
import { API_ENDPOINTS, BASE_URL } from '../../data/apiEndpoints';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalElements, setTotalElements] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'WORKSHOP',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: 20,
    registrationFee: 0,
    imageUrl: '',
    isPublic: true,
  });

  // Fetch events from API
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.LMS_EVENTS.GET_ALL}?page=${currentPage - 1}&size=${itemsPerPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Error loading events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [currentPage]);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'WORKSHOP',
      eventDate: '',
      startTime: '',
      endTime: '',
      location: '',
      capacity: 20,
      registrationFee: 0,
      imageUrl: '',
      isPublic: true,
    });
    setEditingEvent(null);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (event) => {
    setFormData({
      title: event.title || '',
      description: event.description || '',
      eventType: event.eventType || 'WORKSHOP',
      eventDate: event.eventDate || '',
      startTime: event.startTime ? formatTimeForInput(event.startTime) : '',
      endTime: event.endTime ? formatTimeForInput(event.endTime) : '',
      location: event.location || '',
      capacity: event.capacity || 20,
      registrationFee: event.registrationFee || 0,
      imageUrl: event.imageUrl || '',
      isPublic: event.isPublic !== undefined ? event.isPublic : true,
    });
    setEditingEvent(event);
    setShowCreateModal(true);
  };

  // Helper function to format time from API response (LocalTime object) to input string
  const formatTimeForInput = (time) => {
    if (typeof time === 'string') return time;
    if (time && typeof time === 'object') {
      const hour = String(time.hour || 0).padStart(2, '0');
      const minute = String(time.minute || 0).padStart(2, '0');
      return `${hour}:${minute}`;
    }
    return '';
  };

  // Helper function to format time string to LocalTime object for API
  const formatTimeForApi = (timeString) => {
    if (!timeString) return null;
    const [hour, minute] = timeString.split(':').map(Number);
    return { hour, minute, second: 0, nano: 0 };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
        (name === 'capacity' || name === 'registrationFee') ? parseFloat(value) : value
    }));
  };

  // Create Event
  const handleCreate = async () => {
    const token = localStorage.getItem('token');

    const payload = {
      title: formData.title,
      description: formData.description,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      startTime: formatTimeForApi(formData.startTime),
      endTime: formatTimeForApi(formData.endTime),
      location: formData.location,
      capacity: parseInt(formData.capacity) || 20,
      registrationFee: parseFloat(formData.registrationFee) || 0,
      imageUrl: formData.imageUrl,
      isPublic: formData.isPublic
    };

    console.log('Creating event with payload:', payload);

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.LMS_EVENTS.CREATE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Create failed:', response.status, errorData);
        throw new Error(`Failed to create event: ${response.status} - ${errorData}`);
      }

      await loadEvents();
      setShowCreateModal(false);
      alert('Event created successfully!');
    } catch (err) {
      console.error('Error creating event:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Update Event
  const handleUpdate = async () => {
    const token = localStorage.getItem('token');

    const payload = {
      title: formData.title,
      description: formData.description,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      startTime: formatTimeForApi(formData.startTime),
      endTime: formatTimeForApi(formData.endTime),
      location: formData.location,
      capacity: parseInt(formData.capacity) || 20,
      registrationFee: parseFloat(formData.registrationFee) || 0,
      imageUrl: formData.imageUrl,
      isPublic: formData.isPublic
    };

    console.log('Updating event with payload:', payload);
    console.log('Event ID:', editingEvent.id);

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.LMS_EVENTS.UPDATE(editingEvent.id)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update failed:', response.status, errorData);
        throw new Error(`Failed to update event: ${response.status} - ${errorData}`);
      }

      await loadEvents();
      setShowCreateModal(false);
      alert('Event updated successfully!');
    } catch (err) {
      console.error('Error updating event:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  // Delete Event
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.LMS_EVENTS.DELETE(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status}`);
      }

      await loadEvents();
      alert('Event deleted successfully!');
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalElements / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get event type badge color
  const getEventTypeBadgeColor = (type) => {
    const colors = {
      WORKSHOP: 'bg-purple-600',
      EXHIBITION: 'bg-blue-600',
      COMPETITION: 'bg-orange-600',
      SEMINAR: 'bg-green-600'
    };
    return colors[type] || 'bg-gray-600';
  };

  // Format display time
  const formatDisplayTime = (time) => {
    if (!time) return '';
    if (typeof time === 'string') return time;
    if (typeof time === 'object') {
      const hour = String(time.hour || 0).padStart(2, '0');
      const minute = String(time.minute || 0).padStart(2, '0');
      return `${hour}:${minute}`;
    }
    return '';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Events Management</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Create and manage events ({totalElements} total)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadEvents}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base"
          >
            <FaPlus />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-purple-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3">
          <FaExclamationTriangle className="text-xl" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Events List */}
      {!loading && !error && (
        <>
          {events.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
              <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Events Found</h3>
              <p className="text-gray-500 dark:text-gray-500">Create your first event to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaCalendarAlt className="text-white text-5xl" />
                      </div>
                    )}
                    <div className={`absolute top-2 right-2 px-2 sm:px-3 py-1 ${getEventTypeBadgeColor(event.eventType)} text-white text-xs sm:text-sm font-semibold rounded-full`}>
                      {event.eventType}
                    </div>
                    {event.isPublic && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        Public
                      </div>
                    )}
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
                        <span>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaClock className="text-purple-600 shrink-0" />
                        <span>{formatDisplayTime(event.startTime)} - {formatDisplayTime(event.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaMapMarkerAlt className="text-purple-600 shrink-0" />
                        <span className="truncate">{event.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaUsers className="text-purple-600 shrink-0" />
                        <span>Capacity: {event.capacity}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="py-3 border-t border-gray-200 dark:border-gray-700 mb-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <FaTicketAlt className="text-purple-600" />
                        <span className="font-semibold text-purple-600">
                          {event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}
                        </span>
                      </div>
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
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalElements)} of {totalElements} events
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
                className={`px-4 py-2 rounded-lg transition-all ${currentPage === index + 1
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
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex justify-between items-center">
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
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onFormChange}
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
                Event Type *
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={onFormChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="WORKSHOP">Workshop</option>
                <option value="EXHIBITION">Exhibition</option>
                <option value="SEMINAR">Seminar</option>
                <option value="COMPETITION">Competition</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
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
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={onFormChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={onFormChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={onFormChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              placeholder="Event location"
            />
          </div>

          {/* Capacity & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={onFormChange}
                min="1"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="Participant capacity"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Registration Fee (₹)
              </label>
              <input
                type="number"
                name="registrationFee"
                value={formData.registrationFee}
                onChange={onFormChange}
                min="0"
                step="0.01"
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
              name="imageUrl"
              value={formData.imageUrl}
              onChange={onFormChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-3">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          {/* Is Public */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={formData.isPublic}
              onChange={onFormChange}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isPublic" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Make this event public
            </label>
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
