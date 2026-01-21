import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBoxes, FaSearch, FaEye, FaTimes, FaCheck } from 'react-icons/fa';
import { materialsData } from '../../data/shopData';

const AdminShopMaterials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const categories = ['All', 'Paints', 'Brushes', 'Canvas', 'Paper', 'Drawing Tools', 'Sculpting', 'Accessories'];

  const [newMaterial, setNewMaterial] = useState({
    name: '',
    category: 'Paints',
    brand: '',
    price: '',
    discountPrice: '',
    stock: '',
    description: '',
    longDescription: '',
    sizeOptions: [],
    features: [],
    images: []
  });

  const [tempSizeOption, setTempSizeOption] = useState({
    label: '',
    pieces: '',
    price: '',
    stock: '',
    isDefault: false
  });

  const [tempFeature, setTempFeature] = useState('');
  const [tempImage, setTempImage] = useState('');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    const stored = localStorage.getItem('shopMaterials');
    if (stored) {
      setMaterials(JSON.parse(stored));
    } else {
      setMaterials(materialsData);
      localStorage.setItem('shopMaterials', JSON.stringify(materialsData));
    }
  };

  const getFilteredMaterials = () => {
    return materials.filter(material => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          material.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Pagination
  const filteredMaterials = getFilteredMaterials();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddMaterial = () => {
    if (newMaterial.name && newMaterial.brand && newMaterial.sizeOptions?.length > 0) {
      const defaultSize = newMaterial.sizeOptions.find(s => s.isDefault) || newMaterial.sizeOptions[0];
      const material = {
        id: editingProduct?.id || `mat-${Date.now()}`,
        name: newMaterial.name,
        description: newMaterial.description,
        longDescription: newMaterial.longDescription,
        category: newMaterial.category,
        brand: newMaterial.brand,
        price: defaultSize.price,
        discountPrice: defaultSize.price * 0.9,
        sizeOptions: newMaterial.sizeOptions,
        stock: newMaterial.sizeOptions.reduce((sum, s) => sum + s.stock, 0),
        rating: editingProduct?.rating || 4.5,
        reviews: editingProduct?.reviews || 0,
        features: newMaterial.features,
        images: newMaterial.images?.length > 0 ? newMaterial.images : ['/image-3.png']
      };
      
      let updated;
      if (editingProduct) {
        updated = materials.map(m => m.id === editingProduct.id ? material : m);
      } else {
        updated = [...materials, material];
      }
      
      setMaterials(updated);
      localStorage.setItem('shopMaterials', JSON.stringify(updated));
      
      setNewMaterial({
        name: '',
        category: 'Paints',
        brand: '',
        price: '',
        discountPrice: '',
        stock: '',
        description: '',
        longDescription: '',
        sizeOptions: [],
        features: [],
        images: []
      });
      setEditingProduct(null);
      setShowAddModal(false);
      alert(editingProduct ? 'Material updated!' : 'Material added!');
    } else {
      alert('Please fill required fields: Name, Brand, and at least one Size Option');
    }
  };

  const handleDeleteMaterial = (id) => {
    if (confirm('Delete this material?')) {
      const updated = materials.filter(m => m.id !== id);
      setMaterials(updated);
      localStorage.setItem('shopMaterials', JSON.stringify(updated));
    }
  };

  const handleEditMaterial = (material) => {
    setEditingProduct(material);
    setNewMaterial({
      ...material,
      sizeOptions: material.sizeOptions || [],
      features: material.features || [],
      longDescription: material.longDescription || '',
      images: material.images || []
    });
    setShowAddModal(true);
  };

  const stats = {
    total: materials.length,
    totalValue: materials.reduce((sum, m) => sum + (m.price * m.stock), 0),
    lowStock: materials.filter(m => m.stock < 10).length,
    avgRating: (materials.reduce((sum, m) => sum + m.rating, 0) / materials.length).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Art Materials Inventory</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage materials for selling</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setNewMaterial({
              name: '',
              category: 'Paints',
              brand: '',
              price: '',
              discountPrice: '',
              stock: '',
              description: '',
              longDescription: '',
              sizeOptions: [],
              features: [],
              images: []
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
        >
          <FaPlus />
          <span>Add Material</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
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
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
          <div className="text-sm text-green-600 dark:text-green-400">Inventory Value</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">₹{(stats.totalValue / 100000).toFixed(1)}L</div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentMaterials.map(material => (
          <div key={material.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
            {/* Image */}
            <div className="relative w-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 overflow-hidden" style={{ paddingBottom: '75%' }}>
              {material.images[0] ? (
                <img src={material.images[0]} alt={material.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBoxes className="text-3xl text-gray-400" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  setSelectedProduct(material);
                  setShowViewModal(true);
                }}
                className="flex-1 bg-blue-600 text-white p-1.5 rounded text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1"
              >
                <FaEye size={12} />
                View
              </button>
              <button
                onClick={() => handleEditMaterial(material)}
                className="flex-1 bg-purple-600 text-white p-1.5 rounded text-xs hover:bg-purple-700 transition flex items-center justify-center gap-1"
              >
                <FaEdit size={12} />
                Edit
              </button>
              <button
                onClick={() => handleDeleteMaterial(material.id)}
                className="flex-1 bg-red-600 text-white p-1.5 rounded text-xs hover:bg-red-700 transition flex items-center justify-center gap-1"
              >
                <FaTrash size={12} />
                Delete
              </button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2">{material.name}</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">{material.brand}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{material.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Size Options:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{material.sizeOptions?.length || 1} options</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Features:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{material.features?.length || 0} items</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                  <span className={`font-semibold ${material.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {material.stock} units
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-green-600 dark:text-green-400">₹{material.discountPrice}</span>
                    {material.discountPrice < material.price && (
                      <span className="text-xs text-gray-400 line-through">₹{material.price}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{material.rating}</span>
                  <span className="text-gray-400">({material.reviews})</span>
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMaterials.length)} of {filteredMaterials.length} materials
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

      {getFilteredMaterials().length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-xl text-center">
          <FaBoxes className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Materials Found</h3>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[75vh] overflow-y-auto">
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {editingProduct ? 'Edit Material' : 'Add New Material'}
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-3">
                {/* Basic Info */}
                <input
                  type="text"
                  placeholder="Material Name *"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Brand *"
                    value={newMaterial.brand}
                    onChange={(e) => setNewMaterial({...newMaterial, brand: e.target.value})}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                  <select
                    value={newMaterial.category}
                    onChange={(e) => setNewMaterial({...newMaterial, category: e.target.value})}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <textarea
                  placeholder="Description"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  rows="4"
                />

                {/* Size Options Builder for Materials */}
                <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Size/Pack Options</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g., 24-Pack)"
                      value={tempSizeOption.label}
                      onChange={(e) => setTempSizeOption({...tempSizeOption, label: e.target.value})}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Pieces"
                      value={tempSizeOption.pieces}
                      onChange={(e) => setTempSizeOption({...tempSizeOption, pieces: e.target.value})}
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
                      placeholder="Stock"
                      value={tempSizeOption.stock}
                      onChange={(e) => setTempSizeOption({...tempSizeOption, stock: e.target.value})}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
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
                        if (tempSizeOption.label && tempSizeOption.price && tempSizeOption.stock) {
                          setNewMaterial({
                            ...newMaterial,
                            sizeOptions: [...(newMaterial.sizeOptions || []), {
                              id: `size-${Date.now()}`,
                              ...tempSizeOption,
                              pieces: parseInt(tempSizeOption.pieces) || 1,
                              price: parseFloat(tempSizeOption.price),
                              stock: parseInt(tempSizeOption.stock)
                            }]
                          });
                          setTempSizeOption({ label: '', pieces: '', price: '', stock: '', isDefault: false });
                        }
                      }}
                      className="px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm whitespace-nowrap flex-1"
                    >
                      <FaPlus className="inline mr-1" /> Add Size Option
                    </button>
                  </div>
                  {newMaterial.sizeOptions?.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {newMaterial.sizeOptions.map((size, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-600 px-3 py-2 rounded text-sm">
                          <span className="font-medium">{size.label}</span>
                          <span>{size.pieces} pcs</span>
                          <span className="font-bold">₹{size.price}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">Stock: {size.stock}</span>
                          {size.isDefault && <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">Default</span>}
                          <button
                            onClick={() => setNewMaterial({
                              ...newMaterial,
                              sizeOptions: newMaterial.sizeOptions.filter((_, i) => i !== idx)
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
                          setNewMaterial({...newMaterial, features: [...(newMaterial.features || []), tempFeature.trim()]});
                          setTempFeature('');
                        }
                      }}
                      className="px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm whitespace-nowrap"
                    >
                      <FaPlus className="inline mr-1" /> Add
                    </button>
                  </div>
                  {newMaterial.features?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newMaterial.features.map((feature, idx) => (
                        <span key={idx} className="bg-white dark:bg-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {feature}
                          <button
                            onClick={() => setNewMaterial({
                              ...newMaterial,
                              features: newMaterial.features.filter((_, i) => i !== idx)
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
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Material Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewMaterial({...newMaterial, images: [...(newMaterial.images || []), reader.result]});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                  />
                  {newMaterial.images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {newMaterial.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                          <button
                            onClick={() => setNewMaterial({
                              ...newMaterial,
                              images: newMaterial.images.filter((_, i) => i !== idx)
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
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddMaterial}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  {editingProduct ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedProduct.name}</h2>
                <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Images Gallery */}
              <div className="space-y-3">
                <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img src={selectedProduct.images?.[0] || '/image-3.png'} alt={selectedProduct.name} className="w-full h-full object-contain" />
                </div>
                {selectedProduct.images?.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {selectedProduct.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`View ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600" />
                    ))}
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Brand</div>
                  <div className="font-bold text-gray-800 dark:text-white">{selectedProduct.brand}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</div>
                  <div className="font-bold text-gray-800 dark:text-white">{selectedProduct.category}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Stock</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">{selectedProduct.stock} units</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rating</div>
                  <div className="text-2xl font-bold text-yellow-500">⭐ {selectedProduct.rating}</div>
                </div>
              </div>

              {/* Price Info */}
              <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pricing</div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-purple-600">₹{selectedProduct.discountPrice?.toLocaleString()}</div>
                  {selectedProduct.discountPrice < selectedProduct.price && (
                    <div className="text-xl text-gray-500 line-through">₹{selectedProduct.price?.toLocaleString()}</div>
                  )}
                  {selectedProduct.discountPrice < selectedProduct.price && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Size/Pack Options */}
              {selectedProduct.sizeOptions?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Available Pack Sizes</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProduct.sizeOptions.map((size, idx) => (
                      <div key={idx} className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-800 dark:text-white">{size.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{size.pieces} pieces</p>
                          </div>
                          {size.isDefault && <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">Default</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-purple-600">₹{size.price?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Stock: {size.stock}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Features */}
              {selectedProduct.features?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Features & Benefits</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.features.map((feature, idx) => (
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
                    handleEditMaterial(selectedProduct);
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
                >
                  <FaEdit className="inline mr-2" />
                  Edit Material
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

export default AdminShopMaterials;
