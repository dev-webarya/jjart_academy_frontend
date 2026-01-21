const Features = () => {
  const features = [
    {
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.50 PM.jpeg",
      title: "Creative Learning",
      description: "Fun and interactive art sessions designed for young minds to explore their creativity",
      gradient: "from-pink-500 via-rose-500 to-purple-500",
    },
    {
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.52 PM.jpeg",
      title: "Expert Teachers",
      description: "Experienced instructors who are passionate about nurturing young artistic talents",
      gradient: "from-purple-500 via-indigo-500 to-blue-500",
    },
    {
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.54 PM.jpeg",
      title: "Achievements",
      description: "Celebrate every milestone with certificates, awards, and special recognition",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
    },
    {
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.56 PM.jpeg",
      title: "Safe Environment",
      description: "A nurturing and secure space where creativity blooms and children feel at home",
      gradient: "from-red-500 via-pink-500 to-rose-500",
    },
    {
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.58 PM.jpeg",
      title: "Skill Development",
      description: "Build confidence and artistic abilities step by step with structured guidance",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
    },
    {
      image: "/image/WhatsApp Image 2026-01-19 at 2.18.00 PM (1).jpeg",
      title: "Fun & Joy",
      description: "Learning through play, laughter, and creativity in every single session",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
    },
  ];
  return (
    <section className="bg-linear-to-b from-purple-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="space-y-10 sm:space-y-12 md:space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight px-4">
              Where Little{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-pink-600 to-orange-500">
                Artists Shine
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Discover what makes our art school special for all creative learners
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Image Section - Takes Half of Card */}
                <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-linear-to-br ₹{feature.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center px-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.title}
                    </h3>
                  </div>
                </div>

                {/* Content Section - Takes Half of Card */}
                <div className="p-5 sm:p-6 md:p-8">
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative Border on Hover */}
                <div className={`absolute inset-0 border-4 border-transparent group-hover:border-gradient-to-br rounded-3xl pointer-events-none transition-all duration-300`}>
                  <div className={`absolute inset-0 rounded-3xl bg-linear-to-br ₹{feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;
