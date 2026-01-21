import { useState } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
} from "react-icons/fa";
import { galleryImages } from "../data/classesData";
const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    "All",
    ...new Set(galleryImages.map((img) => img.category)),
  ];
  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);
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
              Explore the incredible artwork created by our talented
              students
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
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group h-64"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-5">
                  <div>
                    <h3 className="text-white text-lg md:text-xl font-bold mb-1">
                      {image.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-2">{image.artist}</p>
                    <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                      {image.category}
                    </span>
                  </div>
                  <FaExpand className="absolute top-4 right-4 text-white text-xl" />
                </div>
              </div>
            ))}
          </div>
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
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg sm:rounded-2xl shadow-2xl"
            />
            {/* Image Info */}
            <div className="text-center text-white mt-3 sm:mt-4 px-2 sm:px-4">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{selectedImage.title}</h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-2 sm:mb-3">{selectedImage.artist}</p>
              <span className="inline-block bg-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                {selectedImage.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default Gallery;
