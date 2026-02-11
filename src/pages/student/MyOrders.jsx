import { useState, useEffect } from 'react';
import { FaShoppingBag, FaEye, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSearch, FaFilter, FaSpinner } from 'react-icons/fa';
import orderService from '../../services/orderService';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getMyOrders(0, 100);
      if (response.success) {
        const data = response.data?.content || response.data || [];
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
          icon: FaBox,
          color: 'yellow'
        };
      case 'PROCESSING':
        return {
          badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
          icon: FaBox,
          color: 'blue'
        };
      case 'SHIPPED':
        return {
          badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
          icon: FaTruck,
          color: 'purple'
        };
      case 'DELIVERED':
        return {
          badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
          icon: FaCheckCircle,
          color: 'green'
        };
      case 'CANCELLED':
        return {
          badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
          icon: FaTimesCircle,
          color: 'red'
        };
      default:
        return {
          badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
          icon: FaBox,
          color: 'gray'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return '₹0';
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const processingCount = orders.filter(o => o.status?.toUpperCase() === 'PROCESSING').length;
  const shippedCount = orders.filter(o => o.status?.toUpperCase() === 'SHIPPED').length;
  const deliveredCount = orders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length;

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesFilter = filter === 'all' || order.status?.toUpperCase() === filter.toUpperCase();
      const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">My Orders</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track your order history and status</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl">
          {error}
          <button onClick={loadOrders} className="ml-4 underline font-semibold">Retry</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Total Orders</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white">{orders.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <FaShoppingBag className="text-indigo-600 dark:text-indigo-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Processing</p>
              <p className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{processingCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FaBox className="text-blue-600 dark:text-blue-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Shipped</p>
              <p className="text-xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{shippedCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FaTruck className="text-purple-600 dark:text-purple-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Delivered</p>
              <p className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{deliveredCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600 dark:text-green-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {currentOrders.map(order => {
          const statusStyles = getStatusStyles(order.status);
          const StatusIcon = statusStyles.icon;

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border-l-4 hover:shadow-xl transition-all"
              style={{
                borderLeftColor: {
                  'PENDING': '#f59e0b',
                  'PROCESSING': '#3b82f6',
                  'SHIPPED': '#a855f7',
                  'DELIVERED': '#10b981',
                  'CANCELLED': '#ef4444'
                }[order.status?.toUpperCase()] || '#6b7280'
              }}
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Order #{order.orderNumber}</h3>
                    <div className="flex gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>📅 {formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles.badge}`}>
                    <StatusIcon className="inline mr-1" size={12} />
                    {order.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>

                {order.trackingNumber && (
                  <div className="text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Tracking: </span>
                    <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">{order.trackingNumber}</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-xs uppercase tracking-wider">📍 Shipping Address</h4>
                    <div className="text-xs text-gray-800 dark:text-white leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p>{order.shippingAddress || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-xs uppercase tracking-wider">📦 Items ({order.items?.length || 0})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {order.items?.map((item, index) => (
                        <div key={item.id || index} className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg flex gap-2">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.itemName}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-800 dark:text-white">{item.itemName || 'Item'}</p>
                            <div className="flex justify-between items-center mt-0.5">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity || 1}</span>
                              <span className="text-xs font-bold text-purple-600">{formatPrice(item.subtotal)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-xs uppercase tracking-wider">💰 Payment Summary</h4>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg space-y-1.5">
                      <div className="border-t border-purple-200 dark:border-purple-700 pt-2 flex justify-between">
                        <span className="font-bold text-gray-800 dark:text-white">Total Amount</span>
                        <span className="font-bold text-xl text-purple-600">{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailModal(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      <FaEye size={14} />
                      <span>View Details</span>
                    </button>
                    {order.deliveredAt && (
                      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                        <FaCheckCircle />
                        <span>Delivered on {formatDate(order.deliveredAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {currentOrders.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700 shadow-lg">
          <FaShoppingBag className="text-5xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
            {searchTerm || filter !== 'all' ? 'No Orders Found' : 'No Orders Yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Start shopping for art materials and supplies!'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Previous
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
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
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Order #{selectedOrder.orderNumber}</h2>
                  <p className="text-indigo-100 text-sm mt-1">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Order Status</p>
                  <p className={`text-lg font-bold ${selectedOrder.status?.toUpperCase() === 'DELIVERED' ? 'text-green-600' :
                      selectedOrder.status?.toUpperCase() === 'SHIPPED' ? 'text-purple-600' :
                        selectedOrder.status?.toUpperCase() === 'PROCESSING' ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                    {selectedOrder.status?.toUpperCase() || 'UNKNOWN'}
                  </p>
                </div>
                {selectedOrder.carrier && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Carrier</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{selectedOrder.carrier}</p>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  Shipping Address
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                  <p className="text-gray-800 dark:text-white font-medium">{selectedOrder.shippingAddress || 'Not specified'}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">📦</span>
                  Order Items ({selectedOrder.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={item.id || index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.itemName}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 dark:text-white">{item.itemName || 'Item'}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Type: {item.itemType || 'N/A'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity || 1}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Price: {formatPrice(item.unitPrice)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">{formatPrice(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  Payment Summary
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg space-y-3">
                  <div className="border-t-2 border-purple-200 dark:border-purple-700 pt-3 flex justify-between">
                    <span className="text-lg font-bold text-gray-800 dark:text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-purple-600">{formatPrice(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              {selectedOrder.trackingNumber && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Tracking Number</p>
                  <p className="font-mono text-lg font-bold text-yellow-700 dark:text-yellow-400">{selectedOrder.trackingNumber}</p>
                  {selectedOrder.trackingUrl && (
                    <a
                      href={selectedOrder.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline mt-2 inline-block"
                    >
                      Track Package
                    </a>
                  )}
                </div>
              )}

              {/* Delivery Info */}
              {selectedOrder.deliveredAt && (
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
                    <FaCheckCircle />
                    Delivered on {formatDate(selectedOrder.deliveredAt)}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
