import React from "react";
import Gallery from "../components/Gallery";
const GalleryPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=1920&q=80"
            alt="Gallery Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-pink-900/70 via-purple-900/60 to-blue-900/50"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl relative z-10 text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Art <span className="text-yellow-300">Gallery</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover amazing artworks created by our talented students
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold">
              <span className="text-yellow-300 font-bold">500+</span> Artworks
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold">
              <span className="text-yellow-300 font-bold">50+</span> Artists
            </div>
          </div>
        </div>
      </section>

      <Gallery />
    </div>
  );
};
export default GalleryPage;
