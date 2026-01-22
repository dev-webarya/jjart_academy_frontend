import { useState } from "react";
import {
  FaClock,
  FaDollarSign,
  FaStar,
  FaUsers,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { classesData } from "../data/classesData";
import EnrollmentForm from "./EnrollmentForm";

const Classes = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleEnrollNow = (classItem) => {
    setSelectedClass(classItem);
    setShowEnrollmentForm(true);
  };
  const categories = [
    "All",
    "Drawing",
    "Painting",
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];
  const filteredClasses = classesData.filter((classItem) => {
    const matchesCategory =
      selectedCategory === "All" || classItem.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "All" || classItem.level === selectedLevel;
    const matchesSearch =
      searchQuery === "" ||
      classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });
  return (
    <section id="classes" className="bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              Our Classes
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white px-4">
              Discover Your{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600">
                Perfect Class
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Choose from our diverse range of art classes designed for all
              skill levels
            </p>
          </div>
          {/* Search and Filters */}
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base focus:border-purple-600 focus:outline-none transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div className="w-full sm:w-40 md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base focus:border-purple-600 focus:outline-none transition-all cursor-pointer font-semibold"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {/* Skill Level Dropdown */}
              <div className="w-full sm:w-40 md:w-48">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base focus:border-blue-600 focus:outline-none transition-all cursor-pointer font-semibold"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Classes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {filteredClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 md:h-56 overflow-hidden">
                  <img
                    src={classItem.image}
                    alt={classItem.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                    <span className="text-xs sm:text-sm font-bold text-purple-600">
                      {classItem.price}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-purple-600 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold">
                    {classItem.level}
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6 space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                      {classItem.category}
                    </span>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mt-1">
                      {classItem.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {classItem.description}
                  </p>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2.5 sm:pt-3 md:pt-4 space-y-2.5 sm:space-y-3">
                    <button 
                      onClick={() => handleEnrollNow(classItem)}
                      className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* No Results */}
          {filteredClasses.length === 0 && (
            <div className="text-center py-8 sm:py-6">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-400 px-4">
                No classes found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Enrollment Form Modal */}
      <EnrollmentForm 
        isOpen={showEnrollmentForm} 
        onClose={() => setShowEnrollmentForm(false)}
      />
    </section>
  );
}
export default Classes;
