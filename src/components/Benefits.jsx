import { FaCheckCircle } from "react-icons/fa";
const Benefits = () => {
  const benefits = [
    {
      title: "Boost Creativity",
      description:
        "Unlock your child's imagination through artistic expression and creative thinking",
      icon: "🎨",
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.50 PM.jpeg",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Build Confidence",
      description: "Watch them grow proud of their creations and artistic abilities",
      icon: "💪",
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.52 PM.jpeg",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Develop Motor Skills",
      description: "Enhance fine motor skills through engaging hands-on activities",
      icon: "✋",
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.53 PM (1).jpeg",
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Improve Focus",
      description: "Art activities help children concentrate better and stay engaged",
      icon: "🎯",
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.54 PM.jpeg",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Express Emotions",
      description: "Learn healthy ways to express feelings through creative art",
      icon: "😊",
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.55 PM (1).jpeg",
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "Make Friends",
      description: "Connect with other young artists in fun group activities",
      icon: "👫",
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.57 PM (1).jpeg",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Learn Patience",
      description: "Art teaches the value of taking time and practicing skills",
      icon: "⏰",
      image: "/image/WhatsApp Image 2026-01-19 at 2.17.58 PM (1).jpeg",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Problem Solving",
      description: "Develop critical thinking through creative challenges",
      icon: "🧩",
      image: "/image/WhatsApp Image 2026-01-19 at 2.18.00 PM (1).jpeg",
      gradient: "from-pink-500 to-rose-500",
    },
  ];
  return (
    <section className="bg-linear-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight px-4">
              How Art{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-green-600 via-blue-600 to-purple-600">
                Transforms Kids
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Discover the amazing benefits of art education for your child's development
            </p>
          </div>
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Image Background */}
                <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-linear-to-br ₹{benefit.gradient} opacity-70 group-hover:opacity-50 transition-opacity duration-500`}></div>
                </div>
                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 shrink-0" />
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                {/* Decorative Border */}
                <div className={`absolute inset-0 border-4 border-transparent group-hover:bg-linear-to-br ₹{benefit.gradient} group-hover:opacity-10 rounded-2xl pointer-events-none transition-all duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Benefits;
