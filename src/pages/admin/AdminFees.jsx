import { useState, useEffect } from 'react';
import { 
  FaMoneyBillWave, FaSearch, FaFilter, FaDownload, FaCheckCircle, FaTimesCircle,
  FaExclamationCircle, FaSync, FaFileInvoice, FaEdit, FaEye, FaPrint, FaPlus
} from 'react-icons/fa';

const AdminFees = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    notes: ''
  });

  useEffect(() => {
    loadFeeData();
  }, []);

  useEffect(() => {
    filterData();
  }, [students, searchTerm, filterClass, filterStatus]);

  const loadFeeData = () => {
    // Load students from localStorage
    const studentsData = localStorage.getItem('students');
    const feesData = localStorage.getItem('studentFees');
    if (studentsData) {
      const students = JSON.parse(studentsData);
      const fees = feesData ? JSON.parse(feesData) : {};
      // Merge student data with fee data
      const studentsWithFees = students.map(student => ({
        ...student,
        feeStructure: fees[student.id]?.feeStructure || {
          totalFee: student.enrolledClass === 'UKG' ? 12000 : 15000,
          paidAmount: fees[student.id]?.paidAmount || 0,
          dueDate: '2024-12-31'
        },
        payments: fees[student.id]?.payments || []
      }));

      setStudents(studentsWithFees);
    }
  };

  const filterData = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.phone.includes(searchTerm)
      );
    }

    if (filterClass !== 'all') {
      filtered = filtered.filter(s => s.enrolledClass === filterClass);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => {
        const status = getFeeStatus(s);
        return status === filterStatus;
      });
    }

    setFilteredStudents(filtered);
  };

  const getFeeStatus = (student) => {
    const { totalFee, paidAmount } = student.feeStructure;
    if (paidAmount >= totalFee) return 'paid';
    if (paidAmount > 0) return 'partial';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'pending': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePayment = (student) => {
    setSelectedStudent(student);
    setShowPaymentModal(true);
    const remaining = student.feeStructure.totalFee - student.feeStructure.paidAmount;
    setPaymentData({
      amount: remaining.toString(),
      paymentMethod: 'cash',
      transactionId: '',
      notes: ''
    });
  };

  const submitPayment = (e) => {
    e.preventDefault();
    
    const amount = parseFloat(paymentData.amount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const payment = {
      id: Date.now(),
      amount: amount,
      date: new Date().toISOString(),
      method: paymentData.paymentMethod,
      transactionId: paymentData.transactionId,
      notes: paymentData.notes
    };

    // Update student fee data
    const updatedStudents = students.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          feeStructure: {
            ...s.feeStructure,
            paidAmount: s.feeStructure.paidAmount + amount
          },
          payments: [...(s.payments || []), payment]
        };
      }
      return s;
    });

    setStudents(updatedStudents);

    // Save to localStorage
    const feesData = {};
    updatedStudents.forEach(student => {
      feesData[student.id] = {
        feeStructure: student.feeStructure,
        paidAmount: student.feeStructure.paidAmount,
        payments: student.payments
      };
    });
    localStorage.setItem('studentFees', JSON.stringify(feesData));

    alert('Payment recorded successfully!');
    setShowPaymentModal(false);
    setSelectedStudent(null);
    setPaymentData({ amount: '', paymentMethod: 'cash', transactionId: '', notes: '' });
  };

  const stats = {
    totalStudents: students.length,
    totalCollection: students.reduce((sum, s) => sum + s.feeStructure.paidAmount, 0),
    totalPending: students.reduce((sum, s) => sum + (s.feeStructure.totalFee - s.feeStructure.paidAmount), 0),
    paidCount: students.filter(s => getFeeStatus(s) === 'paid').length,
    partialCount: students.filter(s => getFeeStatus(s) === 'partial').length,
    pendingCount: students.filter(s => getFeeStatus(s) === 'pending').length
  };

  const classes = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Fee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage student fee payments</p>
        </div>
       
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.totalStudents}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl shadow-md">
          <div className="text-sm text-green-600 dark:text-green-400">Fully Paid</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.paidCount}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl shadow-md">
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Partial Paid</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.partialCount}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl shadow-md">
          <div className="text-sm text-red-600 dark:text-red-400">Unpaid</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.pendingCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaSearch className="inline mr-2" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, roll number, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaFilter className="inline mr-2" />
              Filter by Class
            </label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaFilter className="inline mr-2" />
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="paid">Fully Paid</option>
              <option value="partial">Partial Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Total Fee
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Paid Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentStudents.length > 0 ? (
                currentStudents.map((student) => {
                  const status = getFeeStatus(student);
                  const pending = student.feeStructure.totalFee - student.feeStructure.paidAmount;
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {student.rollNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.enrolledClass}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{student.feeStructure.totalFee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                        ₹{student.feeStructure.paidAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400">
                        ₹{pending.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded uppercase ${getStatusColor(status)}`}>
                          {status === 'paid' ? 'Paid' : status === 'partial' ? 'Partial' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {status !== 'paid' && (
                            <button
                              onClick={() => handlePayment(student)}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center gap-1"
                              title="Add Payment"
                            >
                              <FaMoneyBillWave />
                              Pay
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-1"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => alert('Print receipt feature coming soon!')}
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors flex items-center gap-1"
                            title="Print Receipt"
                          >
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <FaMoneyBillWave className="text-gray-400 text-6xl mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-xl">
                      No fee records found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} students
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
                      ? 'bg-green-600 text-white'
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

      {/* Payment Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Record Payment</h2>
              <p className="text-sm mt-1">{selectedStudent.name} - {selectedStudent.rollNumber}</p>
            </div>
            
            <form onSubmit={submitPayment} className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Fee:</span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    ₹{selectedStudent.feeStructure.totalFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Already Paid:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ₹{selectedStudent.feeStructure.paidAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    ₹{(selectedStudent.feeStructure.totalFee - selectedStudent.feeStructure.paidAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Payment Amount *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method *
                </label>
                <select
                  required
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="card">Card</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              {paymentData.paymentMethod !== 'cash' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="Enter transaction ID"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Add any notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                >
                  Record Payment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedStudent(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && !showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
              <p className="text-sm mt-1">Roll No: {selectedStudent.rollNumber} | Class: {selectedStudent.enrolledClass}</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">Fee Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Fee:</span>
                    <span className="font-bold text-gray-800 dark:text-white">₹{selectedStudent.feeStructure.totalFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Paid Amount:</span>
                    <span className="font-bold text-green-600">₹{selectedStudent.feeStructure.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600 dark:text-gray-400">Pending Amount:</span>
                    <span className="font-bold text-red-600">₹{(selectedStudent.feeStructure.totalFee - selectedStudent.feeStructure.paidAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selectedStudent.payments && selectedStudent.payments.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">Payment History</h3>
                  <div className="space-y-2">
                    {selectedStudent.payments.map((payment) => (
                      <div key={payment.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">₹{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(payment.date).toLocaleDateString()} - {payment.method.toUpperCase()}
                          </p>
                          {payment.transactionId && (
                            <p className="text-xs text-gray-500">ID: {payment.transactionId}</p>
                          )}
                        </div>
                        <FaCheckCircle className="text-green-500 text-2xl" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
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

export default AdminFees;
