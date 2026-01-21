import { FaInstagram, FaHeart, FaComment } from 'react-icons/fa';

const FollowUsOnInstagram = () => {
  const instagramPosts = [
    {
      id: 1,
      image: '/image/WhatsApp Image 2026-01-19 at 2.17.55 PM.jpeg',
     
    },
    {
      id: 2,
      image: '/image/WhatsApp Image 2026-01-19 at 2.17.56 PM.jpeg',
      
    },
    {
      id: 3,
      image: '/image/WhatsApp Image 2026-01-19 at 2.17.57 PM.jpeg',
      
    },
    {
      id: 4,
      image: '/image/WhatsApp Image 2026-01-19 at 2.17.58 PM.jpeg',
      
    },
    {
      id: 5,
      image: '/image/WhatsApp Image 2026-01-19 at 2.17.59 PM.jpeg',
      
    },
    {
      id: 6,
      image: '/image/WhatsApp Image 2026-01-19 at 2.18.00 PM.jpeg',
     
    },
    {
      id: 7,
      image: '/image/WhatsApp Image 2026-01-19 at 2.18.02 PM.jpeg',
     
    },
    {
      id: 8,
      image: '/image/WhatsApp Image 2026-01-19 at 2.18.03 PM.jpeg',
      
    },
    {
      id: 9,
      image: '/image/WhatsApp Image 2026-01-19 at 2.18.04 PM.jpeg',
      
    },
    {
      id: 10,
      image: '/image/WhatsApp Image 2026-01-19 at 2.18.05 PM.jpeg',
      
    },
    {
      id: 11,
      image: '/image/WhatsApp Image 2026-01-19 at 2.18.06 PM.jpeg',
      
    },
    {
      id: 12,
      image: '/image/WhatsApp Image 2026-01-19 at 2.18.43 PM.jpeg',
      
    }
  ];

  return (
    <section className="py-4 md:py-4 bg-gradient-to-b from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
         
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Follow Us on{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
              Instagram
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Stay updated on the latest courses & offerings
          </p>

          {/* Instagram Handle */}
         
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {instagramPosts.map((post, index) => (
            <a
              key={post.id}
              href="https://www.instagram.com/your_handle"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Image */}
              <img
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Instagram Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <FaInstagram className="text-2xl text-purple-600" />
                </div>
              </div>


              {/* Decorative Corner */}
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            Join our creative community and get inspired daily!
          </p>
          <a
            href="https://www.instagram.com/your_handle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-full font-semibold hover:bg-purple-600 hover:text-white dark:hover:text-white shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <FaInstagram className="text-xl group-hover:scale-110 transition-transform" />
            <span>Follow for Daily Inspiration</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FollowUsOnInstagram;
