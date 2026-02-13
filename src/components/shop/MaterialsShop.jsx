import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaFilter, FaSpinner, FaExclamationTriangle, FaEye, FaTimes, FaCheck, FaBox, FaShieldAlt, FaTruck, FaBolt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';
import ImagePreviewModal from '../ui/ImagePreviewModal';
// Remove mock data import
import artMaterialsService from '../../services/artMaterialsService';

const MaterialsShop = () => {
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
  const { success } = useNotification();
  const { isStudent } = useAuth();
  const navigate = useNavigate();

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [materialsRes, categoriesRes] = await Promise.all([
          artMaterialsService.getAllMaterials(),
          artMaterialsService.getAllCategories()
        ]);

        if (materialsRes.success) {
          setProducts(materialsRes.data);
          setFilteredProducts(materialsRes.data);
        } else {
          console.error(materialsRes.message);
          setError("Failed to load materials.");
        }

        if (categoriesRes.success) {
          const categoryNames = categoriesRes.data.map(c => typeof c === 'string' ? c : c.name || c.title);
          setCategories(['All', ...categoryNames]);
        }

      } catch (err) {
        console.error("Error loading materials data:", err);
        setError("An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (searchTerm) => {
    let filtered = products;

    // Apply Category Filter first
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        const cat = product.categoryName || product.category?.name || product.category || '';
        return cat === selectedCategory;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
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
        const cat = product.categoryName || product.category?.name || product.category || '';
        return cat === category;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleAddToCart = (product, selectedSize, quantity = 1) => {
    const variant = product.variants?.find(s => s.id === selectedSize) ||
      product.variants?.find(s => s.isDefault) ||
      product.variants?.[0];

    // Calculate price from variant or product
    const basePrice = variant?.price || product.basePrice;
    const discountPrice = variant?.discountPrice || (product.discount > 0 ? (product.basePrice - (product.basePrice * product.discount / 100)) : 0);
    const price = discountPrice || basePrice;
    const sizeLabel = variant?.size || 'Standard';
    const stock = variant?.stock || product.stock;

    if (stock === 0) return;

    // Add to cart with specific variant ID if available
    const itemToAddId = variant?.id || product.id;

    addToCart({
      id: itemToAddId,
      productId: product.id,
      name: product.name,
      price: price,
      image: product.imageUrl || product.image,
      size: sizeLabel,
      quantity: quantity,
      stock: stock
    });

    success(`${quantity} × "${product.name}" (${sizeLabel}) added to cart!`);
  };


  const handleBuyNow = (product, selectedSize, quantity = 1) => {
    handleAddToCart(product, selectedSize, quantity);
    navigate('/cart'); // Go to cart first so user can review before checkout
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

      {/* Hero Section - Matching ArtworkShop Theme */}
      <section className="relative h-[45vh] bg-gray-900 overflow-hidden">
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
        {/* Controls Bar - Matching ArtworkShop Style */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700">
          <div className="w-full md:w-96">
            <SearchBar
              placeholder="Search materials, brands..."
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={() => setSelectedProduct(product)}
                  onAddToCart={(size, quantity) => handleAddToCart(product, size, quantity)}
                  onBuyNow={(size, quantity) => handleBuyNow(product, size, quantity)}
                  isStudent={isStudent}
                  navigate={navigate}
                  setPreviewImage={setPreviewImage}
                  setPreviewTitle={setPreviewTitle}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-xs">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No materials found.</p>
            <button onClick={() => { setSelectedCategory('All'); setFilteredProducts(products); }} className="mt-4 text-blue-600 hover:text-blue-500 font-medium">Clear Filters</button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(size, quantity) => {
            handleAddToCart(selectedProduct, size, quantity);
            setSelectedProduct(null);
          }}
          onBuyNow={(size, quantity) => {
            handleBuyNow(selectedProduct, size, quantity);
            setSelectedProduct(null);
          }}
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

const ProductCard = ({ product, onView, onAddToCart, onBuyNow, isStudent, navigate, setPreviewImage, setPreviewTitle }) => {
  const [selectedSize, setSelectedSize] = useState(
    product.variants?.find(s => s.isDefault)?.id || product.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);

  const currentSize = product.variants?.find(s => s.id === selectedSize);
  const displayPrice = Number(currentSize?.price) > 0 ? Number(currentSize?.price) : Number(product.basePrice);
  const displayDiscountPrice = Number(currentSize?.discountPrice) > 0 ? Number(currentSize?.discountPrice) : (product.discount > 0 ? (product.basePrice - (product.basePrice * product.discount / 100)) : 0);
  const stock = currentSize?.stock || product.stock;

  // Safe image access - use imageUrl from API
  const displayImage = product.imageUrl || product.image || 'https://via.placeholder.com/300?text=No+Image';

  const discountPercent = product.discount || (displayDiscountPrice && displayPrice > displayDiscountPrice
    ? Math.round(((displayPrice - displayDiscountPrice) / displayPrice) * 100)
    : 0);

  const finalDisplayPrice = displayDiscountPrice || displayPrice;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700 flex flex-col h-full hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm">
            -{discountPercent}%
          </div>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">Out of Stock</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
          <button
            onClick={() => {
              setPreviewImage(displayImage);
              setPreviewTitle(product.name);
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
          {product.categoryName}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer" onClick={onView}>
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Size/Option Selection */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-3">
            <select
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
                setQuantity(1);
              }}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:border-blue-500 outline-none cursor-pointer"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.size} - ₹{(variant.discountPrice || variant.price).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Row */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₹{finalDisplayPrice?.toLocaleString()}
            </span>
            {displayDiscountPrice > 0 && displayPrice > displayDiscountPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{displayPrice?.toLocaleString()}
              </span>
            )}
          </div>
          {stock > 0 && stock < 10 && (
            <span className="text-xs text-orange-500 font-semibold">Only {stock} left</span>
          )}
        </div>

        {/* Action Buttons */}
        {isStudent ? (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onAddToCart(selectedSize, quantity)}
              disabled={stock === 0}
              className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold text-sm transition disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(selectedSize, quantity)}
              disabled={stock === 0}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition shadow-md shadow-blue-500/20 disabled:opacity-50"
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

const ProductDetailModal = ({ product, onClose, onAddToCart, onBuyNow, isStudent, navigate }) => {
  const [selectedSize, setSelectedSize] = useState(
    product.variants?.find(s => s.isDefault)?.id || product.variants?.[0]?.id
  );
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Use API imageUrl field, not images array
  const displayImage = product.imageUrl || 'https://via.placeholder.com/300?text=No+Image';

  const currentSize = product.variants?.find(s => s.id === selectedSize);
  const displayPrice = Number(currentSize?.price) > 0 ? Number(currentSize?.price) : Number(product.basePrice);
  const displayDiscountPrice = Number(currentSize?.discountPrice) > 0 ? Number(currentSize?.discountPrice) : (product.discount > 0 ? (product.basePrice - (product.basePrice * product.discount / 100)) : 0);
  const stock = currentSize?.stock || product.stock;

  const finalPrice = displayDiscountPrice || displayPrice;

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(prev => prev + 1);
    }
  };
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <Modal isOpen={true} onClose={onClose} title="" size="lg">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-500 dark:text-gray-400 shadow-sm"
        >
          <FaTimes />
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images Left */}
          <div className="space-y-4">
            <div className="relative h-80 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
              <img
                src={displayImage}
                alt={product.name}
                className="max-w-full max-h-full object-contain p-4"
              />
            </div>
          </div>

          {/* Content Right */}
          <div className="space-y-6 flex flex-col h-full">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                {product.categoryName}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
            </div>

            <div className="prose dark:prose-invert text-sm text-gray-600 dark:text-gray-300 max-h-32 overflow-y-auto">
              <p>{product.description}</p>
            </div>

            {/* Selection Area */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-4 mt-auto">
              {/* Variant Options */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Variant</label>
                  <div className="flex flex-wrap gap-2"> {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedSize(variant.id);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedSize === variant.id
                        ? 'bg-white dark:bg-gray-700 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                        }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                  </div>
                </div>
              )}

              {/* Action Row */}
              <div className="flex items-end justify-between gap-4 pt-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{(finalPrice * quantity).toLocaleString()}</span>
                    <span className="text-sm text-gray-500 font-medium">for {quantity} unit{quantity > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Qty */}
                <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-1">
                  <button onClick={decreaseQuantity} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-lg font-bold text-gray-600 dark:text-gray-300">-</button>
                  <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                  <button onClick={increaseQuantity} disabled={quantity >= stock} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-lg font-bold text-gray-600 dark:text-gray-300 disabled:opacity-30">+</button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            {isStudent ? (
              <div className="flex gap-4">
                <button
                  onClick={() => onAddToCart(selectedSize, quantity)}
                  disabled={stock === 0}
                  className="flex-1 py-3.5 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-50"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => onBuyNow(selectedSize, quantity)}
                  disabled={stock === 0}
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-bold hover:bg-black dark:hover:bg-gray-600 transition"
              >
                Log in to Purchase
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};


export default MaterialsShop;
