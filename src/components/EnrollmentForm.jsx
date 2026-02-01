import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaChild, FaMapMarkerAlt, FaExclamationCircle } from 'react-icons/fa';

const EnrollmentForm = ({ isOpen, onClose, onSuccess, selectedClassId }) => {
  const [formData, setFormData] = useState({
    classId: '',
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    address: '',
    parentGuardianName: '',
    studentAge: '',
    schedule: '',
    additionalMessage: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  // Pre-fill class ID when provided
  useEffect(() => {
    if (isOpen && selectedClassId) {
      setFormData(prev => ({
        ...prev,
        classId: selectedClassId.toString()
      }));
    }
  }, [isOpen, selectedClassId]);

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Store enrollment in localStorage (simulating backend call for now or prepping for it)
    // The user mentioned this matches the backend fields, so ideally we would POST this to the backend.
    // However, the existing code was just saving to localStorage. I will keep the localStorage logic 
    // but update the object structure.

    const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    const newEnrollment = {
      id: Date.now(),
      ...formData,
      studentAge: parseInt(formData.studentAge, 10), // Ensure int as per JSON requirement
      status: 'pending',
      enrollmentDate: new Date().toISOString()
    };
    enrollments.push(newEnrollment);
    localStorage.setItem('enrollments', JSON.stringify(enrollments));

    setSubmitted(true);

    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    }

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        classId: '',
        studentName: '',
        studentEmail: '',
        studentPhone: '',
        address: '',
        parentGuardianName: '',
        studentAge: '',
        schedule: '',
        additionalMessage: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
      });
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold">Enroll Your Child</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2"
            aria-label="Close"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 sm:py-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Enrollment Submitted!</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">
                Thank you for enrolling. We'll contact you soon with more details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <FaChild className="inline mr-2" />
                  Student Name *
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter student's full name"
                />
              </div>

              {/* Student Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <FaPhone className="inline mr-2" />
                  Student Phone *
                </label>
                <input
                  type="tel"
                  name="studentPhone"
                  value={formData.studentPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+91 1234567890"
                />
              </div>

              {/* Student Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <FaEnvelope className="inline mr-2" />
                  Student Email *
                </label>
                <input
                  type="email"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="student@example.com"
                />
              </div>

              {/* Parent Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <FaUser className="inline mr-2" />
                  Parent/Guardian Name *
                </label>
                <input
                  type="text"
                  name="parentGuardianName"
                  value={formData.parentGuardianName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter parent/guardian name"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <FaCalendar className="inline mr-2" />
                  Student Age *
                </label>
                <input
                  type="number"
                  name="studentAge"
                  value={formData.studentAge}
                  onChange={handleChange}
                  required
                  min="3"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter age"
                />
              </div>

              {/* Class Selection - Mapped to classId */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Class (ID) *
                </label>
                <input
                  type="text"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  required
                  disabled={!!selectedClassId}
                  className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${selectedClassId ? 'opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}
                  placeholder="Enter class name or ID"
                />
              </div>

              {/* Address - New Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              </div>

              {/* Schedule - Mapped to schedule */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Schedule *
                </label>
                <input
                  type="text"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter preferred schedule"
                />
              </div>

              {/* Emergency Contact Name - New Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <FaExclamationCircle className="inline mr-2" />
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Name of emergency contact"
                />
              </div>

              {/* Emergency Contact Phone - New Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <FaPhone className="inline mr-2" />
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Emergency contact phone"
                />
              </div>

              {/* Message - Mapped to additionalMessage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Additional Message (Optional)
                </label>
                <textarea
                  name="additionalMessage"
                  value={formData.additionalMessage}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any special requirements or questions?"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
              >
                Submit Enrollment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;
