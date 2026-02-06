import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    FaImage, FaUpload, FaCheckCircle, FaClock, FaTimesCircle,
    FaSpinner, FaPlus, FaTimes, FaExternalLinkAlt
} from 'react-icons/fa';
import lmsService from '../../services/lmsService';
import { useNotification } from '../../context/NotificationContext';

const MyGallery = () => {
    const { student } = useOutletContext();
    const { showNotification } = useNotification();

    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        medium: '',
        tags: '',
    });

    // Fetch user's gallery uploads
    useEffect(() => {
        fetchMyGallery();
    }, []);

    const fetchMyGallery = async () => {
        setLoading(true);
        try {
            const response = await lmsService.getMyGalleryUploads(0, 100);
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

        if (!formData.title || !formData.imageUrl) {
            showNotification('Please provide a title and image URL', 'error');
            return;
        }

        setUploading(true);
        try {
            const galleryData = {
                title: formData.title,
                description: formData.description,
                imageUrl: formData.imageUrl,
                medium: formData.medium,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
            };

            const response = await lmsService.uploadGalleryItem(galleryData);

            if (response.success) {
                showNotification('Artwork submitted successfully! Pending admin approval.', 'success');
                setShowUploadModal(false);
                setFormData({ title: '', description: '', imageUrl: '', medium: '', tags: '' });
                fetchMyGallery(); // Refresh the list
            } else {
                showNotification(response.message || 'Failed to upload artwork', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Failed to upload artwork', 'error');
        } finally {
            setUploading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                        <FaCheckCircle /> Approved
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
                        <FaClock /> Pending
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                        <FaTimesCircle /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
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
                        Upload your artwork to showcase in the public gallery
                    </p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                >
                    <FaPlus /> Upload Artwork
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
                        Start showcasing your creative work by uploading your first artwork!
                    </p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all"
                    >
                        Upload Your First Artwork
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                        >
                            <div className="relative aspect-square">
                                <img
                                    src={item.imageUrl || '/placeholder-art.jpg'}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x400?text=Artwork';
                                    }}
                                />
                                <div className="absolute top-4 right-4">
                                    {getStatusBadge(item.status)}
                                </div>
                                {item.featured && (
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium">
                                        ⭐ Featured
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                        {item.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {item.medium && (
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                                            {item.medium}
                                        </span>
                                    )}
                                    {item.tags?.slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span>
                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently'}
                                    </span>
                                    {item.status === 'APPROVED' && (
                                        <a
                                            href="/gallery"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                                        >
                                            View in Gallery <FaExternalLinkAlt />
                                        </a>
                                    )}
                                </div>
                                {item.status === 'REJECTED' && item.notes && (
                                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <p className="text-red-600 dark:text-red-400 text-sm">
                                            <strong>Rejection reason:</strong> {item.notes}
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
                                Upload Artwork
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
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter artwork title"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Image URL *
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/your-artwork.jpg"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Upload your image to a hosting service and paste the URL here
                                </p>
                            </div>

                            {formData.imageUrl && (
                                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+URL';
                                        }}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your artwork..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Medium
                                </label>
                                <select
                                    name="medium"
                                    value={formData.medium}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Select medium</option>
                                    <option value="Watercolor">Watercolor</option>
                                    <option value="Oil Paint">Oil Paint</option>
                                    <option value="Acrylic">Acrylic</option>
                                    <option value="Digital Art">Digital Art</option>
                                    <option value="Pencil Drawing">Pencil Drawing</option>
                                    <option value="Charcoal">Charcoal</option>
                                    <option value="Mixed Media">Mixed Media</option>
                                    <option value="Sculpture">Sculpture</option>
                                    <option value="Photography">Photography</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="landscape, nature, abstract (comma-separated)"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                <p className="text-blue-700 dark:text-blue-400 text-sm">
                                    <strong>Note:</strong> Your artwork will be reviewed by an admin before appearing in the public gallery. You'll be notified once it's approved.
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
        </div>
    );
};

export default MyGallery;
