import { FaPaintBrush, FaUsers, FaCertificate, FaHeart } from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: FaPaintBrush,
      title: "Expert Instruction",
      description:
        "Learn from award-winning artists and certified instructors with years of experience.",
      color: "from-purple-500 to-pink-500",
      image: "/image/WhatsApp Image 2026-01-19 at 2.18.00 PM.jpeg"
    },
    {
      icon: FaUsers,
      title: "Small Class Sizes",
      description:
        "Intimate class settings ensure personalized attention and faster skill development.",
      color: "from-blue-500 to-cyan-500",
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.53 PM.jpeg"
    },
    {
      icon: FaCertificate,
      title: "Certification",
      description:
        "Receive recognized certificates upon course completion to showcase your achievements.",
      color: "from-orange-500 to-yellow-500",
      image: "/image/WhatsApp Image 2026-01-19 at 2.18.02 PM.jpeg"
    },
    {
      icon: FaHeart,
      title: "Creative Community",
      description:
        "Join a vibrant community of artists and art enthusiasts who share your passion.",
      color: "from-pink-500 to-rose-500",
      image: "/image/WhatsApp Image 2026-01-19 at 2.18.04 PM.jpeg"
    },
  ];
  return (
    <section
      id="about"
      className="bg-linear-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-8 md:py-8"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white px-4">
              Why Choose{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600">
                Our Art School?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              We've been nurturing artistic talent for over 15 years, providing
              exceptional art education in a supportive and inspiring
              environment.
            </p>
          </div>
          
          {/* About Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left - Image with Parallax Effect */}
            <div className="relative px-4 sm:px-0">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="\image\WhatsApp Image 2026-01-19 at 2.17.50 PM.jpeg"
                  alt="Art Studio"
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-purple-900/80 to-transparent flex items-end p-4 sm:p-6 md:p-8">
                  <div className="text-white">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">Our Studio</h3>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base">
                      A space where creativity thrives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right - Content */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 mt-8 lg:mt-0 px-4 sm:px-0">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Empowering Artists of All Levels
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our art school is dedicated to fostering creativity and artistic
                expression. Whether you're a complete beginner or an experienced
                artist looking to refine your skills, we provide the perfect
                environment for growth.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                With state-of-the-art facilities, passionate instructors, and a
                curriculum that balances traditional techniques with
                contemporary approaches, we ensure every student achieves their
                artistic goals.
              </p>
              
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Join Our Community
              </button>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-0">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
              >
                {/* Feature Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  <div
                    className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br ₹{feature.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="text-xl sm:text-2xl text-white" />
                  </div>
                </div>
                
                {/* Feature Content */}
                <div className="p-4 sm:p-5 md:p-6">
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
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
