import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaSearch, FaEye, FaTimes } from 'react-icons/fa';
import { artworksData } from '../../data/shopData';

const AdminShopArtworks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const categories = ['All', 'Painting', 'Sculpture', 'Digital Art', 'Abstract', 'Photography', 'Mixed Media', 'Drawing'];

  const [newArtwork, setNewArtwork] = useState({
    title: '',
    artist: { name: '', avatar: '' },
    description: '',
    longDescription: '',
    category: 'Painting',
    medium: '',
    sizeOptions: [],
    price: '',
    features: [],
    isAvailable: true,
    images: []
  });

  const [tempSizeOption, setTempSizeOption] = useState({
    label: '',
    width: '',
    height: '',
    price: '',
    unit: 'inches',
    isDefault: false
  });

  const [tempFeature, setTempFeature] = useState('');
  const [tempImage, setTempImage] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewArtwork({...newArtwork, images: [reader.result]});
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = () => {
    const stored = localStorage.getItem('shopArtworks');
    if (stored) {
      setArtworks(JSON.parse(stored));
    } else {
      setArtworks(artworksData);
      localStorage.setItem('shopArtworks', JSON.stringify(artworksData));
    }
  };

  const getFilteredArtworks = () => {
    return artworks.filter(artwork => {
      const artistName = typeof artwork.artist === 'string' ? artwork.artist : artwork.artist?.name || '';
      const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          artistName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || artwork.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Pagination
  const filteredArtworks = getFilteredArtworks();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtworks = filteredArtworks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddArtwork = () => {
    if (newArtwork.title && newArtwork.artist.name && newArtwork.medium && newArtwork.sizeOptions.length > 0) {
      const artwork = {
        id: editingArtwork?.id || `art-${Date.now()}`,
        title: newArtwork.title,
        artist: newArtwork.artist,
        description: newArtwork.description,
        longDescription: newArtwork.longDescription,
        category: newArtwork.category,
        medium: newArtwork.medium,
        sizeOptions: newArtwork.sizeOptions,
        price: newArtwork.sizeOptions.find(s => s.isDefault)?.price || newArtwork.sizeOptions[0].price,
        features: newArtwork.features,
        isAvailable: newArtwork.isAvailable,
        images: newArtwork.images.length > 0 ? newArtwork.images : ['/image-3.png'],
        likes: editingArtwork?.likes || 0,
        views: editingArtwork?.views || 0,
        createdAt: editingArtwork?.createdAt || new Date().toISOString()
      };
      
      let updated;
      if (editingArtwork) {
        updated = artworks.map(a => a.id === editingArtwork.id ? artwork : a);
      } else {
        updated = [...artworks, artwork];
      }
      
      setArtworks(updated);
      localStorage.setItem('shopArtworks', JSON.stringify(updated));
      
      setNewArtwork({
        title: '',
        artist: { name: '', avatar: '' },
        description: '',
        longDescription: '',
        category: 'Painting',
        medium: '',
        sizeOptions: [],
        price: '',
        features: [],
        isAvailable: true,
        images: []
      });
      setEditingArtwork(null);
      setShowAddModal(false);
      alert(editingArtwork ? 'Artwork updated!' : 'Artwork added!');
    } else {
      alert('Please fill required fields: Title, Artist Name, Medium, and at least one Size Option');
    }
  };

  const handleDeleteArtwork = (id) => {
    if (confirm('Delete this artwork?')) {
      const updated = artworks.filter(a => a.id !== id);
      setArtworks(updated);
      localStorage.setItem('shopArtworks', JSON.stringify(updated));
    }
  };

  const handleEditArtwork = (artwork) => {
    setEditingArtwork(artwork);
    setNewArtwork({
      ...artwork,
      artist: typeof artwork.artist === 'string' 
        ? { name: artwork.artist, avatar: '' } 
        : artwork.artist,
      sizeOptions: artwork.sizeOptions || [],
      features: artwork.features || [],
      longDescription: artwork.longDescription || '',
      images: artwork.images || []
    });
    setShowAddModal(true);
  };

  const stats = {
    total: artworks.length,
    totalViews: artworks.reduce((sum, a) => sum + a.views, 0),
    totalLikes: artworks.reduce((sum, a) => sum + a.likes, 0),
    totalValue: artworks.reduce((sum, a) => sum + a.price, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Student Artworks Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage student artworks for selling</p>
        </div>
        <button
          onClick={() => {
            setEditingArtwork(null);
            setNewArtwork({
              title: '',
              artist: { name: '', avatar: '' },
              description: '',
              category: 'Painting',
              medium: '',
              sizeOptions: [],
              price: '',
              features: [],
              isAvailable: true,
              images: []
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
        >
          <FaPlus />
          <span>Add Artwork</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat.toLowerCase()}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Artworks</div>
        <div className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.total}</div>
      </div>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArtworks.map(artwork => (
          <div key={artwork.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            {/* Image */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img src={artwork.images[0] || 'https://via.placeholder.com/300x200'} alt={artwork.title} className="w-full h-full object-cover" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  setSelectedArtwork(artwork);
                  setShowViewModal(true);
                }}
                className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FaEye size={16} />
                View
              </button>
              <button
                onClick={() => handleEditArtwork(artwork)}
                className="flex-1 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <FaEdit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDeleteArtwork(artwork.id)}
                className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <FaTrash size={16} />
                Delete
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{artwork.title}</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">By {typeof artwork.artist === 'string' ? artwork.artist : artwork.artist?.name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{artwork.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Medium:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{artwork.medium}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sizes:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{artwork.sizeOptions?.length || 1} options</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-lg">₹{artwork.price?.toLocaleString()}</span>
                </div>
              </div>
             
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredArtworks.length)} of {filteredArtworks.length} artworks
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

      {getFilteredArtworks().length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-xl text-center">
          <FaImage className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Artworks Found</h3>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[75vh] overflow-y-auto">
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-3">
                {/* Basic Info */}
                <input
                  type="text"
                  placeholder="Artwork Title *"
                  value={newArtwork.title}
                  onChange={(e) => setNewArtwork({...newArtwork, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />

                {/* Artist Info */}
                <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Artist Details</label>
                  <input
                    type="text"
                    placeholder="Artist Name *"
                    value={newArtwork.artist.name}
                    onChange={(e) => setNewArtwork({...newArtwork, artist: {...newArtwork.artist, name: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newArtwork.category}
                    onChange={(e) => setNewArtwork({...newArtwork, category: e.target.value})}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Medium (e.g., Oil, Acrylic) *"
                    value={newArtwork.medium}
                    onChange={(e) => setNewArtwork({...newArtwork, medium: e.target.value})}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={newArtwork.description}
                  onChange={(e) => setNewArtwork({...newArtwork, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  rows="4"
                />

                {/* Size Options Builder */}
                <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Size Options</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g., Small)"
                      value={tempSizeOption.label}
                      onChange={(e) => setTempSizeOption({...tempSizeOption, label: e.target.value})}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={tempSizeOption.price}
                      onChange={(e) => setTempSizeOption({...tempSizeOption, price: e.target.value})}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Width"
                      value={tempSizeOption.width}
                      onChange={(e) => setTempSizeOption({...tempSizeOption, width: e.target.value})}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Height"
                      value={tempSizeOption.height}
                      onChange={(e) => setTempSizeOption({...tempSizeOption, height: e.target.value})}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={tempSizeOption.unit}
                      onChange={(e) => setTempSizeOption({...tempSizeOption, unit: e.target.value})}
                      className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    >
                      <option value="inches">Inches</option>
                      <option value="cm">CM</option>
                    </select>
                    <label className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm">
                      <input
                        type="checkbox"
                        checked={tempSizeOption.isDefault}
                        onChange={(e) => setTempSizeOption({...tempSizeOption, isDefault: e.target.checked})}
                      />
                      Default
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (tempSizeOption.label && tempSizeOption.price) {
                          setNewArtwork({
                            ...newArtwork,
                            sizeOptions: [...(newArtwork.sizeOptions || []), {
                              id: `size-${Date.now()}`,
                              ...tempSizeOption,
                              width: parseFloat(tempSizeOption.width) || 0,
                              height: parseFloat(tempSizeOption.height) || 0,
                              price: parseFloat(tempSizeOption.price)
                            }]
                          });
                          setTempSizeOption({ label: '', width: '', height: '', price: '', unit: 'inches', isDefault: false });
                        }
                      }}
                      className="px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm whitespace-nowrap"
                    >
                      <FaPlus className="inline mr-1" /> Add
                    </button>
                  </div>
                  {newArtwork.sizeOptions?.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {newArtwork.sizeOptions.map((size, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-600 px-3 py-2 rounded text-sm">
                          <span className="font-medium">{size.label}</span>
                          <span>{size.width}x{size.height} {size.unit}</span>
                          <span className="font-bold">₹{size.price}</span>
                          {size.isDefault && <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">Default</span>}
                          <button
                            onClick={() => setNewArtwork({
                              ...newArtwork,
                              sizeOptions: newArtwork.sizeOptions.filter((_, i) => i !== idx)
                            })}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Features Manager */}
                <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Features</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add feature"
                      value={tempFeature}
                      onChange={(e) => setTempFeature(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempFeature.trim()) {
                          setNewArtwork({...newArtwork, features: [...(newArtwork.features || []), tempFeature.trim()]});
                          setTempFeature('');
                        }
                      }}
                      className="px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm whitespace-nowrap"
                    >
                      <FaPlus className="inline mr-1" /> Add
                    </button>
                  </div>
                  {newArtwork.features?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newArtwork.features.map((feature, idx) => (
                        <span key={idx} className="bg-white dark:bg-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {feature}
                          <button
                            onClick={() => setNewArtwork({
                              ...newArtwork,
                              features: newArtwork.features.filter((_, i) => i !== idx)
                            })}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Multiple Images */}
                <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Artwork Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewArtwork({...newArtwork, images: [...(newArtwork.images || []), reader.result]});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                  />
                  {newArtwork.images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {newArtwork.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                          <button
                            onClick={() => setNewArtwork({
                              ...newArtwork,
                              images: newArtwork.images.filter((_, i) => i !== idx)
                            })}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Availability */}
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newArtwork.isAvailable}
                    onChange={(e) => setNewArtwork({...newArtwork, isAvailable: e.target.checked})}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available for Purchase</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddArtwork}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingArtwork ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedArtwork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedArtwork.title}</h2>
                <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Images Gallery */}
              <div className="space-y-3">
                <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img src={selectedArtwork.images?.[0] || '/image-3.png'} alt={selectedArtwork.title} className="w-full h-full object-contain" />
                </div>
                {selectedArtwork.images?.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {selectedArtwork.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`View ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600" />
                    ))}
                  </div>
                )}
              </div>

              {/* Artist Info */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Artist Information</h3>
                <div className="flex items-center gap-3">
                  {selectedArtwork.artist?.avatar && (
                    <img src={selectedArtwork.artist.avatar} alt={selectedArtwork.artist.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-200 dark:ring-purple-700" />
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created by</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                      {typeof selectedArtwork.artist === 'string' ? selectedArtwork.artist : selectedArtwork.artist?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</div>
                  <div className="font-bold text-gray-800 dark:text-white">{selectedArtwork.category}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Medium</div>
                  <div className="font-bold text-gray-800 dark:text-white">{selectedArtwork.medium}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Base Price</div>
                  <div className="text-2xl font-bold text-purple-600">₹{selectedArtwork.price?.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Availability</div>
                  <div className="font-bold text-gray-800 dark:text-white">
                    {selectedArtwork.isAvailable ? (
                      <span className="text-green-600 dark:text-green-400">✓ Available</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">✗ Not Available</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Size Options */}
              {selectedArtwork.sizeOptions?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Available Sizes</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedArtwork.sizeOptions.map((size, idx) => (
                      <div key={idx} className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-800 dark:text-white">{size.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{size.width} × {size.height} {size.unit}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-600">₹{size.price?.toLocaleString()}</p>
                            {size.isDefault && <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded mt-1 inline-block">Default</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedArtwork.description}</p>
              </div>

              {/* Features */}
              {selectedArtwork.features?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedArtwork.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                        <FaCheck className="text-green-500 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditArtwork(selectedArtwork);
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
                >
                  <FaEdit className="inline mr-2" />
                  Edit Artwork
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShopArtworks;
