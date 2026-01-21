import React from "react";
import Contact from "../components/Contact";
const ContactPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=1920&q=80"
            alt="Contact Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-green-900/60 via-blue-900/50 to-purple-900/40"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Get in <span className="text-yellow-300">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you!
          </p>
        </div>
      </section>
      
      <Contact />
    </div>
  );
};
export default ContactPage;
