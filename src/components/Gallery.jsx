import { useState, useEffect } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaSpinner,
} from "react-icons/fa";
import { galleryImages } from "../data/classesData";
import galleryService from "../services/galleryService";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [galleries, setGalleries] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [apiCategories, setApiCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch galleries and categories on component mount
  useEffect(() => {
    const fetchGalleryData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🚀 Starting to fetch galleries and categories...');
        
        // Fetch both galleries and categories in parallel
        const [galleriesResult, categoriesResult] = await Promise.all([
          galleryService.getAllGalleries(),
          galleryService.getAllGalleryCategories()
        ]);
        
        console.log('📡 Galleries Response:', galleriesResult);
        console.log('📡 Categories Response:', categoriesResult);
        
        // Process Galleries
        if (galleriesResult.success) {
          let galleryData = galleriesResult.data;
          
          console.log('📋 Gallery data type:', typeof galleryData);
          console.log('📋 Is array:', Array.isArray(galleryData));
          
          // Handle nested data.data structure
          if (galleryData && typeof galleryData === 'object' && galleryData.data) {
            galleryData = galleryData.data;
          }
          
          // Handle nested content structure (from API response)
          if (galleryData && typeof galleryData === 'object' && galleryData.content) {
            galleryData = galleryData.content;
          }
          
          // Ensure we have an array
          if (!Array.isArray(galleryData)) {
            galleryData = galleryData ? [galleryData] : [];
          }
          
          if (galleryData.length > 0) {
            const transformedGalleries = galleryData.map(g => 
              galleryService.transformGalleryData(g)
            );
            setGalleries(transformedGalleries);
            console.log('✅ Real galleries loaded from API:', transformedGalleries.length + ' items');
          } else {
            setError('No galleries found from API');
            console.warn('⚠️ API returned empty galleries data');
          }
        } else {
          setError(galleriesResult.message || 'Failed to fetch galleries');
          console.error('❌ Galleries API Error:', galleriesResult.message);
        }
        
        // Process Categories
        if (categoriesResult.success) {
          let categoryData = categoriesResult.data;
          
          // Handle nested structure
          if (categoryData && typeof categoryData === 'object' && categoryData.data) {
            categoryData = categoryData.data;
          }
          
          // Ensure we have an array
          if (!Array.isArray(categoryData)) {
            categoryData = categoryData ? [categoryData] : [];
          }
          
          if (categoryData.length > 0) {
            const transformedCategories = categoryData.map(c => 
              galleryService.transformCategoryData(c)
            );
            setApiCategories(transformedCategories);
            
            // Build categories list from API data
            const categoryNames = [
              "All",
              ...transformedCategories.map(cat => cat.name).filter(Boolean)
            ];
            setCategories(categoryNames);
            console.log('✅ Categories loaded from API:', transformedCategories.length + ' categories');
            console.log('📂 Category names:', categoryNames);
          } else {
            console.warn('⚠️ No categories found from API');
          }
        } else {
          console.warn('⚠️ Categories API returned no data:', categoriesResult.message);
        }
      } catch (err) {
        const errorMsg = err.message || 'Failed to load gallery data';
        console.error('❌ Network Error:', errorMsg);
        setError(errorMsg);
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
      : galleries.filter((img) => (img.categoryName || img.category) === selectedCategory);
  const handlePrevious = () => {
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    setSelectedImage(filteredImages[prevIndex]);
  };
  const handleNext = () => {
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    const nextIndex =
      currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredImages[nextIndex]);
  };

  // Loading state
  if (loading) {
    return (
      <section id="gallery" className="bg-white dark:bg-gray-900 py-8 md:py-8">
        <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
          <div className="text-center space-y-6">
            <FaSpinner className="text-4xl animate-spin text-purple-600 mx-auto" />
            <p className="text-xl text-gray-600 dark:text-gray-300">Loading galleries...</p>
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
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                  ❌ Error Loading Real Data
                </p>
                <p className="text-sm text-red-500 dark:text-red-300 mt-1">{error}</p>
              </div>
            )}
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
          
          {/* Gallery Grid */}
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className="cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-200 dark:bg-gray-700 h-64">
                    <img
                      src={image.src || image.imageUrl || image.image}
                      alt={image.name || image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400?text=Gallery+Image';
                      }}
                    />
                  </div>
                  
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {image.categoryName || 'Gallery'}
                    </span>
                    {image.active && (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">✓ Active</span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {image.name || image.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {image.description || 'Gallery'}
                  </p>

                  {/* Meta Info */}
                  <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                    <p>📅 {new Date(image.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              {error ? (
                <>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">⚠️ Unable to Load Galleries</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{error}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Please check the console (F12) for more details</p>
                </>
              ) : (
                <p className="text-xl text-gray-600 dark:text-gray-300">No galleries found for this category.</p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl transition-all"
          >
            <FaTimes />
          </button>
          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-2 sm:left-4 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl transition-all"
          >
            <FaChevronLeft />
          </button>
          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 sm:right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl transition-all"
          >
            <FaChevronRight />
          </button>
          {/* Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full mx-auto"
          >
            <img
              src={selectedImage.src || selectedImage.imageUrl || selectedImage.image}
              alt={selectedImage.name || selectedImage.title}
              className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg sm:rounded-2xl shadow-2xl"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800?text=Gallery+Image';
              }}
            />
            {/* Image Info */}
            <div className="text-center text-white mt-6 sm:mt-8 px-4 sm:px-6 space-y-3">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">{selectedImage.name || selectedImage.title}</h3>
                <p className="text-base sm:text-lg md:text-xl text-white/80">{selectedImage.description || 'Professional gallery space'}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 rounded-full text-sm sm:text-base font-semibold">
                  📍 {selectedImage.categoryName || selectedImage.category || 'Gallery'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default Gallery;