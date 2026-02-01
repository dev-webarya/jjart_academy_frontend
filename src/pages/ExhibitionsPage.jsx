import React, { useState, useEffect } from "react";
import { FaCalendar, FaMapMarkerAlt, FaClock, FaFilter, FaArrowRight, FaTimes, FaPalette, FaUser } from "react-icons/fa";
import EnrollmentForm from "../components/EnrollmentForm";
import ExhibitionsService from "../services/exhibitionsService";
import ImagePreviewModal from "../components/ui/ImagePreviewModal";
import { useAuth } from "../context/AuthContext";
import StudentLogin from "../components/auth/StudentLogin";
import Pagination from "../components/common/Pagination";

const ExhibitionsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredExhibitions, setFilteredExhibitions] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [prefilledClassId, setPrefilledClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exhibitions, setExhibitions] = useState([]);
  const { isStudent } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedExhibitionTitle, setSelectedExhibitionTitle] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Image Preview State
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');

  const [categories, setCategories] = useState([
    { id: "all", name: "All Exhibitions", icon: "🎨" },
    { id: "painting", name: "Painting", icon: "🖌️" },
    { id: "drawing", name: "Drawing", icon: "✏️" },
    { id: "watercolor", name: "Watercolor", icon: "💧" },
    { id: "digital", name: "Digital Art", icon: "💻" },
    { id: "sculpture", name: "Sculpture", icon: "🗿" },
    { id: "mixed", name: "Mixed Media", icon: "✨" }
  ]);

  // Mock exhibition data as fallback
  const exhibitionDataFallback = [
    {
      id: 1,
      title: "Spring Colors 2025",
      name: "Spring Colors 2025",
      category: "watercolor",
      startDate: "2025-03-15",
      endDate: "2025-03-30",
      location: "Main Gallery Hall",
      time: "10:00 AM - 6:00 PM",
      imageUrl: "https://www.museumnext.com/wp-content/uploads/2017/06/Designing-an-Exhibition-1.jpg",
      description: "A vibrant collection of watercolor paintings by our talented students",
      artistCount: 12,
      artworksCount: 45,
      featured: true,
      active: true,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Digital Dreams",
      name: "Digital Dreams",
      category: "digital",
      startDate: "2025-02-20",
      endDate: "2025-03-10",
      location: "Innovation Studio",
      time: "9:00 AM - 7:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      description: "Cutting-edge digital artwork and 3D creations from our advanced students",
      artistCount: 8,
      artworksCount: 32,
      featured: true,
      active: true,
      status: "ongoing"
    }
  ];

  // Fetch exhibitions from API
  useEffect(() => {
    const fetchExhibitions = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await ExhibitionsService.getAllExhibitions();
        if (result && (result.success || Array.isArray(result.data) || result.content)) {
          const data = result.data || result.content || result;
          // Ensure it's an array
          setExhibitions(Array.isArray(data) ? data : (data.content || []));
        } else {
          setExhibitions(exhibitionDataFallback);
        }
      } catch (err) {
        console.error('❌ ERROR fetching exhibitions:', err);
        setError(err.message);
        setExhibitions(exhibitionDataFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  // Transform API data to match the expected format
  useEffect(() => {
    const transformedExhibitions = exhibitions.map(ex => ({
      ...ex,
      featured: ex.featured !== undefined ? ex.featured : false,
      status: ex.status || 'upcoming',
      artistCount: ex.artistCount || ex.artists || 0,
      artworksCount: ex.artworksCount || ex.artworks || 0,
      imageUrl: ex.imageUrl || ex.image,
      title: ex.title || ex.name
    }));

    if (selectedCategory === "all") {
      setFilteredExhibitions(transformedExhibitions);
    } else {
      setFilteredExhibitions(
        transformedExhibitions.filter(
          (ex) => (ex.category === selectedCategory || ex.categoryId === selectedCategory || (ex.categoryName && ex.categoryName.toLowerCase().includes(selectedCategory)))
        )
      );
    }
    setCurrentPage(1);
  }, [selectedCategory, exhibitions]);

  const openDetails = (exhibition) => {
    setSelectedExhibition(exhibition);
  };

  const handleRegister = (exhibition) => {
    if (!isStudent) {
      setShowLoginModal(true);
      return;
    }
    const classId = exhibition.id;
    setPrefilledClassId(classId);
    setSelectedExhibitionTitle(exhibition.title || exhibition.name);
    setSelectedExhibition(null);
    setShowEnrollForm(true);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExhibitions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExhibitions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Hero Section */}
      {!loading && (
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&q=80"
              alt="Art Exhibition Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-br from-purple-900/80 via-pink-900/70 to-red-900/60"></div>
          </div>

          <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl relative z-10 text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              Art <span className="text-yellow-300">Exhibitions</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Celebrate the creativity and talent of our young artists across diverse art forms and styles
            </p>
          </div>
        </section>
      )}

      {/* Filter Section */}
      <section className="py-12 bg-linear-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-800">
        <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
          <div className="flex items-center justify-center mb-8 space-x-3">
            <FaFilter className="text-purple-600 dark:text-purple-400 text-xl" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Filter by Category
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-gray-700"
                  }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions Grid (Admin Design Port) */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
          {!loading && filteredExhibitions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.imageUrl || item.image || 'https://via.placeholder.com/300?text=Exhibition'}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => {
                          setPreviewImage(item.imageUrl || item.image || 'https://via.placeholder.com/300?text=Exhibition');
                          setPreviewTitle(item.title || item.name);
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full text-xs font-semibold shadow-sm text-gray-800 dark:text-gray-200">
                        {item.categoryName || item.category || 'General'}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex items-center text-white text-sm font-medium">
                          <FaMapMarkerAlt className="mr-2 text-red-400" />
                          {item.location}
                        </div>
                      </div>
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${item.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {item.active ? 'Active' : 'Past'}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1" title={item.title || item.name}>
                        {item.title || item.name}
                      </h3>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaCalendar className="mr-2 text-blue-500" />
                        <span>
                          {item.startDate ? new Date(item.startDate).toLocaleDateString() : (item.date ? item.date.split('-')[0] : '-')}
                          {' — '}
                          {item.endDate ? new Date(item.endDate).toLocaleDateString() : (item.date ? item.date.split('-')[1] : '-')}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10">
                        {item.description}
                      </p>

                      <div className="flex gap-4 text-sm text-gray-500 pt-2">
                        <div className="flex items-center gap-1">
                          <FaUser className="text-purple-500" />
                          <span className="font-semibold">{item.artistCount || item.artists}</span> Artists
                        </div>
                        <div className="flex items-center gap-1">
                          <FaPalette className="text-orange-500" />
                          <span className="font-semibold">{item.artworksCount || item.artworks}</span> Artworks
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 gap-2 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => openDetails(item)}
                          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors text-sm font-semibold"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleRegister(item)}
                          className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {filteredExhibitions.length > itemsPerPage && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No exhibitions found in this category.
              </p>
            </div>
          )}
        </div>
      </section >


      {/* Exhibition Detail Modal */}
      {
        selectedExhibition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedExhibition(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <img
                  src={selectedExhibition.imageUrl || selectedExhibition.image}
                  alt={selectedExhibition.title || selectedExhibition.name}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedExhibition(null)}
                  className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedExhibition.title || selectedExhibition.name}</h2>

                <p className="text-gray-600 dark:text-gray-300 text-lg">{selectedExhibition.description}</p>

                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <FaCalendar className="text-purple-600 dark:text-purple-400" size={20} />
                    <span className="font-semibold">
                      {selectedExhibition.startDate ? new Date(selectedExhibition.startDate).toLocaleDateString() : (selectedExhibition.date ? selectedExhibition.date : '-')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <FaClock className="text-pink-600 dark:text-pink-400" size={20} />
                    <span className="font-semibold">{selectedExhibition.time || 'All Day'}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <FaMapMarkerAlt className="text-red-600 dark:text-red-400" size={20} />
                    <span className="font-semibold">{selectedExhibition.location}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleRegister(selectedExhibition)}
                    className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Register for This Exhibition
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Enrollment Form Modal */}
      <EnrollmentForm
        isOpen={showEnrollForm}
        onClose={() => setShowEnrollForm(false)}
        selectedClassId={prefilledClassId}
        selectedClassName={selectedExhibitionTitle}
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
    </div >
  );
};

export default ExhibitionsPage;
