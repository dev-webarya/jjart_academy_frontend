import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import { FaCreditCard, FaUniversity, FaCheckCircle, FaTruck, FaShieldAlt, FaGift, FaArrowRight, FaSpinner } from 'react-icons/fa';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { success, error: showError } = useNotification();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'online',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(''); // 'creating', 'payment', 'verifying', 'success'

  const shippingCost = cartTotal >= 2000 ? 0 : 150;
  const tax = Math.round(cartTotal * 0.10);
  const finalTotal = cartTotal + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      showError('Your cart is empty!');
      return;
    }

    setIsLoading(true);
    setOrderStatus('creating');

    try {
      // Step 1: Create order by checking out cart
      // Build shipping address as a simple string (API expects string, not object)
      const shippingAddress = `${formData.fullName}, ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}, Phone: ${formData.phone}, Email: ${formData.email}`;

      let orderResult;

      try {
        // Attempt 1: Create order with explicit items/prices (Frontend Source of Truth)
        // This fixes the issue where backend cart has 0 prices
        const orderData = {
          shippingAddress,
          items: cartItems.map(item => {
            // Normalize type to backend enum (ARTWORK, MATERIAL)
            let type = item.productType;
            if (type === 'ART_WORK') type = 'ARTWORK';
            if (type === 'ART_MATERIAL') type = 'MATERIAL';

            return {
              itemId: item.productId || item.id, // Match backend naming
              itemType: type, // Match backend naming
              quantity: item.quantity,
              price: item.price
            };
          }),
          totalAmount: finalTotal
        };
        console.log('Attempting createOrder with explicit data:', orderData);
        orderResult = await orderService.createOrder(orderData);

        if (!orderResult.success) {
          throw new Error(orderResult.error || 'createOrder failed');
        }
      } catch (err) {
        console.warn('Explicit createOrder failed, falling back to checkoutCart:', err);
        // Attempt 2: Fallback to standard checkoutCart (Backend Source of Truth)
        // This works if backend logic is fixed or if createOrder endpoint doesn't exist
        orderResult = await orderService.checkoutCart(shippingAddress);
      }

      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      const order = orderResult.data;

      // If COD payment, mark as success directly
      if (formData.paymentMethod === 'cod') {
        setOrderStatus('success');
        success(`Order placed successfully! Order ID: ${order.orderNumber || order.id}`);
        clearCart();
        setTimeout(() => {
          navigate('/student/orders');
        }, 2000);
        return;
      }

      // Step 2: Initiate payment for online payment
      setOrderStatus('payment');
      const paymentResult = await paymentService.initiatePayment(order.id);

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Failed to initiate payment');
      }

      const paymentData = paymentResult.data;

      // Step 3: Open Razorpay checkout
      await paymentService.openRazorpayCheckout(
        paymentData,
        // On Success
        (verificationData) => {
          setOrderStatus('success');
          success(`Payment successful! Order ID: ${order.orderNumber || order.id}`);
          clearCart();
          setTimeout(() => {
            navigate('/student/orders');
          }, 2000);
        },
        // On Failure
        (errorData) => {
          setIsLoading(false);
          setOrderStatus('');
          if (errorData.cancelled) {
            showError('Payment was cancelled. You can retry or choose Cash on Delivery.');
          } else {
            showError(errorData.error || 'Payment failed. Please try again.');
          }
        },
        // User info for prefill
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }
      );

    } catch (err) {
      console.error('Checkout error:', err);
      showError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
      setOrderStatus('');
    }
  };

  const getStatusMessage = () => {
    switch (orderStatus) {
      case 'creating':
        return 'Creating your order...';
      case 'payment':
        return 'Opening payment gateway...';
      case 'verifying':
        return 'Verifying payment...';
      case 'success':
        return 'Order placed successfully!';
      default:
        return 'Processing...';
    }
  };

  if (cartItems.length === 0 && orderStatus !== 'success') {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-block p-6 bg-linear-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full">
            <FaCheckCircle className="text-5xl text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Add items to your cart before checkout</p>
          <button
            onClick={() => navigate('/shop/artworks')}
            className="px-8 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center gap-2 mx-auto"
          >
            Continue Shopping <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Hero Section */}
      <div className="relative h-80 md:h-96 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
          </div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">Secure Checkout</h1>
          <p className="text-lg md:text-xl text-white/95 drop-shadow-lg font-medium flex items-center justify-center gap-2">
            <FaShieldAlt /> Complete your order securely
          </p>
        </div>
      </div>

      <div className="py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <FaShieldAlt className="text-2xl text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Secure Payment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">100% encrypted</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <FaTruck className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Fast Delivery</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quick shipping</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <FaGift className="text-2xl text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Easy Returns</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">30 days money-back</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Shipping Information</h2>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors ${errors.fullName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                        } focus:outline-none disabled:opacity-50`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">✗ {errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                          } focus:outline-none disabled:opacity-50`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">✗ {errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                          } focus:outline-none disabled:opacity-50`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">✗ {errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address"
                      rows="3"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors ${errors.address ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                        } focus:outline-none resize-none disabled:opacity-50`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">✗ {errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors ${errors.city ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                          } focus:outline-none disabled:opacity-50`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">✗ {errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors ${errors.state ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                          } focus:outline-none disabled:opacity-50`}
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">✗ {errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Pincode"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-colors ${errors.pincode ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                          } focus:outline-none disabled:opacity-50`}
                      />
                      {errors.pincode && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">✗ {errors.pincode}</p>}
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-linear-to-r from-indigo-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${formData.paymentMethod === 'online'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                    } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mr-4"
                    />
                    <FaCreditCard className="text-3xl text-purple-600 mr-4" />
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">Online Payment</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Credit/Debit Card, UPI, Net Banking</div>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${formData.paymentMethod === 'cod'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                    } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mr-4"
                    />
                    <FaCheckCircle className="text-3xl text-green-600 mr-4" />
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">Cash on Delivery</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive your order</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-teal-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Summary</h2>
                </div>

                <div className="space-y-3 mb-6 max-h-72 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-purple-600 dark:text-purple-400">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 dark:border-gray-700 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-semibold text-gray-800 dark:text-white">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}>
                      {shippingCost === 0 ? '✓ FREE' : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                    <span className="font-semibold text-gray-800 dark:text-white">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white border-t-2 dark:border-gray-700 pt-3 bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-3 py-3 rounded-lg">
                    <span>Total</span>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {cartTotal < 2000 && (
                  <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                      🎉 Add ₹{(2000 - cartTotal).toLocaleString()} more for FREE shipping!
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {getStatusMessage()}
                    </>
                  ) : (
                    <>
                      {formData.paymentMethod === 'online' ? 'Pay Now' : 'Place Order'} <FaArrowRight />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
