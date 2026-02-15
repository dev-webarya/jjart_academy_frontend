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
    <section id="classes" className="bg-slate-50 dark:bg-slate-900 py-6 sm:py-8 md:py-8 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <span className="inline-block bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
              Our Classes
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white px-4">
              Discover Your{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-pink-500">
                Perfect Class
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-4">
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
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
              {/* Search Bar */}
              <div className="relative flex-1 w-full md:max-w-md">
                <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none"
                  disabled={loading}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 cursor-pointer text-sm font-medium whitespace-nowrap outline-none transition-all"
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 cursor-pointer text-sm font-medium whitespace-nowrap outline-none transition-all"
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
              <FaSpinner className="text-4xl text-violet-600 animate-spin mb-4" />
              <p className="text-lg text-slate-600 dark:text-slate-400">Loading classes...</p>
            </div>
          )}

          {/* Classes Grid - Ported from Admin Design */}
          {!loading && (
            <div id="classes-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl hover:shadow-violet-200/50 dark:hover:shadow-violet-900/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-slate-100 dark:border-slate-700">
                  {/* Image Header */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.imageUrl || item.image || 'https://via.placeholder.com/300?text=No+Image'}
                      alt={item.name || item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                      onClick={() => {
                        setPreviewImage(item.imageUrl || item.image || 'https://via.placeholder.com/300?text=No+Image');
                        setPreviewTitle(item.name || item.title);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-md text-violet-600 dark:text-violet-400">
                      {item.categoryName || item.category || 'Uncategorized'}
                    </div>
                    {item.discountPrice && item.discountPrice < item.basePrice && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        Save ₹{(item.basePrice - item.discountPrice).toFixed(0)}
                      </div>
                    )}
                  </div>

                  {/* Content Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1" title={item.name || item.title}>
                        {item.name || item.title}
                      </h3>
                      {/* Determine active status if available, else default to true as they are public */}
                      {/* For public view, we generally show only active, but if data has it, we can use it or just ignore */}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 h-10 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      {(item.durationWeeks || item.weeks) && (
                        <span className="flex items-center gap-1.5 bg-violet-50 dark:bg-violet-900/30 px-2.5 py-1 rounded-full">
                          <FaClock className="text-violet-500" /> {item.durationWeeks || item.weeks} Weeks
                        </span>
                      )}
                      {(item.proficiency || item.level) && (
                        <span className="flex items-center gap-1.5 bg-pink-50 dark:bg-pink-900/30 px-2.5 py-1 rounded-full">
                          <FaUserGraduate className="text-pink-500" /> {item.proficiency || item.level}
                        </span>
                      )}
                    </div>

                    <div className="flex items-end justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Price</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            ₹{(Number(item.discountPrice) > 0 ? item.discountPrice : (Number(item.price) > 0 ? item.price : item.basePrice || 0)).toLocaleString()}
                          </span>
                          {(item.discountPrice || item.originalPrice) && (
                            <span className="text-sm text-slate-400 line-through">
                              ₹{item.basePrice || item.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnrollNow(item)}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 transition-all duration-300"
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
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-50 dark:bg-violet-900/30 mb-4">
                <FaSearch className="text-2xl text-violet-400" />
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
                No classes found matching your criteria.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Try adjusting your filters or search terms
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
