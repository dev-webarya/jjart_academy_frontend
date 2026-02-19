import { FaPaintBrush, FaUsers, FaCertificate, FaHeart } from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: FaPaintBrush,
      title: "Expert Instruction",
      description:
        "Learn from award-winning artists and certified instructors with years of experience.",
      image: "/image/WhatsApp Image 2026-01-19 at 2.18.00 PM.jpeg"
    },
    {
      icon: FaUsers,
      title: "Small Class Sizes",
      description:
        "Intimate class settings ensure personalized attention and faster skill development.",
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.53 PM.jpeg"
    },
    {
      icon: FaCertificate,
      title: "Certification",
      description:
        "Receive recognized certificates upon course completion to showcase your achievements.",
      image: "/image/WhatsApp Image 2026-01-19 at 2.18.02 PM.jpeg"
    },
    {
      icon: FaHeart,
      title: "Creative Community",
      description:
        "Join a vibrant community of artists and art enthusiasts who share your passion.",
      image: "/image/WhatsApp Image 2026-01-19 at 2.18.04 PM.jpeg"
    },
  ];

  return (
    <section
      id="about"
      className="relative bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      {/* Decorative blur circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-100/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="space-y-16 sm:space-y-20">
          {/* Section Header */}
          <div className="text-center space-y-4 sm:space-y-5">
            <span className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium border border-violet-100 dark:border-violet-800">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white px-4 tracking-tight">
              Why Choose{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-500">
                Our Art School?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed">
              We've been nurturing artistic talent for over 15 years, providing
              exceptional art education in a supportive and inspiring
              environment.
            </p>
          </div>
          
          {/* About Content Grid */}
          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
            {/* Left - Image with Modern Overlay */}
            <div className="relative px-4 sm:px-0">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-3xl blur-2xl"></div>
              
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 dark:shadow-none ring-1 ring-slate-200/50 dark:ring-white/10">
                <img
                  src="\image\WhatsApp Image 2026-01-19 at 2.17.50 PM.jpeg"
                  alt="Art Studio"
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-6 sm:p-8 md:p-10">
                  <div className="text-white">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium mb-3">
                      Est. 2011
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Our Studio</h3>
                    <p className="text-white/80 text-sm sm:text-base mt-1">
                      A space where creativity thrives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right - Content */}
            <div className="space-y-5 sm:space-y-6 md:space-y-8 mt-8 lg:mt-0 px-4 sm:px-0">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Empowering Artists of All Levels
              </h3>
              <div className="space-y-4">
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-gray-300 leading-relaxed">
                  Our art school is dedicated to fostering creativity and artistic
                  expression. Whether you're a complete beginner or an experienced
                  artist looking to refine your skills, we provide the perfect
                  environment for growth.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-gray-300 leading-relaxed">
                  With state-of-the-art facilities, passionate instructors, and a
                  curriculum that balances traditional techniques with
                  contemporary approaches, we ensure every student achieves their
                  artistic goals.
                </p>
              </div>
              
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Join Our Community
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 px-4 sm:px-0">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-violet-200/50 dark:hover:shadow-violet-900/20 transition-all duration-300 overflow-hidden hover:-translate-y-1 ring-1 ring-slate-100 dark:ring-white/5"
              >
                {/* Feature Image */}
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <feature.icon className="text-lg sm:text-xl text-white" />
                  </div>
                </div>
                
                {/* Feature Content */}
                <div className="p-5 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
