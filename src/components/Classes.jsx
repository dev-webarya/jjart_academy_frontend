import { useState, useEffect } from "react";
import {
  FaClock,
  FaUserGraduate,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes
} from "react-icons/fa";
import { classesData } from "../data/classesData";
import classesService from "../services/classesService";
import EnrollmentForm from "./EnrollmentForm";
import ImagePreviewModal from "./ui/ImagePreviewModal";
import { useAuth } from "../context/AuthContext";
import StudentLogin from "./auth/StudentLogin";
import Pagination from "./common/Pagination";

const Classes = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isStudent } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 items per page (3x3 grid)

  // Image Preview State
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch classes and categories in parallel
        const [classesResult, categoriesResult] = await Promise.all([
          classesService.getAllClasses(),
          classesService.getAllCategories()
        ]);

        // Handle classes response
        // Admin API returns { content: [...] } for paginated, but here keeping consistent with service
        // Assuming service normalizes it or public API returns array. 
        // Based on ClassesPage.jsx `getPaginated` returns content. 
        // But `classesService.getAllClasses()` usually returns the full response object.
        // Let's assume the service handles specific extraction or we use fallback.
        if (classesResult.success || Array.isArray(classesResult.data) || classesResult.content) {
          // Adapt for paginated response structure if needed
          const data = classesResult.data || classesResult.content || classesResult;
          // Ensure it's an array
          setClasses(Array.isArray(data) ? data : (data.content || []));
        } else {
          setClasses(classesData);
        }

        // Handle categories response
        if (categoriesResult.success || Array.isArray(categoriesResult.data) || categoriesResult.content) {
          const data = categoriesResult.data || categoriesResult.content || categoriesResult;
          const categoryList = Array.isArray(data) ? data : (data.content || []);
          const categoryNames = ["All", ...categoryList.map(cat => cat.name || cat.title)];
          setCategories(categoryNames);
        } else {
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
    if (!isStudent) {
      setShowLoginModal(true);
      return;
    }
    console.log("Enroll request for:", classItem);
    // Map the selected class to the format expected by EnrollmentForm if needed
    // The form expects just an object, it mainly uses the ID for the form field
    setSelectedClass(classItem);
    setShowEnrollmentForm(true);
  };

  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLevel, searchQuery]);

  // Filter classes based on selected criteria
  const filteredClasses = classes.filter((classItem) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (classItem.categoryName || classItem.category) === selectedCategory;

    const matchesLevel =
      selectedLevel === "All" ||
      (classItem.proficiency || classItem.level) === selectedLevel;

    const matchesSearch =
      searchQuery === "" ||
      ((classItem.name || classItem.title) && (classItem.name || classItem.title).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (classItem.description && classItem.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Calculate Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of grid
    const gridElement = document.getElementById('classes-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="classes" className="bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 md:py-8 min-h-screen">
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
              Choose from our diverse range of art classes designed for all skill levels
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
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              {/* Search Bar */}
              <div className="relative flex-1 w-full md:max-w-md">
                <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm font-medium whitespace-nowrap"
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm font-medium whitespace-nowrap"
                  disabled={loading}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="text-4xl text-purple-600 animate-spin mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-400">Loading classes...</p>
            </div>
          )}

          {/* Classes Grid - Ported from Admin Design */}
          {!loading && (
            <div id="classes-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700">
                  {/* Image Header */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.imageUrl || item.image || 'https://via.placeholder.com/300?text=No+Image'}
                      alt={item.name || item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => {
                        setPreviewImage(item.imageUrl || item.image || 'https://via.placeholder.com/300?text=No+Image');
                        setPreviewTitle(item.name || item.title);
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full text-xs font-semibold shadow-sm text-gray-800 dark:text-gray-200">
                      {item.categoryName || item.category || 'Uncategorized'}
                    </div>
                    {item.discountPrice && item.discountPrice < item.basePrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                        Save ₹{(item.basePrice - item.discountPrice).toFixed(0)}
                      </div>
                    )}
                  </div>

                  {/* Content Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1" title={item.name || item.title}>
                        {item.name || item.title}
                      </h3>
                      {/* Determine active status if available, else default to true as they are public */}
                      {/* For public view, we generally show only active, but if data has it, we can use it or just ignore */}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {(item.durationWeeks || item.weeks) && (
                        <span className="flex items-center gap-1">
                          <FaClock className="text-purple-500" /> {item.durationWeeks || item.weeks} Weeks
                        </span>
                      )}
                      {(item.proficiency || item.level) && (
                        <span className="flex items-center gap-1">
                          <FaUserGraduate className="text-blue-500" /> {item.proficiency || item.level}
                        </span>
                      )}
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{(Number(item.discountPrice) > 0 ? item.discountPrice : (Number(item.price) > 0 ? item.price : item.basePrice || 0)).toLocaleString()}
                          </span>
                          {(item.discountPrice || item.originalPrice) && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{item.basePrice || item.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnrollNow(item)}
                        className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredClasses.length > itemsPerPage && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* No Results */}
          {!loading && filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No classes found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Form Modal */}
      <EnrollmentForm
        isOpen={showEnrollmentForm}
        onClose={() => setShowEnrollmentForm(false)}
        selectedClassId={selectedClass?.id}
        selectedClassName={selectedClass?.title || selectedClass?.name}
      />

      <StudentLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
        title={previewTitle}
      />
    </section>
  );
};

export default Classes;
