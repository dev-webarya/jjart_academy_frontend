import { useState } from 'react';
import { FaShoppingCart, FaEye, FaCheck, FaTruck, FaBox, FaSearch, FaFilter } from 'react-icons/fa';

const AdminOrders = () => {
  const [filter, setFilter] = useState('all'); // all, pending, processing, shipped, delivered, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      fullName: 'Alice Johnson',
      studentId: 'A001',
      email: 'alice@example.com',
      phone: '+91 98765 43210',
      date: '2024-12-01',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      items: [
        { 
          id: 1,
          name: 'Sunset Dreams (Artwork)', 
          price: 2500, 
          quantity: 1, 
          type: 'artwork',
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400'
        },
        { 
          id: 2,
          name: 'Acrylic Paint Set', 
          price: 1299, 
          quantity: 2, 
          type: 'material',
          image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400'
        },
      ],
      address: '123 MG Road, Apartment 5B',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      subtotal: 5098,
      shipping: 150,
      tax: 510,
      total: 5758,
      status: 'pending',
      paymentMethod: 'UPI',
    },
    {
      id: 'ORD002',
      fullName: 'Bob Smith',
      studentId: 'A002',
      email: 'bob@example.com',
      phone: '+91 98765 43211',
      date: '2024-12-03',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      items: [
        { 
          id: 3,
          name: 'Professional Brushes', 
          price: 899, 
          quantity: 1, 
          type: 'material',
          image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400'
        },
        { 
          id: 4,
          name: 'Stretched Canvas', 
          price: 499, 
          quantity: 3, 
          type: 'material',
          image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400'
        },
      ],
      address: '456 Park Street, Floor 3',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      subtotal: 2396,
      shipping: 150,
      tax: 255,
      total: 2801,
      status: 'shipped',
      paymentMethod: 'Card',
      trackingNumber: 'TRK123456789',
    },
    {
      id: 'ORD003',
      fullName: 'Charlie Brown',
      studentId: 'B001',
      email: 'charlie@example.com',
      phone: '+91 98765 43212',
      date: '2024-12-05',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
      items: [
        { 
          id: 5,
          name: 'Urban Life (Artwork)', 
          price: 1800, 
          quantity: 1, 
          type: 'artwork',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'
        },
      ],
      address: '789 Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560025',
      subtotal: 1800,
      shipping: 150,
      tax: 195,
      total: 2145,
      status: 'delivered',
      paymentMethod: 'COD',
      deliveredDate: '2024-12-07',
    },
  ]);

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesFilter = filter === 'all' || order.status === filter;
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  const viewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
  };

  const filteredOrders = getFilteredOrders();
  
  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Orders Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Process and track customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <div className="text-sm text-blue-600 dark:text-blue-400">Processing</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.processing}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
          <div className="text-sm text-purple-600 dark:text-purple-400">Shipped</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.shipped}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
          <div className="text-sm text-green-600 dark:text-green-400">Delivered</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.delivered}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaSearch className="inline mr-2" />
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaFilter className="inline mr-2" />
              Filter by Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
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

      {/* Orders Cards View */}
      <div className="space-y-3">
        {currentOrders.map(order => (
          <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border-l-4" style={{
            borderLeftColor: {
              'pending': '#f59e0b',
              'processing': '#3b82f6',
              'shipped': '#a855f7',
              'delivered': '#10b981',
              'cancelled': '#ef4444'
            }[order.status]
          }}>
            {/* Header Section with Customer Info */}
            <div className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-4 flex-1">
                  {/* Customer Avatar */}
                  <div className="shrink-0">
                    <img 
                      src={order.avatar} 
                      alt={order.customer}
                      className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-600 shadow-md"
                    />
                  </div>
                  
                  {/* Customer Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{order.fullName}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Student ID: {order.studentId}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>📧 {order.email}</span>
                      <span>📱 {order.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Order ID and Status */}
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800 dark:text-white">Order {order.id}</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Date and Payment */}
              <div className="flex gap-4 text-xs mt-2">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">📅 Order Date</p>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">{order.date}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">💳 Payment Method</p>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">{order.paymentMethod}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Tracking Number</p>
                    <p className="font-mono font-semibold text-purple-600">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Shipping Address */}
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-xs uppercase tracking-wider">📍 Shipping Address</h4>
                  <div className="text-xs text-gray-800 dark:text-white leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <p>{order.address}</p>
                    <p>{order.city}, {order.state} - {order.pincode}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-xs uppercase tracking-wider">📦 Items ({order.items.length})</h4>
                  <div className="space-y-1.5">
                    {order.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg flex gap-2">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-800 dark:text-white">{item.name}</p>
                          <div className="flex justify-between items-center mt-0.5">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                            <span className="text-xs font-bold text-purple-600">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-xs uppercase tracking-wider">💰 Payment Summary</h4>
                  <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                      <span className="font-medium">₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                      <span className="font-medium">₹{order.shipping}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Tax</span>
                      <span className="font-medium">₹{order.tax}</span>
                    </div>
                    <div className="border-t border-purple-200 dark:border-purple-700 pt-2 flex justify-between">
                      <span className="font-bold text-gray-800 dark:text-white">Total Amount</span>
                      <span className="font-bold text-xl text-purple-600">₹{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => viewDetails(order)}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-all flex items-center gap-1 font-medium"
                >
                  <FaEye size={14} />
                  View Details
                </button>
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'processing')}
                    className="px-4 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-all flex items-center gap-1 font-medium"
                  >
                    <FaBox size={14} />
                    Processing
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'shipped')}
                    className="px-4 py-1.5 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-all flex items-center gap-1 font-medium"
                  >
                    <FaTruck size={14} />
                    Shipped
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="px-4 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-all flex items-center gap-1 font-medium"
                  >
                    <FaCheck size={14} />
                    Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredOrders.length === 0 && (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-xl text-center">
            <FaShoppingCart className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Orders Found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
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
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b dark:border-gray-700 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order {selectedOrder.id}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Placed on {selectedOrder.date}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ₹{getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">Customer Details</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600 dark:text-gray-400"><strong>Name:</strong> {selectedOrder.fullName}</p>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Email:</strong> {selectedOrder.email}</p>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Phone:</strong> {selectedOrder.phone}</p>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Student ID:</strong> {selectedOrder.studentId}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">Payment Details</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600 dark:text-gray-400"><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                    {selectedOrder.trackingNumber && (
                      <p className="text-gray-600 dark:text-gray-400"><strong>Tracking:</strong> {selectedOrder.trackingNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Shipping Address</h3>
                <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                  <p>{selectedOrder.address}</p>
                  <p>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-bold text-gray-800 dark:text-white">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping:</span>
                  <span>₹{selectedOrder.shipping}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax:</span>
                  <span>₹{selectedOrder.tax}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white border-t dark:border-gray-700 pt-2">
                  <span>Total:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
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

export default AdminOrders;
