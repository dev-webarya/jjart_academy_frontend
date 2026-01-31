import { useState, useEffect } from 'react';
import { FaTheaterMasks, FaPlus, FaEdit, FaTrash, FaUsers, FaClock, FaMapMarkerAlt, FaTimes, FaCheck, FaSpinner, FaSync, FaStar, FaTicketAlt } from 'react-icons/fa';
import { API_ENDPOINTS, BASE_URL } from '../../data/apiEndpoints';

const AdminExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalElements, setTotalElements] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    location: '',
    startDate: '',
    endDate: '',
    curator: '',
    imageUrl: '',
    artworksCount: 0,
    artistCount: 0,
    ticketPrice: 0,
    maxCapacity: 50,
    featured: false,
  });

  // Fetch exhibitions from API
  const loadExhibitions = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.GET_ALL}?page=${currentPage - 1}&size=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch exhibitions');

      const data = await response.json();
      setExhibitions(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Error loading exhibitions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for dropdown
  const loadCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS_CATEGORIES.GET_ALL}?page=0&size=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Handle paginated response
        setCategories(data.content || data || []);
        console.log('Categories loaded:', data);
      } else {
        console.error('Failed to load categories:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };


  useEffect(() => {
    loadExhibitions();
    loadCategories();
  }, [currentPage]);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      location: '',
      startDate: '',
      endDate: '',
      curator: '',
      imageUrl: '',
      artworksCount: 0,
      artistCount: 0,
      ticketPrice: 0,
      maxCapacity: 50,
      featured: false,
    });
    setEditingExhibition(null);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (exhibition) => {
    setFormData({
      name: exhibition.name || '',
      description: exhibition.description || '',
      categoryId: exhibition.categoryId || '',
      location: exhibition.location || '',
      startDate: exhibition.startDate ? exhibition.startDate.split('T')[0] : '',
      endDate: exhibition.endDate ? exhibition.endDate.split('T')[0] : '',
      curator: exhibition.curator || '',
      imageUrl: exhibition.imageUrl || '',
      artworksCount: exhibition.artworksCount || 0,
      artistCount: exhibition.artistCount || 0,
      ticketPrice: exhibition.ticketPrice || 0,
      maxCapacity: exhibition.maxCapacity || 50,
      featured: exhibition.featured || false,
    });
    setEditingExhibition(exhibition);
    setShowCreateModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  // Create Exhibition
  const handleCreate = async () => {
    const token = localStorage.getItem('token');

    const payload = {
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId || null,
      location: formData.location,
      startDate: formData.startDate ? `${formData.startDate}T00:00:00` : null,
      endDate: formData.endDate ? `${formData.endDate}T23:59:59` : null,
      curator: formData.curator,
      imageUrl: formData.imageUrl,
      artworksCount: parseInt(formData.artworksCount) || 0,
      artistCount: parseInt(formData.artistCount) || 0,
      ticketPrice: parseFloat(formData.ticketPrice) || 0,
      maxCapacity: parseInt(formData.maxCapacity) || 50,
      featured: formData.featured
    };


    console.log('Creating exhibition with payload:', payload);

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.CREATE}`, {
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
        throw new Error(`Failed to create exhibition: ${response.status} - ${errorData}`);
      }

      await loadExhibitions();
      setShowCreateModal(false);
      alert('Exhibition created successfully!');
    } catch (err) {
      console.error('Error creating exhibition:', err);
      alert(`Error: ${err.message}`);
    }
  };


  // Update Exhibition
  const handleUpdate = async () => {
    const token = localStorage.getItem('token');

    const payload = {
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId || null,
      location: formData.location,
      startDate: formData.startDate ? `${formData.startDate}T00:00:00` : null,
      endDate: formData.endDate ? `${formData.endDate}T23:59:59` : null,
      curator: formData.curator,
      imageUrl: formData.imageUrl,
      artworksCount: parseInt(formData.artworksCount) || 0,
      artistCount: parseInt(formData.artistCount) || 0,
      ticketPrice: parseFloat(formData.ticketPrice) || 0,
      maxCapacity: parseInt(formData.maxCapacity) || 50,
      featured: formData.featured
    };


    console.log('Updating exhibition with payload:', payload);
    console.log('Exhibition ID:', editingExhibition.id);

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.UPDATE(editingExhibition.id)}`, {
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
        throw new Error(`Failed to update exhibition: ${response.status} - ${errorData}`);
      }

      await loadExhibitions();
      setShowCreateModal(false);
      alert('Exhibition updated successfully!');
    } catch (err) {
      console.error('Error updating exhibition:', err);
      alert(`Error: ${err.message}`);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingExhibition) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  // Delete Exhibition
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this exhibition?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.DELETE(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete exhibition');

      await loadExhibitions();
      alert('Exhibition deleted successfully!');
    } catch (err) {
      console.error('Error deleting exhibition:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const getStatusFromDates = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      active: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      completed: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return badges[status] || badges.upcoming;
  };

  // Pagination
  const totalPages = Math.ceil(totalElements / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Stats
  const upcomingCount = exhibitions.filter(e => getStatusFromDates(e.startDate, e.endDate) === 'upcoming').length;
  const activeCount = exhibitions.filter(e => getStatusFromDates(e.startDate, e.endDate) === 'active').length;
  const completedCount = exhibitions.filter(e => getStatusFromDates(e.startDate, e.endDate) === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Art Exhibitions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and organize art exhibitions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadExhibitions}
            disabled={loading}
            className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center space-x-2"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center space-x-2"
          >
            <FaPlus />
            <span>Create Exhibition</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Exhibitions</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalElements}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FaTheaterMasks className="text-purple-600 dark:text-purple-300 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{upcomingCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FaClock className="text-blue-600 dark:text-blue-300 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Active</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FaCheck className="text-green-600 dark:text-green-300 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <FaTheaterMasks className="text-gray-600 dark:text-gray-300 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-purple-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-xl">
          Error: {error}
        </div>
      )}

      {/* Exhibitions Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {exhibitions.map((exhibition) => {
            const status = getStatusFromDates(exhibition.startDate, exhibition.endDate);
            return (
              <div key={exhibition.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                  {exhibition.imageUrl ? (
                    <img src={exhibition.imageUrl} alt={exhibition.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaTheaterMasks className="text-white text-6xl" />
                  )}
                  {exhibition.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <FaStar /> Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{exhibition.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(status)}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {exhibition.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{exhibition.location || 'Location TBD'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FaClock className="mr-2" />
                      <span>
                        {exhibition.startDate ? new Date(exhibition.startDate).toLocaleDateString() : 'TBD'} -
                        {exhibition.endDate ? new Date(exhibition.endDate).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FaUsers className="mr-2" />
                      <span>{exhibition.registrations || 0} / {exhibition.maxCapacity || 50} capacity</span>
                    </div>
                    {exhibition.ticketPrice > 0 && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FaTicketAlt className="mr-2" />
                        <span>₹{exhibition.ticketPrice}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(exhibition)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(exhibition.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && exhibitions.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <FaTheaterMasks className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">No exhibitions found</h3>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Create your first exhibition to get started</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages} ({totalElements} total)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-all ${currentPage === pageNum
                    ? 'bg-purple-600 text-white'
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
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingExhibition ? 'Edit Exhibition' : 'Create New Exhibition'}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Exhibition Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter exhibition name..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter exhibition description..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location & Curator */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter venue/location..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Curator
                  </label>
                  <input
                    type="text"
                    name="curator"
                    value={formData.curator}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter curator name..."
                  />
                </div>
              </div>

              {/* Capacity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    name="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ticket Price (₹)
                  </label>
                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0 for free entry"
                  />
                </div>
              </div>

              {/* Artworks & Artists Count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Artworks Count *
                  </label>
                  <input
                    type="number"
                    name="artworksCount"
                    required
                    value={formData.artworksCount}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Number of artworks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Artist Count *
                  </label>
                  <input
                    type="number"
                    name="artistCount"
                    required
                    value={formData.artistCount}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Number of artists"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  required
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/exhibition-image.jpg"
                />
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Mark as Featured Exhibition
                </label>
              </div>


              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                >
                  {editingExhibition ? 'Update Exhibition' : 'Create Exhibition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExhibitions;
