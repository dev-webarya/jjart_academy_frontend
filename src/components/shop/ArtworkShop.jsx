import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaEye, FaStar, FaTimes, FaCheck, FaBox, FaBolt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';
import { artworksData, categoriesData } from '../../data/shopData';

const ArtworkShop = () => {
  const [artworks, setArtworks] = useState(artworksData);
  const [filteredArtworks, setFilteredArtworks] = useState(artworksData);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { addToCart } = useCart();
  const { success } = useNotification();
  const navigate = useNavigate();
  const handleSearch = (searchTerm) => {
    let filtered = artworks;
    
    if (searchTerm) {
      filtered = filtered.filter(art =>
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredArtworks(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    let filtered = artworks;

    if (filters.category) {
      filtered = filtered.filter(art => art.category === filters.category);
    }

    setFilteredArtworks(filtered);
    setCurrentPage(1);
  };

  const handleAddToCart = (artwork, selectedSize, quantity = 1) => {
    const sizeOption = artwork.sizeOptions?.find(s => s.id === selectedSize) || 
                      artwork.sizeOptions?.find(s => s.isDefault) || 
                      artwork.sizeOptions?.[0];
    
    const price = sizeOption?.price || artwork.price;
    const sizeLabel = sizeOption?.label || `${artwork.size?.width}×${artwork.size?.height}"`;

    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: `${artwork.id}-${selectedSize || 'default'}`,
        name: artwork.title,
        price: price,
        image: artwork.images[0],
        type: 'artwork',
        artist: artwork.artist.name,
        size: sizeLabel,
      });
    }
    success(`${quantity} × "${artwork.title}" (${sizeLabel}) added to cart!`);
  };

  const handleBuyNow = (artwork, selectedSize, quantity = 1) => {
    handleAddToCart(artwork, selectedSize, quantity);
    navigate('/checkout');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtworks = filteredArtworks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-linear-to-r from-indigo-900 via-purple-800 to-pink-700 overflow-hidden">
        <img
          src="/image-3.png"
          alt="Student Artworks Hero Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
        />
        <div className="absolute inset-0 z-1"></div>
        <div className="relative container mx-auto px-4 pt-20 h-full flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Student Artworks Gallery
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-6 drop-shadow-lg">
            Discover and purchase beautiful artworks created by our talented students
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Search and Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          <div className="flex-1">
            <SearchBar 
              placeholder="Search artworks, artists..." 
              onSearch={handleSearch}
            />
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="">All Category</option>
              {categoriesData.artworks.filter(c => c !== 'All').map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Artworks Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredArtworks.length} artworks found
              </p>
            </div>

            {currentArtworks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No artworks found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {currentArtworks.map((artwork) => (
                    <ArtworkCard
                      key={artwork.id}
                      artwork={artwork}
                      onView={() => setSelectedArtwork(artwork)}
                      onAddToCart={(size, quantity) => handleAddToCart(artwork, size, quantity)}
                      onBuyNow={(size, quantity) => handleBuyNow(artwork, size, quantity)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <ArtworkDetailModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onAddToCart={(size, quantity) => {
            handleAddToCart(selectedArtwork, size, quantity);
            setSelectedArtwork(null);
          }}
          onBuyNow={(size, quantity) => {
            handleBuyNow(selectedArtwork, size, quantity);
            setSelectedArtwork(null);
          }}
        />
      )}
    </div>
  );
};

const ArtworkCard = ({ artwork, onView, onAddToCart, onBuyNow }) => {
  const [selectedSize, setSelectedSize] = useState(
    artwork.sizeOptions?.find(s => s.isDefault)?.id || artwork.sizeOptions?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);

  const currentSize = artwork.sizeOptions?.find(s => s.id === selectedSize);
  const displayPrice = currentSize?.price || artwork.price;

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300">
      {/* Image */}
      <div className="relative h-64 overflow-hidden cursor-pointer group" onClick={onView}>
        <img
          src={artwork.images[0]}
          alt={artwork.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm font-semibold flex items-center gap-2">
              <FaEye /> Click for details
            </p>
          </div>
        </div>
        {artwork.isAvailable && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1 hover:text-purple-600 cursor-pointer" onClick={onView}>
          {artwork.title}
        </h3>
        
        {/* Artist */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={artwork.artist.avatar}
            alt={artwork.artist.name}
            className="w-8 h-8 rounded-full ring-2 ring-purple-200"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            by <span className="font-semibold">{artwork.artist.name}</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {artwork.description}
        </p>

        {/* Size Selection */}
        {artwork.sizeOptions && artwork.sizeOptions.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Size:
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            >
              {artwork.sizeOptions.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.label} - ₹{size.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Details */}
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
            {artwork.medium}
          </span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
            {artwork.category}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Quantity:
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={decreaseQuantity}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold text-lg"
            >
              −
            </button>
            <span className="text-xl font-bold text-gray-800 dark:text-white w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Price</p>
          <span className="text-lg font-bold text-purple-600">
            ₹{(displayPrice * quantity).toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(selectedSize, quantity)}
            disabled={!artwork.isAvailable}
            className="flex-1 px-2.5 py-2 bg-white dark:bg-gray-700 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-600 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 font-semibold text-sm"
          >
            <FaShoppingCart className="text-xs" /> Add
          </button>
          <button
            onClick={() => onBuyNow(selectedSize, quantity)}
            disabled={!artwork.isAvailable}
            className="flex-1 px-2.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 font-semibold shadow-lg hover:shadow-xl text-sm"
          >
            <FaBolt className="text-xs" /> Buy
          </button>
        </div>
      </div>
    </div>
  );
};

const ArtworkDetailModal = ({ artwork, onClose, onAddToCart, onBuyNow }) => {
  const [selectedSize, setSelectedSize] = useState(
    artwork.sizeOptions?.find(s => s.isDefault)?.id || artwork.sizeOptions?.[0]?.id
  );
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const currentSize = artwork.sizeOptions?.find(s => s.id === selectedSize);
  const displayPrice = currentSize?.price || artwork.price;
  const sizeInfo = currentSize || { width: artwork.size?.width, height: artwork.size?.height };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <Modal isOpen={true} onClose={onClose} title="" size="lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-50 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
      >
        <FaTimes className="text-gray-600 dark:text-gray-300" />
      </button>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Images */}
        <div className="space-y-2">
          <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={artwork.images[activeImage]}
              alt={artwork.title}
              className="w-full h-full object-contain"
            />
          </div>
          {artwork.images.length > 1 && (
            <div className="flex gap-2">
              {artwork.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === idx
                      ? 'border-purple-600 ring-2 ring-purple-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1.5">
              {artwork.title}
            </h2>
            <div className="flex items-center gap-2">
              <img
                src={artwork.artist.avatar}
                alt={artwork.artist.name}
                className="w-12 h-12 rounded-full ring-2 ring-purple-200"
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created by</p>
                <p className="font-semibold text-lg text-gray-800 dark:text-white">
                  {artwork.artist.name}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5">
              About this Artwork
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {artwork.description}
            </p>
          </div>

          {/* Features */}
          {artwork.features && (
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5">
                Features
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {artwork.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5">
              Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                <span className="ml-2 font-semibold text-gray-800 dark:text-white">
                  {artwork.category}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Medium:</span>
                <span className="ml-2 font-semibold text-gray-800 dark:text-white">
                  {artwork.medium}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Dimensions:</span>
                <span className="ml-2 font-semibold text-gray-800 dark:text-white">
                  {sizeInfo.width} × {sizeInfo.height} {sizeInfo.unit || 'inches'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Views:</span>
                <span className="ml-2 font-semibold text-gray-800 dark:text-white">
                  {artwork.views}
                </span>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          {artwork.sizeOptions && artwork.sizeOptions.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Size:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {artwork.sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`p-2 rounded-lg border-2 text-left transition-all ${
                      selectedSize === size.id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {size.label.split('(')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {size.width}×{size.height}"
                    </p>
                    <p className="text-lg font-bold text-purple-600 mt-1">
                      ₹{size.price.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price and Action */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 space-y-2">
            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Quantity:
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold text-base"
                >
                  −
                </button>
                <span className="text-lg font-bold text-gray-800 dark:text-white w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold text-base"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">Total Price</p>
                <span className="text-xl font-bold text-purple-600">
                  ₹{(displayPrice * quantity).toLocaleString()}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0">
                  ₹{displayPrice.toLocaleString()} × {quantity} {quantity > 1 ? 'items' : 'item'}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full ${
                artwork.isAvailable 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              }`}>
                <span className="font-semibold text-sm">
                  {artwork.isAvailable ? 'In Stock' : 'Sold Out'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(selectedSize, quantity)}
                disabled={!artwork.isAvailable}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-600 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 font-semibold text-sm"
              >
                <FaShoppingCart className="text-sm" /> Add to Cart
              </button>
              <button
                onClick={() => onBuyNow(selectedSize, quantity)}
                disabled={!artwork.isAvailable}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 font-bold shadow-lg hover:shadow-xl text-sm"
              >
                <FaBolt /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ArtworkShop;
