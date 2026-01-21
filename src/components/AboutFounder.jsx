import { FaQuoteLeft, FaPalette, FaHeart, FaAward } from 'react-icons/fa';

const AboutFounder = () => {
  return (
    <section className="py-4 md:py-4 bg-gradient-to-b from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-6 py-2 rounded-full text-sm font-semibold mb-4">
            About Founder
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Meet{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Shankari Pandiyaraj
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Founder & Lead Instructor
          </p>
        </div>

        {/* Founder Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Founder Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
                alt="Founder"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent"></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute bottom-8 left-8 w-32 h-32 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full opacity-20 blur-xl"></div>
              
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <FaQuoteLeft className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          {/* Right - Founder Story */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                <FaHeart className="text-xl" />
                <span className="font-semibold">A Passion for Art</span>
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                An art lover at heart, I started working on my first ever piece of handmade art 
                a few years ago. Right then I realized my passion for art, and that I wanted to 
                pursue this in a big way.
              </p>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I took the leap and quit my cushy job to learn different forms of art. Having no 
                formal training in art, I started working on my skills with materials available 
                around me at home, learning constantly and exploring different forms of handmade art.
              </p>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I now teach a number of styles through various mediums and themes to art enthusiasts 
                across the country. Through constant support and encouragement from my family, I started 
                our Art School - an art academy for kids and adults, encouraging and guiding them to 
                bring out their artistic side.
              </p>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-l-4 border-purple-600">
                <p className="text-xl font-semibold text-gray-900 dark:text-white italic">
                  "I am now on a mission to help art lovers and enthusiasts learn different forms 
                  of art and have fun while doing it."
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span>Connect With Me</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFounder;
