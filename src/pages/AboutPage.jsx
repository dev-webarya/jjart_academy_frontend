import React from "react";
import About from "../components/About";
import AboutFounder from "../components/AboutFounder";

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1920&q=80"
            alt="About Us Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-purple-900/60 via-pink-900/50 to-orange-900/40"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            About <span className="text-yellow-300">Our Studio</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Nurturing creativity and artistic expression for over 15 years
          </p>
        </div>
      </section>
      
      <About />
      <AboutFounder />
    </div>
  );
};
export default AboutPage;
