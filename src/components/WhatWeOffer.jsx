import { FaPaintBrush, FaGraduationCap, FaPalette, FaBuilding } from 'react-icons/fa';
const WhatWeOffer = () => {
  const offerings = [
    {
      id: 1,
      title: 'Hobby Classes',
      description: 'Explore your creative side with our fun and relaxing hobby art classes designed for all skill levels',
      image: '/image/WhatsApp Image 2026-01-19 at 2.17.50 PM.jpeg',
      icon: FaPaintBrush,
      color: 'from-purple-500 to-pink-500',
      link: '/classes'
    },
    {
      id: 2,
      title: 'Professional Courses',
      description: 'Intensive professional art training programs with certification for aspiring artists',
      image: '/image/WhatsApp Image 2026-01-19 at 2.17.52 PM.jpeg',
      icon: FaGraduationCap,
      color: 'from-blue-500 to-cyan-500',
      link: '/classes'
    },
    {
      id: 3,
      title: 'Art Workshops',
      description: 'Weekend workshops and creative sessions for individuals, couples, and groups',
      image: '/image/WhatsApp Image 2026-01-19 at 2.17.53 PM.jpeg',
      icon: FaPalette,
      color: 'from-orange-500 to-red-500',
      link: '/events'
    },
    {
      id: 4,
      title: 'Corporate Workshops',
      description: 'Team building and creative experiences tailored for corporate teams and organizations',
      image: '/image/WhatsApp Image 2026-01-19 at 2.17.54 PM.jpeg',
      icon: FaBuilding,
      color: 'from-green-500 to-teal-500',
      link: '/contact'
    }
  ];
  return (
    <section className="py-4 md:py-4 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            What We{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Offer
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our diverse range of art programs designed for everyone
          </p>
        </div>

        {/* Offerings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {offerings.map((offering) => {
            const Icon = offering.icon;
            return (
              <div
                key={offering.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={offering.image}
                    alt={offering.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {offering.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {offering.description}
                  </p>
                  
                  {/* Learn More Button */}
                  <a
                    href={offering.link}
                    className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${offering.color} bg-clip-text text-transparent group-hover:underline mt-4`}
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
                {/* Decorative Element */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${offering.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
export default WhatWeOffer;