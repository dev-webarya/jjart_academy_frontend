import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCamera, FaEdit, FaSave, FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const EnhancedStudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    address: user?.address || '',
    bio: user?.bio || '',
    interests: user?.interests || '',
  });

  const stats = {
    totalArtworks: 24,
    artworksSold: 3,
    totalEarnings: 8500,
    galleryViews: 1234,
    achievements: 7,
    attendance: 91.7,
  };

  useEffect(() => {
    loadStudentData();
  }, [user]);

  const loadStudentData = () => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        address: user.address || '',
        bio: user.bio || '',
        interests: user.interests || '',
      });
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!profile.name || !profile.email) {
      setErrorMessage('Name and email are required');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const updatedData = {
      ...profile,
      profileImage: profileImage
    };

    updateUser(updatedData);
    setSuccessMessage('Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    loadStudentData();
    setIsEditing(false);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  return (
    <div className="space-y-3">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Profile
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your personal information
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-semibold"
          >
            <FaEdit size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 text-sm font-semibold"
            >
              <FaSave size={14} /> Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 text-sm font-semibold"
            >
              <FaTimes size={14} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Header with Avatar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <FaUser size={40} />
                )}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 flex gap-1">
                  <label className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg cursor-pointer">
                    <FaCamera size={12} />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {profileImage && (
                    <button 
                      onClick={handleRemoveImage}
                      className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-lg"
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 mt-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {profile.email}
              </p>
             
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <InfoField
            label="Full Name"
            name="name"
            value={profile.name}
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={FaUser}
          />
          <InfoField
            label="Email"
            name="email"
            value={profile.email}
            isEditing={isEditing}
            onChange={handleInputChange}
            type="email"
            icon={FaEnvelope}
          />
          <InfoField
            label="Phone Number"
            name="phone"
            value={profile.phone}
            isEditing={isEditing}
            onChange={handleInputChange}
            type="tel"
            icon={FaPhone}
          />
          <InfoField
            label="City"
            name="city"
            value={profile.city}
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={FaMapMarkerAlt}
          />
          <InfoField
            label="State"
            name="state"
            value={profile.state}
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={FaMapMarkerAlt}
          />
          <InfoField
            label="Pincode"
            name="pincode"
            value={profile.pincode}
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={FaMapMarkerAlt}
          />
          <InfoField
            label="Address"
            name="address"
            value={profile.address}
            isEditing={isEditing}
            onChange={handleInputChange}
            fullWidth
            icon={FaMapMarkerAlt}
          />
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, name, value, isEditing, onChange, type = 'text', fullWidth = false, icon: Icon, isTextarea = false }) => {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {Icon && <Icon size={14} />}
        {label}
      </label>
      {isEditing ? (
        isTextarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none"
          />
        )
      ) : (
        <p className="text-sm font-semibold text-gray-800 dark:text-white p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          {value || 'Not specified'}
        </p>
      )}
    </div>
  );
};

export default EnhancedStudentProfile;
