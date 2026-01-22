import { useState, useEffect } from 'react';
import { 
  FaMoneyBillWave, FaCalendar, FaCheckCircle, FaCreditCard, 
  FaHistory, FaFileInvoice, FaDownload, FaRupeeSign, FaInfoCircle,
  FaWallet, FaUniversity, FaMobileAlt, FaUser, FaBook, FaEye
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const StudentFeePayment = () => {
  const { user } = useAuth();
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState(null);
  const [showFeePaymentForm, setShowFeePaymentForm] = useState(false);
  const [feeFormData, setFeeFormData] = useState({
    studentId: '',
    studentName: '',
    class: '',
    feeAmount: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    upiId: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'upi',
    transactionId: '',
    upiId: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    accountNumber: '',
    ifscCode: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    loadFeeData();
  }, []);

  const loadFeeData = () => {
    setLoading(true);
    try {
      // Load student's fee data from localStorage
      let studentsData = localStorage.getItem('students');
      let feesData = localStorage.getItem('studentFees');
      
      // Initialize with dummy data if no students exist
      if (!studentsData) {
        const dummyStudents = [
          {
            id: 1,
            name: 'Student Demo',
            email: 'student@demo.com',
            phone: '9876543210',
            enrolledClass: 'Drawing Class for Kids',
            rollNumber: 'STD-001',
            dateOfBirth: '2010-05-15',
            gender: 'Female',
            address: '123 Art Street, Mumbai',
            parentName: 'Parent Demo',
            parentPhone: '9876543210',
            parentEmail: 'parent@demo.com',
            status: 'active',
            joinDate: '2026-01-01'
          }
        ];
        localStorage.setItem('students', JSON.stringify(dummyStudents));
        studentsData = JSON.stringify(dummyStudents);

        // Initialize fee data for demo student
        const dummyFees = {
          1: {
            feeStructure: {
              totalFee: 15000,
              paidAmount: 5000,
              dueDate: '2026-06-30'
            },
            payments: [
              {
                id: 1,
                amount: 5000,
                date: '2026-01-15',
                method: 'UPI',
                transactionId: 'TXN123456789',
                status: 'Success',
                receiptNumber: 'RCP-2026-001'
              }
            ]
          }
        };
        localStorage.setItem('studentFees', JSON.stringify(dummyFees));
        feesData = JSON.stringify(dummyFees);
      }
      
      const students = JSON.parse(studentsData);
      const fees = feesData ? JSON.parse(feesData) : {};
      
      // Find current student (using user.email from AuthContext or default to first student)
      const currentStudent = students.find(s => 
        s.email === user?.email || s.id === (user?.id || 1)
      ) || students[0];
      
      if (currentStudent) {
        // Get fee data for this student or create default
        const studentFeeData = fees[currentStudent.id] || {
          feeStructure: {
            totalFee: 15000,
            paidAmount: 0,
            dueDate: '2026-06-30'
          },
          payments: []
        };

        const studentFee = {
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          enrolledClass: currentStudent.enrolledClass || 'Art Foundation',
          rollNumber: currentStudent.rollNumber || 'STD-001',
          email: currentStudent.email || user?.email,
          phone: currentStudent.phone || '',
          totalFee: studentFeeData.feeStructure.totalFee,
          paidAmount: studentFeeData.feeStructure.paidAmount,
          dueDate: studentFeeData.feeStructure.dueDate,
          feeStructure: {
            tuitionFee: 10000,
            materialFee: 3000,
            registrationFee: 2000,
          },
          payments: studentFeeData.payments || []
        };
        setFeeData(studentFee);
      }
    } catch (error) {
      console.error('Error loading fee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
    if (feeData) {
      const remaining = feeData.totalFee - feeData.paidAmount;
      setPaymentData({
        ...paymentData,
        amount: remaining.toString()
      });
    }
    setErrors({});
    setShowPaymentModal(true);
  };

  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    // Payment method specific validation
    if (paymentData.paymentMethod === 'upi' && !paymentData.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    }

    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!paymentData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
      if (!paymentData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentData.cvv.trim()) newErrors.cvv = 'CVV is required';
    }

    if (paymentData.paymentMethod === 'netbanking') {
      if (!paymentData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
      if (!paymentData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Simulate payment processing
    const newPayment = {
      id: Date.now(),
      amount: parseFloat(paymentData.amount),
      date: new Date().toISOString().split('T')[0],
      method: paymentData.paymentMethod.toUpperCase(),
      transactionId: paymentData.transactionId || `TXN${Date.now()}`,
      status: 'Success',
      receiptNumber: `RCP-${new Date().getFullYear()}-${String(feeData.payments.length + 1).padStart(3, '0')}`,
      upiId: paymentData.upiId,
      notes: paymentData.notes
    };

    // Update fee data
    const updatedFeeData = {
      ...feeData,
      paidAmount: feeData.paidAmount + parseFloat(paymentData.amount),
      payments: [...feeData.payments, newPayment]
    };

    // Save to localStorage (same structure as admin panel)
    const feesData = localStorage.getItem('studentFees');
    const fees = feesData ? JSON.parse(feesData) : {};
    fees[feeData.studentId] = {
      feeStructure: {
        totalFee: updatedFeeData.totalFee,
        paidAmount: updatedFeeData.paidAmount,
        dueDate: updatedFeeData.dueDate
      },
      payments: updatedFeeData.payments
    };
    localStorage.setItem('studentFees', JSON.stringify(fees));

    setFeeData(updatedFeeData);
    setShowPaymentModal(false);
    
    // Reset form
    setPaymentData({
      amount: '',
      paymentMethod: 'upi',
      transactionId: '',
      upiId: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      accountNumber: '',
      ifscCode: '',
      notes: ''
    });
    setErrors({});

    // Show success message
    alert('Payment successful! Your payment has been recorded.');
  };

  const validateFeeForm = () => {
    const newErrors = {};
    
    if (!feeFormData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!feeFormData.studentName.trim()) newErrors.studentName = 'Student Name is required';
    if (!feeFormData.class.trim()) newErrors.class = 'Class is required';
    if (!feeFormData.feeAmount || parseFloat(feeFormData.feeAmount) <= 0) {
      newErrors.feeAmount = 'Please enter a valid amount';
    }

    // Payment method validation
    if (feeFormData.paymentMethod === 'card') {
      if (!feeFormData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!feeFormData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!feeFormData.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!feeFormData.nameOnCard.trim()) newErrors.nameOnCard = 'Name on card is required';
    } else if (feeFormData.paymentMethod === 'upi') {
      if (!feeFormData.upiId.trim()) newErrors.upiId = 'UPI ID is required';
    } else if (feeFormData.paymentMethod === 'netbanking') {
      if (!feeFormData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
      if (!feeFormData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRazorpayPayment = () => {
    if (!validateFeeForm()) return;

    setIsProcessingPayment(true);

    const options = {
      key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
      amount: parseFloat(feeFormData.feeAmount) * 100, // Amount in paise
      currency: 'INR',
      name: 'Art Academy',
      description: `Fee Payment - ${feeFormData.class}`,
      image: '/aa.jpeg',
      prefill: {
        name: feeFormData.studentName,
        email: feeData?.email || '',
        contact: feeData?.phone || ''
      },
      theme: {
        color: '#8B5CF6'
      },
      handler: function(response) {
        // Payment successful
        const newPayment = {
          id: Date.now(),
          amount: parseFloat(feeFormData.feeAmount),
          date: new Date().toISOString().split('T')[0],
          method: feeFormData.paymentMethod.toUpperCase(),
          transactionId: response.razorpay_payment_id,
          status: 'Success',
          receiptNumber: `RCP-${new Date().getFullYear()}-${String(feeData.payments.length + 1).padStart(3, '0')}`,
          razorpayOrderId: response.razorpay_order_id || '',
          razorpaySignature: response.razorpay_signature || ''
        };

        const updatedFeeData = {
          ...feeData,
          paidAmount: feeData.paidAmount + parseFloat(feeFormData.feeAmount),
          payments: [...feeData.payments, newPayment]
        };

        const feesData = localStorage.getItem('studentFees');
        const fees = feesData ? JSON.parse(feesData) : {};
        fees[feeData.studentId] = {
          feeStructure: {
            totalFee: updatedFeeData.totalFee,
            paidAmount: updatedFeeData.paidAmount,
            dueDate: updatedFeeData.dueDate
          },
          payments: updatedFeeData.payments
        };
        localStorage.setItem('studentFees', JSON.stringify(fees));

        setFeeData(updatedFeeData);
        setShowFeePaymentForm(false);
        setIsProcessingPayment(false);
        alert('Payment successful! Transaction ID: ' + response.razorpay_payment_id);
      },
      modal: {
        ondismiss: function() {
          setIsProcessingPayment(false);
          alert('Payment cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleViewReceipt = (payment) => {
    setSelectedReceipt(payment);
    setShowReceiptModal(true);
  };

  const handleDownloadReceipt = (payment) => {
    // In a real application, this would generate and download a PDF
    alert(`Downloading receipt ${payment.receiptNumber}...`);
  };

  const getPaymentStatus = () => {
    if (!feeData) return 'pending';
    if (feeData.paidAmount >= feeData.totalFee) return 'paid';
    if (feeData.paidAmount > 0) return 'partial';
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

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Fully Paid';
      case 'partial': return 'Partially Paid';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading fee details...</p>
        </div>
      </div>
    );
  }

  if (!feeData) {
    return (
      <div className="text-center p-8">
        <FaMoneyBillWave className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          No Fee Data Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Unable to load your fee information. Please contact the admin.
        </p>
      </div>
    );
  }

  const status = getPaymentStatus();
  const remainingAmount = feeData.totalFee - feeData.paidAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaMoneyBillWave className="text-4xl" />
            <div>
              <h1 className="text-3xl font-bold">Fee Payment</h1>
              <p className="text-blue-100 mt-1">Manage your course fees</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setFeeFormData({
                  studentId: feeData.rollNumber || '',
                  studentName: feeData.studentName || '',
                  class: feeData.enrolledClass || '',
                  feeAmount: remainingAmount.toString() || '',
                  paymentMethod: 'card'
                });
                setShowFeePaymentForm(true);
              }}
              className="px-6 py-2.5 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg flex items-center space-x-2"
            >
              <FaMoneyBillWave />
              <span>Pay Now</span>
            </button>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FaHistory className="text-2xl text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment History</h2>
          </div>
        </div>
        
        {feeData.payments.length === 0 ? (
          <div className="p-8 text-center">
            <FaFileInvoice className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No Payments Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your payment history will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Receipt No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {feeData.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {payment.receiptNumber || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {new Date(payment.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-green-600">₹{payment.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-semibold">
                        {payment.method || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                      {payment.transactionId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                        {payment.status || 'Success'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPaymentDetail(payment);
                            setShowPaymentDetails(true);
                          }}
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleViewReceipt(payment)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                          title="View Receipt"
                        >
                          <FaFileInvoice />
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(payment)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                          title="Download Receipt"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0   flex items-center justify-center z-50 p-4">
          <div className="bg-white  rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Make Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Payment Amount *
                  </label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                      max={remainingAmount}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Maximum: ₹{remainingAmount.toLocaleString()}
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentData({ ...paymentData, paymentMethod: 'upi' })}
                      className={`flex flex-col items-center p-3 border-2 rounded-lg transition-all ${
                        paymentData.paymentMethod === 'upi'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                      }`}
                    >
                      <FaMobileAlt className={`text-xl mb-1 ${paymentData.paymentMethod === 'upi' ? 'text-purple-600' : 'text-gray-600'}`} />
                      <span className={`text-xs font-medium ${paymentData.paymentMethod === 'upi' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                        UPI
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentData({ ...paymentData, paymentMethod: 'card' })}
                      className={`flex flex-col items-center p-3 border-2 rounded-lg transition-all ${
                        paymentData.paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                      }`}
                    >
                      <FaCreditCard className={`text-xl mb-1 ${paymentData.paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-600'}`} />
                      <span className={`text-xs font-medium ${paymentData.paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                        Card
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentData({ ...paymentData, paymentMethod: 'netbanking' })}
                      className={`flex flex-col items-center p-3 border-2 rounded-lg transition-all ${
                        paymentData.paymentMethod === 'netbanking'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                      }`}
                    >
                      <FaUniversity className={`text-xl mb-1 ${paymentData.paymentMethod === 'netbanking' ? 'text-green-600' : 'text-gray-600'}`} />
                      <span className={`text-xs font-medium ${paymentData.paymentMethod === 'netbanking' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                        Net Banking
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentData({ ...paymentData, paymentMethod: 'cash' })}
                      className={`flex flex-col items-center p-3 border-2 rounded-lg transition-all ${
                        paymentData.paymentMethod === 'cash'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                      }`}
                    >
                      <FaMoneyBillWave className={`text-xl mb-1 ${paymentData.paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-600'}`} />
                      <span className={`text-xs font-medium ${paymentData.paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                        Cash
                      </span>
                    </button>
                  </div>
                </div>

                {/* UPI Details */}
                {paymentData.paymentMethod === 'upi' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      UPI ID *
                    </label>
                    <input
                      type="text"
                      value={paymentData.upiId}
                      onChange={(e) => {
                        setPaymentData({ ...paymentData, upiId: e.target.value });
                        if (errors.upiId) setErrors({ ...errors, upiId: '' });
                      }}
                      className={`w-full px-4 py-3 border ${errors.upiId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                      placeholder="yourname@upi"
                    />
                    {errors.upiId && <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>}
                  </div>
                )}

                {/* Card Details */}
                {paymentData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => {
                          setPaymentData({ ...paymentData, cardNumber: e.target.value });
                          if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
                        }}
                        className={`w-full px-4 py-3 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => {
                            setPaymentData({ ...paymentData, expiryDate: e.target.value });
                            if (errors.expiryDate) setErrors({ ...errors, expiryDate: '' });
                          }}
                          className={`w-full px-4 py-3 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => {
                            setPaymentData({ ...paymentData, cvv: e.target.value });
                            if (errors.cvv) setErrors({ ...errors, cvv: '' });
                          }}
                          className={`w-full px-4 py-3 border ${errors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                          placeholder="123"
                          maxLength="3"
                        />
                        {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardName}
                        onChange={(e) => {
                          setPaymentData({ ...paymentData, cardName: e.target.value });
                          if (errors.cardName) setErrors({ ...errors, cardName: '' });
                        }}
                        className={`w-full px-4 py-3 border ${errors.cardName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                        placeholder="Name on card"
                      />
                      {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                    </div>
                  </div>
                )}

                {/* Net Banking Details */}
                {paymentData.paymentMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={paymentData.accountNumber}
                        onChange={(e) => {
                          setPaymentData({ ...paymentData, accountNumber: e.target.value });
                          if (errors.accountNumber) setErrors({ ...errors, accountNumber: '' });
                        }}
                        className={`w-full px-4 py-3 border ${errors.accountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter account number"
                      />
                      {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        value={paymentData.ifscCode}
                        onChange={(e) => {
                          setPaymentData({ ...paymentData, ifscCode: e.target.value });
                          if (errors.ifscCode) setErrors({ ...errors, ifscCode: '' });
                        }}
                        className={`w-full px-4 py-3 border ${errors.ifscCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter IFSC code"
                      />
                      {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
                    </div>
                  </div>
                )}

                {/* Cash Payment Notice */}
                {paymentData.paymentMethod === 'cash' && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      Please visit the academy office to make cash payment during office hours.
                    </p>
                  </div>
                )}

                {/* Transaction ID (Optional) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter transaction ID"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any notes..."
                  ></textarea>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaInfoCircle className="text-blue-600 text-xl mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-semibold mb-1">Payment Information</p>
                      <p>Your payment will be processed securely. You will receive a receipt upon successful payment.</p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Confirm Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Receipt</h2>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
                <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Art Academy</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fee Payment Receipt</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receipt No.</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedReceipt.receiptNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedReceipt.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Student Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{feeData.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Roll Number</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{feeData.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedReceipt.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedReceipt.transactionId}</p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-300 mb-1">Amount Paid</p>
                  <p className="text-3xl font-bold text-green-600">₹{selectedReceipt.amount.toLocaleString()}</p>
                </div>

                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Thank you for your payment!
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleDownloadReceipt(selectedReceipt)}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                >
                  <FaDownload />
                  <span>Download Receipt</span>
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedPaymentDetail && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <button
                  onClick={() => setShowPaymentDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Payment Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Receipt Number</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedPaymentDetail.receiptNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Transaction ID</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedPaymentDetail.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Payment Date</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(selectedPaymentDetail.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Payment Method</p>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
                        {selectedPaymentDetail.method}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Amount Paid</p>
                    <p className="text-3xl font-bold text-green-600">₹{selectedPaymentDetail.amount.toLocaleString()}</p>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold">
                      {selectedPaymentDetail.status}
                    </span>
                  </div>
                </div>

                {/* Student Information */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 flex items-center">
                    <FaUser className="mr-2 text-blue-600 text-xs" />
                    Student Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Name</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{feeData.studentName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Roll Number</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{feeData.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Class</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{feeData.enrolledClass}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{feeData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Notes */}
                {selectedPaymentDetail.notes && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Notes</h4>
                    <p className="text-xs text-gray-700 dark:text-gray-300">{selectedPaymentDetail.notes}</p>
                  </div>
                )}

                {/* Fee Summary */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Fee Summary</h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Fee</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{feeData.totalFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Paid</span>
                      <span className="font-semibold text-green-600">₹{feeData.paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-900 dark:text-white">Remaining Balance</span>
                      <span className="font-bold text-red-600">₹{(feeData.totalFee - feeData.paidAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  {(feeData.totalFee - feeData.paidAmount) > 0 && (
                    <button
                      onClick={() => {
                        setShowPaymentDetails(false);
                        handlePayNow();
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center space-x-2"
                    >
                      <FaMoneyBillWave className="text-xs" />
                      <span>Pay Now</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadReceipt(selectedPaymentDetail)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <FaDownload className="text-xs" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentDetails(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Fee Payment Form Modal */}
      {showFeePaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Payment</h2>
                <button
                  onClick={() => setShowFeePaymentForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Fee Payment Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fee Payment Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please enter the student details and select a payment method to proceed with the fee payment.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleRazorpayPayment();
                }} className="space-y-6">
                  {/* Student Information */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Student Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Student ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={feeFormData.studentId}
                          onChange={(e) => {
                            setFeeFormData({...feeFormData, studentId: e.target.value});
                            if (formErrors.studentId) setFormErrors({...formErrors, studentId: ''});
                          }}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${
                            formErrors.studentId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="Enter Student ID"
                          required
                        />
                        {formErrors.studentId && <p className="text-red-500 text-xs mt-1">{formErrors.studentId}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Student Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={feeFormData.studentName}
                          onChange={(e) => {
                            setFeeFormData({...feeFormData, studentName: e.target.value});
                            if (formErrors.studentName) setFormErrors({...formErrors, studentName: ''});
                          }}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${
                            formErrors.studentName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="Enter Student Name"
                          required
                        />
                        {formErrors.studentName && <p className="text-red-500 text-xs mt-1">{formErrors.studentName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Class <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={feeFormData.class}
                          onChange={(e) => {
                            setFeeFormData({...feeFormData, class: e.target.value});
                            if (formErrors.class) setFormErrors({...formErrors, class: ''});
                          }}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${
                            formErrors.class ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="Enter Class"
                          required
                        />
                        {formErrors.class && <p className="text-red-500 text-xs mt-1">{formErrors.class}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fee Amount (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={feeFormData.feeAmount}
                          onChange={(e) => {
                            setFeeFormData({...feeFormData, feeAmount: e.target.value});
                            if (formErrors.feeAmount) setFormErrors({...formErrors, feeAmount: ''});
                          }}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${
                            formErrors.feeAmount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="Enter Fee Amount"
                          required
                        />
                        {formErrors.feeAmount && <p className="text-red-500 text-xs mt-1">{formErrors.feeAmount}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {[
                        { id: 'card', label: 'Card', icon: FaCreditCard },
                        { id: 'netbanking', label: 'Net Banking', icon: FaUniversity },
                        { id: 'upi', label: 'UPI', icon: FaMobileAlt },
                        { id: 'cash', label: 'Cash', icon: FaMoneyBillWave }
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setFeeFormData({...feeFormData, paymentMethod: method.id})}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                            feeFormData.paymentMethod === method.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 bg-white dark:bg-gray-700'
                          }`}
                        >
                          <method.icon className={`text-xl mb-1 ${
                            feeFormData.paymentMethod === method.id ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                          }`} />
                          <span className={`text-xs font-medium ${
                            feeFormData.paymentMethod === method.id
                              ? 'text-blue-600'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {method.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Payment Method Fields */}
                    {feeFormData.paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Card Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={feeFormData.cardNumber}
                            onChange={(e) => {
                              setFeeFormData({...feeFormData, cardNumber: e.target.value});
                              if (formErrors.cardNumber) setFormErrors({...formErrors, cardNumber: ''});
                            }}
                            className={`w-full px-3 py-2 text-sm rounded-md border ${
                              formErrors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                          {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={feeFormData.expiryDate}
                              onChange={(e) => {
                                setFeeFormData({...feeFormData, expiryDate: e.target.value});
                                if (formErrors.expiryDate) setFormErrors({...formErrors, expiryDate: ''});
                              }}
                              className={`w-full px-3 py-2 text-sm rounded-md border ${
                                formErrors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              } focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                            {formErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              CVV <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={feeFormData.cvv}
                              onChange={(e) => {
                                setFeeFormData({...feeFormData, cvv: e.target.value});
                                if (formErrors.cvv) setFormErrors({...formErrors, cvv: ''});
                              }}
                              className={`w-full px-3 py-2 text-sm rounded-md border ${
                                formErrors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              } focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                              placeholder="123"
                              maxLength="3"
                            />
                            {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name on Card <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={feeFormData.nameOnCard}
                            onChange={(e) => {
                              setFeeFormData({...feeFormData, nameOnCard: e.target.value});
                              if (formErrors.nameOnCard) setFormErrors({...formErrors, nameOnCard: ''});
                            }}
                            className={`w-full px-3 py-2 text-sm rounded-md border ${
                              formErrors.nameOnCard ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                            placeholder="Enter Name on Card"
                          />
                          {formErrors.nameOnCard && <p className="text-red-500 text-xs mt-1">{formErrors.nameOnCard}</p>}
                        </div>
                      </div>
                    )}

                    {feeFormData.paymentMethod === 'upi' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          UPI ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={feeFormData.upiId}
                          onChange={(e) => {
                            setFeeFormData({...feeFormData, upiId: e.target.value});
                            if (formErrors.upiId) setFormErrors({...formErrors, upiId: ''});
                          }}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${
                            formErrors.upiId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="example@upi"
                        />
                        {formErrors.upiId && <p className="text-red-500 text-xs mt-1">{formErrors.upiId}</p>}
                      </div>
                    )}

                    {feeFormData.paymentMethod === 'netbanking' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Account Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={feeFormData.accountNumber}
                            onChange={(e) => {
                              setFeeFormData({...feeFormData, accountNumber: e.target.value});
                              if (formErrors.accountNumber) setFormErrors({...formErrors, accountNumber: ''});
                            }}
                            className={`w-full px-3 py-2 text-sm rounded-md border ${
                              formErrors.accountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                            placeholder="Enter Account Number"
                          />
                          {formErrors.accountNumber && <p className="text-red-500 text-xs mt-1">{formErrors.accountNumber}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            IFSC Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={feeFormData.ifscCode}
                            onChange={(e) => {
                              setFeeFormData({...feeFormData, ifscCode: e.target.value});
                              if (formErrors.ifscCode) setFormErrors({...formErrors, ifscCode: ''});
                            }}
                            className={`w-full px-3 py-2 text-sm rounded-md border ${
                              formErrors.ifscCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                            placeholder="Enter IFSC Code"
                          />
                          {formErrors.ifscCode && <p className="text-red-500 text-xs mt-1">{formErrors.ifscCode}</p>}
                        </div>
                      </div>
                    )}

                    {feeFormData.paymentMethod === 'cash' && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-3">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          Please visit the academy office to make cash payment during office hours.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-bold rounded-lg shadow-lg transition-all transform ${
                      isProcessingPayment 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02]'
                    }`}
                  >
                    {isProcessingPayment ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFeePayment;
