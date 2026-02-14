import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import galleryService from "../services/galleryService";
import ImagePreviewModal from "./ui/ImagePreviewModal";
import Pagination from "./common/Pagination";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [galleries, setGalleries] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Fetch galleries and categories on component mount
  useEffect(() => {
    const fetchGalleryData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both galleries and categories in parallel
        const [galleriesResult, categoriesResult] = await Promise.all([
          galleryService.getAllGalleries(),
          galleryService.getAllGalleryCategories()
        ]);

        // Process Galleries
        if (galleriesResult.success) {
          let galleryData = galleriesResult.data;

          // Handle nested data structures
          if (galleryData && typeof galleryData === 'object') {
            if (galleryData.data) galleryData = galleryData.data;
            else if (galleryData.content) galleryData = galleryData.content;
          }

          if (!Array.isArray(galleryData)) {
            galleryData = galleryData ? [galleryData] : [];
          }

          if (galleryData.length > 0) {
            const transformedGalleries = galleryData.map(g =>
              galleryService.transformGalleryData(g)
            );
            setGalleries(transformedGalleries);
          } else {
            // If backend is empty, we could show mock data or just leave it empty
            // For now, let's keep it empty but remove the error so the UI shows the empty state nicely
            console.log('ℹ️ No galleries returned from backend');
            setGalleries([]);
          }
        }

        // Process Categories
        if (categoriesResult.success) {
          let categoryData = categoriesResult.data;
          if (categoryData && typeof categoryData === 'object' && categoryData.data) {
            categoryData = categoryData.data;
          }
          if (!Array.isArray(categoryData)) {
            categoryData = categoryData ? [categoryData] : [];
          }

          if (categoryData.length > 0) {
            const transformedCategories = categoryData.map(c =>
              galleryService.transformCategoryData(c)
            );
            const categoryNames = ["All", ...transformedCategories.map(cat => cat.name).filter(Boolean)];
            setCategories(categoryNames);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load gallery data');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Filter images based on selected category
  const filteredImages =
    selectedCategory === "All"
      ? galleries
      : galleries.filter((img) => {
        const itemCategoryName =
          img.categoryName ||
          (typeof img.category === 'string' ? img.category : img.category?.name);
        return itemCategoryName === selectedCategory;
      });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = filteredImages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Loading state
  if (loading) {
    return (
      <section id="gallery" className="bg-white dark:bg-gray-900 py-8 md:py-8">
        <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
          <div className="text-center space-y-6">
            <FaSpinner className="text-4xl animate-spin text-purple-600 mx-auto" />
            <p className="text-xl text-gray-600 dark:text-gray-300">Loading masterpices...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="bg-white dark:bg-gray-900 py-8 md:py-8">
      <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
        <div className="space-y-12 md:space-y-16">

          {/* Section Header */}
          <div className="text-center space-y-4">
            <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-6 py-2 rounded-full text-sm font-semibold">
              Gallery
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Student{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600">
                Masterpieces
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore the incredible artwork created by our talented students
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 text-sm md:text-base ${selectedCategory === category ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700"}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid - Admin Style Cards */}
          {filteredImages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentImages.map((image) => (
                  <div
                    key={image.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group h-full flex flex-col"
                    onClick={() => setSelectedImage(image)}
                  >
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-700">
                      <img
                        src={image.imageUrl || image.src || image.image}
                        alt={image.name || image.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400?text=Gallery+Image';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full text-xs font-semibold shadow-sm text-gray-800 dark:text-gray-200 backdrop-blur-sm">
                        {image.categoryName || image.category || 'Gallery'}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1 mb-1" title={image.name || image.title}>
                        {image.name || image.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {image.description || 'No description provided.'}
                      </p>

                      {/* Artist Info */}
                      {image.userName && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">
                          🎨 Author: {image.userName.split('@')[0]}
                        </p>
                      )}

                      <div className="mt-auto pt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
                        <span>📅 {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : 'Recent'}</span>
                        <span className="text-purple-500 dark:text-purple-400 font-medium cursor-pointer hover:underline">View Details</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {filteredImages.length > itemsPerPage && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-xl text-gray-600 dark:text-gray-300">No masterpieces found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Image Modal */}
      <ImagePreviewModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage ? (selectedImage.src || selectedImage.imageUrl || selectedImage.image) : ''}
        title={selectedImage ? (selectedImage.name || selectedImage.title) : ''}
      />
    </section>
  );
};

export default Gallery;
