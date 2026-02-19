import React from "react";
import Classes from "../components/Classes";
const ClassesPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1920&q=80"
            alt="Classes Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/60 via-purple-900/50 to-pink-900/40"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Our <span className="text-yellow-300">Classes</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto px-4">
            Explore our wide range of art classes for all ages and skill levels
          </p>
        </div>
      </section>
      <Classes />
    </div>
  );
};
export default ClassesPage;