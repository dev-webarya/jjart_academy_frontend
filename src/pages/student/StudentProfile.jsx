import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaCamera, FaSave, FaTimes } from 'react-icons/fa';

const StudentProfile = () => {
  const { student } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: '+91 9876543210',
    address: '123 Art Street, Mumbai, India',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    dateOfBirth: '2010-05-15',
    parentName: 'Mr. Sharma',
    parentPhone: '+91 9876543211',
    emergencyContact: '+91 9876543212',
    enrolledSince: '2024-01-15',
    profileImage: null
  });

  const [originalData, setOriginalData] = useState(profileData);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = () => {
    const studentData = JSON.parse(localStorage.getItem('studentProfile') || '{}');
    if (studentData && Object.keys(studentData).length > 0) {
      setProfileData(prevData => ({ ...prevData, ...studentData }));
      setOriginalData(prevData => ({ ...prevData, ...studentData }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({
          ...prev,
          profileImage: event.target?.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!profileData.name || !profileData.email) {
      setErrorMessage('Name and Email are required');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    localStorage.setItem('studentProfile', JSON.stringify(profileData));
    setOriginalData(profileData);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setErrorMessage('');
  };

  const handleRemoveImage = () => {
    setProfileData(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Student Profile</h1>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Manage your profile information</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-2 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-300 rounded-lg flex items-center gap-2 text-sm">
          <span>✓</span>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg flex items-center gap-2 text-sm">
          <span>✕</span>
          {errorMessage}
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Profile Header with Image */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-4 text-white">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-3 border-white shadow-lg overflow-hidden bg-white/20 flex items-center justify-center">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser size={48} className="text-white/70" />
                )}
              </div>
              {isEditing && (
                <>
                  <label htmlFor="imageInput" className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full cursor-pointer hover:bg-gray-200 transition-colors shadow-lg">
                    <FaCamera size={14} className="text-gray-800" />
                  </label>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-white/90 text-sm">{profileData.email}</p>
              <p className="text-white/80 text-xs mt-1">Student - </p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => {
                if (isEditing) {
                  handleCancel();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                isEditing
                  ? 'bg-white text-gray-800 hover:bg-gray-100'
                  : 'bg-white/20 text-white hover:bg-white/30 border border-white'
              }`}
            >
              {isEditing ? (
                <>
                  <FaTimes size={14} />
                  Cancel
                </>
              ) : (
                <>
                  <FaEdit size={14} />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-4">
          {/* Contact Information */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <FaUser size={14} />
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-medium">
                  {profileData.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <FaEnvelope size={14} />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-medium">
                  {profileData.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <FaPhone size={14} />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-medium">
                  {profileData.phone || 'Not provided'}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <FaMapMarkerAlt size={14} />
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-medium">
                  {profileData.city || 'Not provided'}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                State
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={profileData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-medium">
                  {profileData.state || 'Not provided'}
                </p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Pincode
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="pincode"
                  value={profileData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-medium">
                  {profileData.pincode || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <FaMapMarkerAlt size={14} />
              Full Address
            </label>
            {isEditing ? (
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                placeholder="Enter your full address"
                rows="2"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-medium">
                {profileData.address || 'Not provided'}
              </p>
            )}
          </div>

          {/* Profile Image Actions */}
          {isEditing && profileData.profileImage && (
            <div className="mb-2 flex gap-2">
              <button
                onClick={handleRemoveImage}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
              >
                Remove Profile Photo
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 text-sm bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-1"
              >
                <FaSave size={14} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 text-sm bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-white dark:bg-gray-800 rounded shadow p-3 text-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">👨‍🎓</div>
          <h4 className="text-gray-800 dark:text-white font-semibold text-sm mt-1">Status</h4>
          <p className="text-gray-600 dark:text-gray-400 text-xs">Active Student</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded shadow p-3 text-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">🎨</div>
          <h4 className="text-gray-800 dark:text-white font-semibold text-sm mt-1">Enrollment</h4>
          <p className="text-gray-600 dark:text-gray-400 text-xs">{new Date(profileData.enrolledSince).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded shadow p-3 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
          <h4 className="text-gray-800 dark:text-white font-semibold text-sm mt-1">Organization</h4>
          <p className="text-gray-600 dark:text-gray-400 text-xs"></p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
