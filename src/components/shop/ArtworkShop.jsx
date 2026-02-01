import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaFilter, FaSpinner, FaExclamationTriangle, FaEye, FaTimes, FaHeart, FaShare } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';
import ImagePreviewModal from '../ui/ImagePreviewModal';
// Remove mock data import
import artWorksService from '../../services/artWorksService';

const ArtworkShop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image Preview State
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');

  const { addToCart } = useCart();
  const { success, error: showError } = useNotification();
  const { isStudent } = useAuth();
  const navigate = useNavigate();

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Artworks and Categories in parallel
        const [artworksRes, categoriesRes] = await Promise.all([
          artWorksService.getAllArtWorks(),
          artWorksService.getAllCategories()
        ]);

        if (artworksRes.success) {
          setProducts(artworksRes.data);
          setFilteredProducts(artworksRes.data);
        } else {
          // If fetching fails, we might want to show empty or handle error
          console.error(artworksRes.message);
          setError("Failed to load artworks.");
        }

        if (categoriesRes.success) {
          // Standardize categories to strings if they are objects
          const categoryNames = categoriesRes.data.map(c => typeof c === 'string' ? c : c.name || c.title);
          setCategories(['All', ...categoryNames]);
        }

      } catch (err) {
        console.error("Error loading shop data:", err);
        setError("An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (searchTerm) => {
    let filtered = products;

    // Apply Category Filter first if selected
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        const cat = product.category?.name || product.category || '';
        return cat === selectedCategory;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.artist?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    let filtered = products;

    if (category && category !== "All" && category !== "") {
      filtered = filtered.filter(product => {
        const cat = product.category?.name || product.category || '';
        return cat === category;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleAddToCart = (artwork, sizeOption, quantity = 1) => {
    // Logic to handle size/price variations if they exist
    const selectedVariant = sizeOption || artwork.sizeOptions?.find(s => s.isDefault) || artwork.sizeOptions?.[0];
    const price = selectedVariant?.price || artwork.price;
    const label = selectedVariant?.label || 'Standard';

    addToCart({
      id: `${artwork.id}-${selectedVariant?.id || 'standard'}`,
      name: artwork.title,
      price: price,
      image: Array.isArray(artwork.images) ? artwork.images[0] : artwork.image,
      type: 'artwork',
      artist: artwork.artist?.name || 'Unknown',
      size: label
    });
    success(`"${artwork.title}" added to cart!`);
  };

  const handleBuyNow = (artwork, sizeOption, quantity = 1) => {
    handleAddToCart(artwork, sizeOption, quantity);
    navigate('/checkout');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1600&q=80"
            alt="Art Gallery"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-gray-900/90"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            Curated <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">Masterpieces</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl drop-shadow-md">
            Discover and collect exceptional artworks from our talented community.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-12 -mt-20 relative z-20">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700">
          <div className="w-full md:w-96">
            <SearchBar
              placeholder="Search by title, artist..."
              onSearch={handleSearch}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"><FaFilter className="inline mr-1" /> Category:</span>
            <div className="flex gap-2">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => handleFilterChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${cat === selectedCategory
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {error ? (
          <div className="text-center py-20">
            <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">{error}</p>
          </div>
        ) : currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentProducts.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onView={() => setSelectedProduct(artwork)}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  isStudent={isStudent}
                  navigate={navigate}
                  setPreviewImage={setPreviewImage}
                  setPreviewTitle={setPreviewTitle}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xs">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No artworks found matching your criteria.</p>
            <button onClick={() => { setSelectedCategory('All'); setFilteredProducts(products); }} className="mt-4 text-blue-600 hover:text-blue-500 font-medium">Clear Filters</button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ArtworkDetailModal
          artwork={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isStudent={isStudent}
          navigate={navigate}
        />
      )}

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
        title={previewTitle}
      />
    </div>
  );
};

const ArtworkCard = ({ artwork, onView, onAddToCart, onBuyNow, isStudent, navigate, setPreviewImage, setPreviewTitle }) => {
  // Safe access to nested properties
  const images = Array.isArray(artwork.images) ? artwork.images : [artwork.image];
  const artistName = artwork.artist?.name || 'Unknown Artist';
  const categoryName = artwork.category?.name || artwork.category || 'Art';

  // Determine image source (handle potential missing images)
  const displayImage = images[0] || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={displayImage}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay with Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
          <button
            onClick={() => {
              setPreviewImage(displayImage);
              setPreviewTitle(artwork.title);
            }}
            className="p-3 bg-white/90 text-gray-900 rounded-full hover:bg-white transition hover:scale-110 shadow-lg"
            title="View Fullscreen"
          >
            <FaEye />
          </button>
          <button
            onClick={onView}
            className="px-5 py-2.5 bg-blue-600/90 text-white rounded-full hover:bg-blue-600 transition hover:scale-105 shadow-lg font-medium text-sm"
          >
            Details
          </button>
        </div>

        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm z-10">
          {categoryName}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-blue-600 cursor-pointer" onClick={onView}>
              {artwork.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">by {artistName}</p>
          </div>
          {artwork.artist?.avatar && (
            <img src={artwork.artist.avatar} alt={artistName} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600" />
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹{artwork.price?.toLocaleString() || 'N/A'}
          </span>

          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-red-500 transition">
              <FaHeart />
            </button>
            <button className="text-gray-400 hover:text-blue-500 transition">
              <FaShare />
            </button>
          </div>
        </div>

        {/* Action Buttons for Students */}
        {isStudent ? (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onAddToCart(artwork)}
              disabled={!artwork.isAvailable}
              className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold text-sm transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(artwork)}
              disabled={!artwork.isAvailable}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition shadow-md shadow-blue-500/20"
            >
              Buy Now
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg text-sm hover:bg-black dark:hover:bg-gray-600 transition font-medium"
          >
            Login to Buy
          </button>
        )}
      </div>
    </div>
  );
};

const ArtworkDetailModal = ({ artwork, onClose, onAddToCart, onBuyNow, isStudent, navigate }) => {
  const images = Array.isArray(artwork.images) ? artwork.images : [artwork.image];
  const [activeImage, setActiveImage] = useState(0);

  // Safely handle potentially missing data
  const categoryName = artwork.category?.name || artwork.category || 'Art';
  const artistName = artwork.artist?.name || 'Unknown Artist';
  const description = artwork.longDescription || artwork.description || 'No description available.';

  return (
    <Modal isOpen={true} onClose={onClose} title="" size="xl">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-20 p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-md text-gray-500 dark:text-gray-400"
        >
          <FaTimes />
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-inner">
              <img
                src={images[activeImage] || 'https://via.placeholder.com/600x800?text=No+Image'}
                alt={artwork.title}
                className="w-full h-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                {categoryName}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{artwork.title}</h2>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                {artwork.artist?.avatar && <img src={artwork.artist.avatar} alt="" className="w-6 h-6 rounded-full" />}
                <span className="font-medium">Created by {artistName}</span>
              </div>
            </div>

            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 mb-6 flex-grow overflow-y-auto max-h-48 pr-2">
              <p>{description}</p>
              {artwork.features && (
                <ul className="mt-4 space-y-1 list-none pl-0">
                  {artwork.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl mt-auto">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">₹{artwork.price?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${artwork.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {artwork.isAvailable ? 'In Stock' : 'Sold Out'}
                  </p>
                </div>
              </div>

              {isStudent ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => onAddToCart(artwork)}
                    disabled={!artwork.isAvailable}
                    className="flex-1 py-3.5 bg-white dark:bg-gray-700 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => onBuyNow(artwork)}
                    disabled={!artwork.isAvailable}
                    className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-bold hover:bg-black dark:hover:bg-gray-600 transition shadow-lg"
                >
                  Login to Purchase
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ArtworkShop;
