import { useState } from 'react';
import { FaUpload, FaImage, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useNotification } from '../../context/NotificationContext';

const GalleryUpload = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    medium: '',
    size: { width: '', height: '' },
    isPublic: true,
    isForSale: false,
    price: '',
  });
  
  const { success } = useNotification();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would upload the artwork to the server
    success('Artwork uploaded successfully!');
    // Reset form
    setUploadedImages([]);
    setFormData({
      title: '',
      description: '',
      category: '',
      medium: '',
      size: { width: '', height: '' },
      isPublic: true,
      isForSale: false,
      price: '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Upload Artwork
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your creative work with the community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Upload Images *
          </label>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-all">
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <FaUpload className="text-purple-600" size={48} />
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  Click to upload images
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  PNG, JPG or WEBP (MAX. 5MB each)
                </p>
              </div>
            </label>
          </div>

          {/* Image Previews */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {uploadedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.preview}
                    alt={`Upload ₹{index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
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
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your artwork..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="Painting">Painting</option>
              <option value="Abstract">Abstract</option>
              <option value="Landscape">Landscape</option>
              <option value="Portrait">Portrait</option>
              <option value="Digital Art">Digital Art</option>
              <option value="Sculpture">Sculpture</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medium *
            </label>
            <select
              required
              value={formData.medium}
              onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select medium</option>
              <option value="Watercolor">Watercolor</option>
              <option value="Acrylic">Acrylic</option>
              <option value="Oil">Oil</option>
              <option value="Digital">Digital</option>
              <option value="Mixed Media">Mixed Media</option>
              <option value="Pencil">Pencil</option>
              <option value="Charcoal">Charcoal</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Width (inches)
              </label>
              <input
                type="number"
                value={formData.size.width}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  size: { ...formData.size, width: e.target.value }
                })}
                placeholder="16"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height (inches)
              </label>
              <input
                type="number"
                value={formData.size.height}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  size: { ...formData.size, height: e.target.value }
                })}
                placeholder="20"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Visibility & Sales Options */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isPublic" className="text-gray-800 dark:text-white font-medium cursor-pointer">
              Make this artwork public in gallery
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isForSale"
              checked={formData.isForSale}
              onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isForSale" className="text-gray-800 dark:text-white font-medium cursor-pointer">
              List this artwork for sale
            </label>
          </div>

          {formData.isForSale && (
            <div className="ml-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required={formData.isForSale}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2500"
                className="w-full max-w-xs px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-purple-500 focus:outline-none"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Note: 10% commission will be deducted on sales
              </p>
            </div>
          )}
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
            disabled={uploadedImages.length === 0}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-2"
          >
            <FaCheckCircle /> Upload Artwork
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryUpload;
