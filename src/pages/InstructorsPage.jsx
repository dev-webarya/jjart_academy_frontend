import React from "react";
import Instructors from "../components/Instructors";
const InstructorsPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80"
            alt="Instructors Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-indigo-900/70 via-purple-900/60 to-pink-900/50"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl relative z-10 text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Our <span className="text-yellow-300">Instructors</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Meet our passionate and experienced art teachers
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold">
              <span className="text-yellow-300 font-bold">5</span> Expert Teachers
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold">
              <span className="text-yellow-300 font-bold">50+</span> Years Experience
            </div>
          </div>
        </div>
      </section>

      <Instructors />
    </div>
  );
};
export default InstructorsPage;
