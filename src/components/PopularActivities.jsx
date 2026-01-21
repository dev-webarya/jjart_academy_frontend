import {
  FaPaintBrush,
  FaPalette,
  FaCut,
  FaLaptop,
  FaCameraRetro,
  FaPencilAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const PopularActivities = () => {
  const activities = [
    {
      icon: FaPaintBrush,
      title: "Painting",
      description: "Watercolor, acrylic, and tempera painting techniques for all skill levels",
      color: "from-red-400 to-pink-400",
      image:
        "/image/WhatsApp Image 2026-01-19 at 2.17.55 PM (1).jpeg",
    },
    {
      icon: FaPencilAlt,
      title: "Drawing",
      description: "Sketching, doodling, and illustration to bring imagination to life",
      color: "from-blue-400 to-indigo-400",
      image:
        "/image/WhatsApp Image 2026-01-19 at 2.17.56 PM.jpeg",
    },
    {
      icon: FaCut,
      title: "Crafts",
      description: "Creative paper crafts, origami, and exciting DIY projects",
      color: "from-green-400 to-emerald-400",
      image:
        "/image/WhatsApp Image 2026-01-19 at 2.17.57 PM (2).jpeg",
    },
    {
      icon: FaPalette,
      title: "Clay Modeling",
      description: "Hands-on pottery, sculpture, and beautiful 3D art creation",
      color: "from-yellow-400 to-orange-400",
      image:
        "/image/WhatsApp Image 2026-01-19 at 2.17.58 PM.jpeg",
    },
    {
      icon: FaLaptop,
      title: "Digital Art",
      description: "Modern graphic design and digital illustration for tech-savvy kids",
      color: "from-purple-400 to-pink-400",
      image:
        "/image/WhatsApp Image 2026-01-19 at 2.18.00 PM (2).jpeg",
    },
    {
      icon: FaCameraRetro,
      title: "Photography",
      description: "Basic photography skills and creative photo editing techniques",
      color: "from-cyan-400 to-blue-400",
      image:
        "/image/WhatsApp Image 2026-01-19 at 2.18.04 PM (1).jpeg",
    },
  ];
  return (
    <section className="bg-linear-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 md:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight px-4">
              What Kids{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-600 via-pink-600 to-purple-600">
                Love to Create
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Explore our most popular activities that spark creativity and imagination
            </p>
          </div>
          {/* Activities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activities.map((activity, index) => (
              <div key={index} className="group relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Image Section - Takes more space */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-linear-to-br ₹{activity.color} opacity-50 group-hover:opacity-30 transition-opacity duration-500`}
                  ></div>
                  {/* Icon Badge */}
                  
                </div>
                {/* Content Section */}
                <div className="p-5 sm:p-6 space-y-2 sm:space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {activity.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
                {/* Decorative Border */}
                <div className={`absolute inset-0 border-4 border-transparent group-hover:bg-linear-to-br ₹{activity.color} group-hover:opacity-10 rounded-2xl sm:rounded-3xl pointer-events-none transition-all duration-300`}></div>
              </div>
            ))}
          </div>
          {/* View All Button */}
          <div className="text-center">
            <Link to="/classes">
              <button className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                View All Classes
              </button>
            </Link>
          </div>
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default PopularActivities;
