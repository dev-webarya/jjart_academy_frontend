import { useState, useEffect } from "react";
import {
  FaClock,
  FaDollarSign,
  FaStar,
  FaUsers,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { classesData } from "../data/classesData";
import classesService from "../services/classesService";
import EnrollmentForm from "./EnrollmentForm";

const Classes = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Fetching art classes and categories...');
        
        // Fetch classes and categories in parallel
        const [classesResult, categoriesResult] = await Promise.all([
          classesService.getAllClasses(),
          classesService.getAllCategories()
        ]);

        // Handle classes response
        if (classesResult.success && classesResult.data.length > 0) {
          console.log('✅ Classes fetched successfully:', classesResult.data);
          setClasses(classesResult.data);
        } else if (classesResult.success && classesResult.data.length === 0) {
          console.log('⚠️ No classes data from API, using fallback data');
          setClasses(classesData);
        } else {
          console.log('❌ Failed to fetch classes:', classesResult.message);
          setClasses(classesData);
          setError('Unable to load classes from server, showing default data');
        }

        // Handle categories response
        if (categoriesResult.success && categoriesResult.data.length > 0) {
          console.log('✅ Categories fetched successfully:', categoriesResult.data);
          const categoryNames = ["All", ...categoriesResult.data.map(cat => cat.name || cat.title)];
          setCategories(categoryNames);
        } else {
          console.log('⚠️ No categories data from API, using default categories');
          const uniqueCategories = ["All", ...new Set(classesData.map(c => c.category))];
          setCategories(uniqueCategories);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError('Error loading classes. Using fallback data.');
        setClasses(classesData);
        const uniqueCategories = ["All", ...new Set(classesData.map(c => c.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnrollNow = (classItem) => {
    setSelectedClass(classItem);
    setShowEnrollmentForm(true);
  };

  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  // Filter classes based on selected criteria
  const filteredClasses = classes.filter((classItem) => {
    const matchesCategory =
      selectedCategory === "All" || 
      classItem.category === selectedCategory ||
      classItem.categoryName === selectedCategory;
    
    const matchesLevel =
      selectedLevel === "All" || 
      classItem.level === selectedLevel;
    
    const matchesSearch =
      searchQuery === "" ||
      (classItem.title && classItem.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (classItem.description && classItem.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
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

          {/* Error Banner */}
          {error && (
            <div className="max-w-5xl mx-auto bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4 flex items-start gap-3">
              <FaExclamationTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm sm:text-base text-amber-800 dark:text-amber-300">{error}</p>
              </div>
            </div>
          )}

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
                  disabled={loading}
                />
              </div>

              {/* Category Dropdown */}
              <div className="w-full sm:w-40 md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base focus:border-purple-600 focus:outline-none transition-all cursor-pointer font-semibold"
                  disabled={loading}
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
                  disabled={loading}
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

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="text-4xl text-purple-600 animate-spin mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-400">Loading classes...</p>
            </div>
          )}

          {/* Classes Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {filteredClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-48 md:h-56 overflow-hidden">
                    <img
                      src={classItem.image || classItem.imageUrl}
                      alt={classItem.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800";
                      }}
                    />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                      <span className="text-xs sm:text-sm font-bold text-purple-600">
                        {classItem.price || classItem.pricePerClass}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-purple-600 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold">
                      {classItem.level || classItem.skillLevel}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 md:p-6 space-y-2.5 sm:space-y-3 md:space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                        {classItem.category || classItem.categoryName}
                      </span>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mt-1">
                        {classItem.title || classItem.className}
                      </h3>
                    </div>

                    {classItem.instructor && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Instructor: {classItem.instructor}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {classItem.description}
                    </p>

                    {classItem.students && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <FaUsers className="text-purple-600" />
                        <span>{classItem.students} students enrolled</span>
                      </div>
                    )}

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
          )}

          {/* No Results */}
          {!loading && filteredClasses.length === 0 && (
            <div className="text-center py-8 sm:py-6">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-400 px-4">
                No classes found. Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Data Summary */}
          {!loading && classes.length > 0 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Showing {filteredClasses.length} of {classes.length} classes</p>
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Form Modal */}
      <EnrollmentForm 
        isOpen={showEnrollmentForm} 
        onClose={() => setShowEnrollmentForm(false)}
        selectedClass={selectedClass}
      />
    </section>
  );
};

export default Classes;
