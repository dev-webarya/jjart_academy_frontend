import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    FaImage, FaUpload, FaCheckCircle, FaClock, FaTimesCircle,
    FaSpinner, FaPlus, FaTimes, FaExternalLinkAlt
} from 'react-icons/fa';
import galleryService from '../../services/galleryService';
import { useNotification } from '../../context/NotificationContext';
import ImageUpload from '../../components/ImageUpload';

const MyGallery = () => {
    const { student } = useOutletContext();
    const { showNotification } = useNotification();

    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        categoryId: '',
    });
    const [categories, setCategories] = useState([]);
    
    // Result popup state
    const [uploadResult, setUploadResult] = useState({ show: false, success: false, message: '' });
    
    // Ref to block duplicate submissions
    const isSubmittingRef = useRef(false);

    // Fetch user's gallery uploads and categories
    useEffect(() => {
        fetchMyGallery();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await galleryService.getAllGalleryCategories();
            if (response.success && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchMyGallery = async () => {
        setLoading(true);
        try {
            const response = await galleryService.getMyGalleryItems();
            if (response.success) {
                const data = response.data?.content || response.data || [];
                setGalleryItems(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
            showNotification('Failed to load gallery', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Block duplicate submissions
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        if (!formData.name || !formData.imageUrl) {
            showNotification('Please provide a name and image', 'error');
            isSubmittingRef.current = false;
            return;
        }

        if (!formData.categoryId) {
            showNotification('Please select a category', 'error');
            isSubmittingRef.current = false;
            return;
        }

        setUploading(true);
        try {
            const galleryData = {
                name: formData.name,
                description: formData.description || '',
                imageUrl: formData.imageUrl,
                categoryId: formData.categoryId,
            };

            const response = await galleryService.createGalleryItem(galleryData);

            // Close upload modal and reset form
            setShowUploadModal(false);
            setFormData({ name: '', description: '', imageUrl: '', categoryId: '' });
            setUploading(false);
            isSubmittingRef.current = false;

            if (response.success) {
                // Show success popup
                setUploadResult({
                    show: true,
                    success: true,
                    message: 'Your artwork has been submitted for review! You will be notified once it is approved.'
                });
                fetchMyGallery();
            } else {
                // Show failure popup
                setUploadResult({
                    show: true,
                    success: false,
                    message: response.message || 'Failed to upload item. Please try again.'
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setShowUploadModal(false);
            setFormData({ name: '', description: '', imageUrl: '', categoryId: '' });
            setUploading(false);
            isSubmittingRef.current = false;
            // Show failure popup
            setUploadResult({
                show: true,
                success: false,
                message: 'Failed to upload artwork. Please try again.'
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-medium shadow-sm">
                        <FaCheckCircle size={10} /> Approved
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-[10px] font-medium shadow-sm">
                        <FaClock size={10} /> Pending
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-[10px] font-medium shadow-sm">
                        <FaTimesCircle size={10} /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-[10px]">
                        {status}
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your gallery...</span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        My Gallery 🎨
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload your pictures to showcase in the public gallery
                    </p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                >
                    <FaPlus /> Upload Item
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <FaImage className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Uploads</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">{galleryItems.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <FaCheckCircle className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Approved</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">
                                {galleryItems.filter(i => i.status === 'APPROVED').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                            <FaClock className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">
                                {galleryItems.filter(i => i.status === 'PENDING').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            {galleryItems.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
                    <FaImage className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No artwork uploaded yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Start showcasing your creative work by uploading your first item!
                    </p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all"
                    >
                        Upload Your First Item
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Image Container - Smaller aspect ratio */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={item.imageUrl || '/placeholder-art.jpg'}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300?text=Gallery+Item';
                                    }}
                                />
                                {/* Status Badge - Smaller and top-right */}
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(item.status)}
                                </div>
                                {/* Featured Badge */}
                                {item.featured && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-medium shadow-lg">
                                        ⭐ Featured
                                    </div>
                                )}
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content - More compact */}
                            <div className="p-3">
                                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">
                                    {item.name}
                                </h3>

                                {item.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-1">
                                        {item.description}
                                    </p>
                                )}

                                {/* Category Tag - More compact */}
                                {item.categoryName && (
                                    <div className="mb-2">
                                        <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-400 rounded-md text-xs font-medium">
                                            {item.categoryName}
                                        </span>
                                    </div>
                                )}

                                {/* Footer - Compact */}
                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-[10px]">
                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                                    </span>
                                    {item.status === 'APPROVED' && (
                                        <a
                                            href="/gallery"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-[10px] font-medium"
                                        >
                                            View <FaExternalLinkAlt size={8} />
                                        </a>
                                    )}
                                </div>

                                {/* Rejection Note - Keep original styling */}
                                {item.status === 'REJECTED' && item.notes && (
                                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                        <p className="text-red-600 dark:text-red-400 text-[10px] leading-tight">
                                            <strong className="font-semibold">Reason:</strong> {item.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Upload Gallery Item
                            </h2>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <FaTimes className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter item name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <ImageUpload
                                value={formData.imageUrl}
                                onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                label="Image *"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your item..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                <p className="text-blue-700 dark:text-blue-400 text-sm">
                                    <strong>Note:</strong> Your item will be reviewed by an admin before appearing in the public gallery. You'll be notified once it's approved.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <>
                                            <FaSpinner className="animate-spin" /> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FaUpload /> Submit for Review
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Result Popup */}
            {uploadResult.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
                        {/* Icon */}
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${uploadResult.success ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                            {uploadResult.success ? (
                                <FaCheckCircle className="text-5xl text-green-500" />
                            ) : (
                                <FaTimesCircle className="text-5xl text-red-500" />
                            )}
                        </div>
                        
                        {/* Title */}
                        <h3 className={`text-2xl font-bold mb-3 ${uploadResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {uploadResult.success ? 'Success! 🎉' : 'Upload Failed'}
                        </h3>
                        
                        {/* Message */}
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {uploadResult.message}
                        </p>
                        
                        {/* Close Button */}
                        <button
                            onClick={() => setUploadResult({ show: false, success: false, message: '' })}
                            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${uploadResult.success ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {uploadResult.success ? 'Great!' : 'Try Again'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyGallery;
