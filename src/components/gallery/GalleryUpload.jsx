import { useState } from 'react';
import { FaUpload, FaImage, FaTimes, FaCheckCircle, FaSpinner, FaLink } from 'react-icons/fa';
import { useNotification } from '../../context/NotificationContext';
import lmsService from '../../services/lmsService';

const GalleryUpload = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    tags: '',
  });

  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !imageUrl) {
      showNotification('Please provide a title and image URL', 'error');
      return;
    }

    setUploading(true);
    try {
      const galleryData = {
        title: formData.title,
        description: formData.description,
        imageUrl: imageUrl,
        medium: formData.medium,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      };

      const response = await lmsService.uploadGalleryItem(galleryData);

      if (response.success) {
        showNotification('Artwork submitted successfully! It will be visible after admin approval.', 'success');
        // Reset form
        setImageUrl('');
        setFormData({
          title: '',
          description: '',
          medium: '',
          tags: '',
        });
      } else {
        showNotification(response.message || 'Failed to upload artwork', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('Failed to upload artwork. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Upload Artwork
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your creative work with the community. Submitted artwork requires admin approval before appearing in the public gallery.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        {/* Image URL Input */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Artwork Image *
          </label>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaLink className="text-gray-400" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/your-artwork.jpg"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload your artwork to an image hosting service (like Imgur, Cloudinary, etc.) and paste the URL here
            </p>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mt-4 relative inline-block">
              <img
                src={imageUrl}
                alt="Artwork preview"
                className="max-w-md h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                }}
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        {/* Artwork Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Artwork Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Sunset Dreams"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your artwork..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medium
            </label>
            <select
              value={formData.medium}
              onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select medium</option>
              <option value="Watercolor">Watercolor</option>
              <option value="Acrylic">Acrylic</option>
              <option value="Oil Paint">Oil Paint</option>
              <option value="Digital Art">Digital Art</option>
              <option value="Mixed Media">Mixed Media</option>
              <option value="Pencil Drawing">Pencil Drawing</option>
              <option value="Charcoal">Charcoal</option>
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
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="landscape, nature, abstract (comma-separated)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-blue-700 dark:text-blue-400 text-sm">
            <strong>📌 Note:</strong> Your artwork will be reviewed by an admin before appearing in the public gallery. You'll be able to track its status in your gallery dashboard.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!imageUrl || uploading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-2"
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <FaCheckCircle /> Submit for Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryUpload;
