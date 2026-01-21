import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaTimes, FaCheck, FaBox, FaTruck, FaShieldAlt, FaBolt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';
import { materialsData, categoriesData } from '../../data/shopData';

const MaterialsShop = () => {
  const [products, setProducts] = useState(materialsData);
  const [filteredProducts, setFilteredProducts] = useState(materialsData);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { addToCart } = useCart();
  const { success } = useNotification();
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    let filtered = products;

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleAddToCart = (product, selectedSize, quantity = 1) => {
    const sizeOption = product.sizeOptions?.find(s => s.id === selectedSize) || 
                      product.sizeOptions?.find(s => s.isDefault) || 
                      product.sizeOptions?.[0];
    
    const price = sizeOption?.discountPrice || sizeOption?.price || product.discountPrice || product.price;
    const sizeLabel = sizeOption?.label || 'Standard';
    const stock = sizeOption?.stock || product.stock;

    if (stock === 0) {
      return;
    }
    
    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: `${product.id}-${selectedSize || 'default'}`,
        name: product.name,
        price: price,
        image: product.images[0],
        type: 'material',
        brand: product.brand,
        size: sizeLabel,
      });
    }
    success(`${quantity} × "${product.name}" (${sizeLabel}) added to cart!`);
  };

  const handleBuyNow = (product, selectedSize, quantity = 1) => {
    handleAddToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://artfulparent.com/wp-content/uploads/2023/05/art-supplies-for-preschoolers.png"
            alt="Art Materials"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 pt-12 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Art Materials Shop
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-6 drop-shadow-lg">
            Quality art supplies for all your creative needs - from paints to canvases
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Search and Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          <div className="flex-1">
            <SearchBar 
              placeholder="Search materials, brands..." 
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
              {categoriesData.materials.filter(c => c !== 'All').map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredProducts.length} products found
              </p>
            </div>

            {currentProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onView={() => setSelectedProduct(product)}
                      onAddToCart={(size, quantity) => handleAddToCart(product, size, quantity)}
                      onBuyNow={(size, quantity) => handleBuyNow(product, size, quantity)}
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
        />
      )}
    </div>
  );
};

const ProductCard = ({ product, onView, onAddToCart, onBuyNow }) => {
  const [selectedSize, setSelectedSize] = useState(
    product.sizeOptions?.find(s => s.isDefault)?.id || product.sizeOptions?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);

  const currentSize = product.sizeOptions?.find(s => s.id === selectedSize);
  const displayPrice = currentSize?.price || product.price;
  const displayDiscountPrice = currentSize?.discountPrice || product.discountPrice;
  const stock = currentSize?.stock || product.stock;

  const discountPercent = displayDiscountPrice 
    ? Math.round(((displayPrice - displayDiscountPrice) / displayPrice) * 100)
    : 0;

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(prev => prev + 1);
    }
  };
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300">
      {/* Image */}
      <div className="relative h-56 overflow-hidden cursor-pointer group" onClick={onView}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -{discountPercent}% OFF
          </div>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        {stock > 0 && stock < 10 && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
            Only {stock} left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-purple-600 uppercase">{product.brand}</p>
          {product.rating && (
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{product.rating}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 hover:text-purple-600 cursor-pointer min-h-[3.5rem]" onClick={onView}>
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Size Selection */}
        {product.sizeOptions && product.sizeOptions.length > 0 && (
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Option:
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            >
              {product.sizeOptions.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.label} - ₹{(size.discountPrice || size.price).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          {displayDiscountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-purple-600">
                ₹{displayDiscountPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{displayPrice.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-purple-600">
              ₹{displayPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Quantity:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseQuantity}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold"
            >
              −
            </button>
            <span className="text-lg font-bold text-gray-800 dark:text-white w-10 text-center">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              disabled={quantity >= stock}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(selectedSize, quantity)}
            disabled={stock === 0}
            className="flex-1 px-2.5 py-2 bg-white dark:bg-gray-700 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-600 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 font-semibold text-sm"
          >
            <FaShoppingCart className="text-xs" /> Add
          </button>
          <button
            onClick={() => onBuyNow(selectedSize, quantity)}
            disabled={stock === 0}
            className="flex-1 px-2.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 font-semibold shadow-lg hover:shadow-xl text-sm"
          >
            <FaBolt className="text-xs" /> Buy
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductDetailModal = ({ product, onClose, onAddToCart, onBuyNow }) => {
  const [selectedSize, setSelectedSize] = useState(
    product.sizeOptions?.find(s => s.isDefault)?.id || product.sizeOptions?.[0]?.id
  );
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const currentSize = product.sizeOptions?.find(s => s.id === selectedSize);
  const displayPrice = currentSize?.price || product.price;
  const displayDiscountPrice = currentSize?.discountPrice || product.discountPrice;
  const stock = currentSize?.stock || product.stock;

  const discountPercent = displayDiscountPrice 
    ? Math.round(((displayPrice - displayDiscountPrice) / displayPrice) * 100)
    : 0;

  const finalPrice = displayDiscountPrice || displayPrice;

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(prev => prev + 1);
    }
  };
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
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full">
                -{discountPercent}% OFF
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
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
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-purple-600 uppercase">{product.brand}</p>
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({product.reviews} reviews)
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {product.name}
            </h2>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5">
              Product Description
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && (
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5">
                Key Features
              </h3>
              <div className="space-y-1">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-500 dark:text-gray-400 capitalize">{key}:</span>
                    <span className="ml-2 font-semibold text-gray-800 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))}
                <div>
                  <span className="text-gray-500 dark:text-gray-400">SKU:</span>
                  <span className="ml-2 font-semibold text-gray-800 dark:text-white">
                    {product.sku}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Option:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {product.sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                      selectedSize === size.id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-gray-800 dark:text-white">
                          {size.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Stock: {size.stock} units
                        </p>
                      </div>
                      <div className="text-right">
                        {size.discountPrice ? (
                          <div>
                            <p className="text-xl font-bold text-purple-600">
                              ₹{size.discountPrice.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ₹{size.price.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xl font-bold text-purple-600">
                            ₹{size.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <FaTruck className="text-2xl text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Free Delivery</p>
            </div>
            <div className="text-center">
              <FaShieldAlt className="text-2xl text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Secure Payment</p>
            </div>
          </div>

          {/* Price and Action */}
          <div className="space-y-2">
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
                  disabled={quantity >= stock}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              {quantity >= stock && stock > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Maximum available quantity reached
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">Total Price</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-purple-600">
                    ₹{(finalPrice * quantity).toLocaleString()}
                  </span>
                  {displayDiscountPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{displayDiscountPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0">
                  ₹{finalPrice.toLocaleString()} × {quantity} {quantity > 1 ? 'items' : 'item'}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full ${
                stock > 0
                  ? stock < 10
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                    : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              }`}>
                <span className="font-semibold text-sm">
                  {stock === 0 ? 'Out of Stock' : stock < 10 ? `Only ${stock} left` : 'In Stock'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(selectedSize, quantity)}
                disabled={stock === 0}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-600 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 font-semibold text-sm"
              >
                <FaShoppingCart className="text-sm" /> Add to Cart
              </button>
              <button
                onClick={() => onBuyNow(selectedSize, quantity)}
                disabled={stock === 0}
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

export default MaterialsShop;
