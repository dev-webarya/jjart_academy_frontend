import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart, isLoading } = useCart();
  const { info } = useNotification();

  const handleRemove = (item) => {
    removeFromCart(item.id);
    info(`"${item.name}" removed from cart`);
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, newQuantity);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      info('Cart cleared');
    }
  };

  if (isLoading) {

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto text-purple-600 mb-4" size={50} />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="relative h-96 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/image-2.png"
              alt="Shopping Cart"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative container mx-auto px-4 pt-8 h-full flex flex-col items-center justify-center text-center z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Shopping Cart
            </h1>
            <p className="text-xl text-white/95 drop-shadow-lg font-semibold">Complete your order securely</p>
          </div>
        </div>

        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <FaShoppingBag className="mx-auto text-gray-400 mb-4" size={80} />
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Add some artworks or materials to get started!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/shop/artworks"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
                >
                  Browse Artworks
                </Link>
                <Link
                  to="/shop/materials"
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-all font-semibold"
                >
                  Browse Materials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const shippingFee = cartTotal > 2000 ? 0 : 150;
  const tax = Math.round(cartTotal * 0.18); // 18% GST
  const finalTotal = cartTotal + shippingFee + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/image-1.png"
            alt="Shopping Cart"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative container mx-auto px-4 pt-8 h-full flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Shopping Cart
          </h1>
          <p className="text-xl text-white/95 drop-shadow-lg font-semibold">Complete your order securely</p>
          <p className="text-lg text-white/80 drop-shadow-lg mt-2">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Order Details
            </h2>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-semibold hover:underline transition-all"
              >
                Clear Cart
              </button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2">
                              {item.name}
                            </h3>
                            {item.type === 'artwork' && item.artist && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Artist: {item.artist}
                              </p>
                            )}
                            {item.size && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Variant: {item.size}
                              </p>
                            )}
                            <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                              item.type === 'artwork' 
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            }`}>
                              {item.type === 'artwork' ? '🎨 Artwork' : '🖌️ Art Material'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
                            title="Remove from cart"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                          {/* Quantity Controls - Only for materials, artworks are unique (qty=1) */}
                          {item.type === 'material' ? (
                            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                              <button
                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                disabled={item.quantity === 1}
                                className="w-8 h-8 rounded-md bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                                title="Decrease quantity"
                              >
                                <FaMinus size={12} />
                              </button>
                              <span className="text-lg font-bold text-gray-800 dark:text-white w-10 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                className="w-8 h-8 rounded-md bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 flex items-center justify-center transition-all"
                                title="Increase quantity"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                                Unique Piece
                              </span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                            {item.type === 'material' && item.quantity > 1 && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ₹{item.price.toLocaleString()} × {item.quantity}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No items in cart</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-800 dark:text-white">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Shipping</span>
                    <span className="font-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-green-600 dark:text-green-400">FREE</span>
                      ) : (
                        <span className="text-gray-800 dark:text-white">₹{shippingFee}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Tax (GST 18%)</span>
                    <span className="font-semibold text-gray-800 dark:text-white">₹{tax.toLocaleString()}</span>
                  </div>

                  {cartTotal < 2000 && (
                    <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                      <p className="font-semibold mb-1">Free Shipping Available!</p>
                      Add ₹{(2000 - cartTotal).toLocaleString()} more for FREE shipping
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800 dark:text-white">Total:</span>
                    <span className="text-3xl font-bold text-purple-600">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2 text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout <FaArrowRight />
                </Link>

                <div className="mt-4">
                  <Link
                    to="/shop/artworks"
                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-semibold block text-center hover:underline transition-all"
                  >
                    ← Continue Shopping
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold">Secure Payments:</p>
                  <div className="flex gap-2 flex-wrap">
                    {['VISA', 'Mastercard', 'UPI', 'Razorpay'].map((method) => (
                      <span
                        key={method}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
