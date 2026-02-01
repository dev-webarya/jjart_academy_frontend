import { useState } from "react";

import { FaCreditCard, FaUniversity, FaMobileAlt, FaMoneyBillWave, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import StudentLogin from "../components/auth/StudentLogin";

const FeePaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    class: "",
    feeAmount: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    upiId: "",
    accountNumber: "",
    ifscCode: "",
  });
  const { isStudent } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { id: "card", label: "Card", icon: FaCreditCard },
    { id: "netbanking", label: "Net Banking", icon: FaUniversity },
    { id: "upi", label: "UPI", icon: FaMobileAlt },
    { id: "cash", label: "Cash", icon: FaMoneyBillWave },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Student Info Validation
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!formData.studentName.trim()) newErrors.studentName = "Student Name is required";
    if (!formData.class.trim()) newErrors.class = "Class is required";
    if (!formData.feeAmount.trim()) newErrors.feeAmount = "Fee Amount is required";

    // Payment Method Specific Validation
    if (paymentMethod === "card") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card Number is required";
      if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry Date is required";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
      if (!formData.nameOnCard.trim()) newErrors.nameOnCard = "Name on Card is required";
    } else if (paymentMethod === "upi") {
      if (!formData.upiId.trim()) newErrors.upiId = "UPI ID is required";
    } else if (paymentMethod === "netbanking") {
      if (!formData.accountNumber.trim()) newErrors.accountNumber = "Account Number is required";
      if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC Code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Generate payment receipt
      const receipt = {
        receiptNumber: `RCP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        transactionId: `TXN${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        studentId: formData.studentId,
        studentName: formData.studentName,
        class: formData.class,
        amount: parseFloat(formData.feeAmount),
        paymentMethod: paymentMethod.toUpperCase(),
        status: 'Success'
      };

      // Save payment to localStorage
      const existingPayments = JSON.parse(localStorage.getItem('publicFeePayments') || '[]');
      existingPayments.push(receipt);
      localStorage.setItem('publicFeePayments', JSON.stringify(existingPayments));

      setPaymentReceipt(receipt);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        studentId: "",
        studentName: "",
        class: "",
        feeAmount: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        nameOnCard: "",
        upiId: "",
        accountNumber: "",
        ifscCode: "",
      });
      setPaymentMethod("card");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/image copy.png"
            alt="Fee Payment Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/70 via-indigo-900/65 to-purple-900/60"></div>
        </div>

        {/* Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Fee Payment
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Pay your fees securely and conveniently
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          {!isStudent ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-purple-600 dark:text-purple-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Student Login Required</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please login with your student credentials to access the fee payment portal.
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Login as Student
              </button>
            </div>
          ) : (
            <>
              {/* Fee Payment Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                {/* ... existing info code ... */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Fee Payment Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Please enter the student details and select a payment method to proceed with the fee payment.
                </p>

                {/* Fee Structure Table */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Fee Structure</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                      No fee structures available.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Make a Payment
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Student Information Section */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                      Student Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Student ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${errors.studentId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="Enter Student ID"
                        />
                        {errors.studentId && (
                          <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Student Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${errors.studentName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="Enter Student Name"
                        />
                        {errors.studentName && (
                          <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Class <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="class"
                          value={formData.class}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${errors.class ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="Enter Class"
                        />
                        {errors.class && (
                          <p className="text-red-500 text-xs mt-1">{errors.class}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fee Amount (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="feeAmount"
                          value={formData.feeAmount}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${errors.feeAmount ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="Enter Fee Amount"
                        />
                        {errors.feeAmount && (
                          <p className="text-red-500 text-xs mt-1">{errors.feeAmount}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                      Payment Method
                    </h3>

                    {/* Payment Method Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${paymentMethod === method.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-blue-300 bg-white dark:bg-gray-700"
                            }`}
                        >
                          <method.icon
                            className={`text-xl mb-1 ${paymentMethod === method.id ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
                              }`}
                          />
                          <span
                            className={`text-xs font-medium ${paymentMethod === method.id
                              ? "text-blue-600"
                              : "text-gray-700 dark:text-gray-300"
                              }`}
                          >
                            {method.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Payment Method Fields */}
                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Card Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 text-sm rounded-md border ${errors.cardNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                              } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                          {errors.cardNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 text-sm rounded-md border ${errors.expiryDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                            {errors.expiryDate && (
                              <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              CVV <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 text-sm rounded-md border ${errors.cvv ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                              placeholder="123"
                              maxLength="3"
                            />
                            {errors.cvv && (
                              <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name on Card <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="nameOnCard"
                            value={formData.nameOnCard}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 text-sm rounded-md border ${errors.nameOnCard ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                              } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                            placeholder="Enter Name on Card"
                          />
                          {errors.nameOnCard && (
                            <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          UPI ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${errors.upiId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                          placeholder="example@upi"
                        />
                        {errors.upiId && (
                          <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>
                        )}
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Account Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 text-sm rounded-md border ${errors.accountNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                              } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                            placeholder="Enter Account Number"
                          />
                          {errors.accountNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            IFSC Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 text-sm rounded-md border ${errors.ifscCode ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                              } focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white`}
                            placeholder="Enter IFSC Code"
                          />
                          {errors.ifscCode && (
                            <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {paymentMethod === "cash" && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-3">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          Please visit the school office to make cash payment.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pay Now Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                  >
                    Pay Now
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <StudentLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Success Modal */}
      {showSuccessModal && paymentReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your fee payment has been processed successfully.
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Receipt No:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{paymentReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{paymentReceipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Student Name:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{paymentReceipt.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">₹{paymentReceipt.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{paymentReceipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(paymentReceipt.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const printContent = `
                      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                        <h1 style="text-align: center; color: #1e40af;">Art Academy</h1>
                        <h2 style="text-align: center; color: #6b7280;">Payment Receipt</h2>
                        <hr style="margin: 20px 0;">
                        <p><strong>Receipt No:</strong> ${paymentReceipt.receiptNumber}</p>
                        <p><strong>Transaction ID:</strong> ${paymentReceipt.transactionId}</p>
                        <p><strong>Date:</strong> ${new Date(paymentReceipt.date).toLocaleDateString('en-IN')}</p>
                        <p><strong>Student ID:</strong> ${paymentReceipt.studentId}</p>
                        <p><strong>Student Name:</strong> ${paymentReceipt.studentName}</p>
                        <p><strong>Class:</strong> ${paymentReceipt.class}</p>
                        <p><strong>Amount Paid:</strong> ₹${paymentReceipt.amount.toLocaleString()}</p>
                        <p><strong>Payment Method:</strong> ${paymentReceipt.paymentMethod}</p>
                        <p><strong>Status:</strong> ${paymentReceipt.status}</p>
                        <hr style="margin: 20px 0;">
                        <p style="text-align: center; color: #6b7280; font-size: 12px;">Thank you for your payment!</p>
                      </div>
                    `;
                    const printWindow = window.open('', '', 'height=600,width=800');
                    printWindow.document.write('<html><head><title>Payment Receipt</title></head><body>');
                    printWindow.document.write(printContent);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.print();
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setPaymentReceipt(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeePaymentPage;
