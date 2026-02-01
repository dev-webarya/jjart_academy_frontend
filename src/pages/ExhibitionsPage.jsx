import React, { useState, useEffect } from "react";
import { FaCalendar, FaMapMarkerAlt, FaClock, FaFilter, FaArrowRight, FaTimes } from "react-icons/fa";
import EnrollmentForm from "../components/EnrollmentForm";
import ExhibitionsService from "../services/exhibitionsService";
import ExhibitionsCategoryService from "../services/exhibitionsCategoryService";

const ExhibitionsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [exhibitions, setExhibitions] = useState([]);
  const [filteredExhibitions, setFilteredExhibitions] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [prefilledClassId, setPrefilledClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      category: "watercolor",
      date: "March 15-30, 2025",
      location: "Main Gallery Hall",
      time: "10:00 AM - 6:00 PM",
      image: "https://www.museumnext.com/wp-content/uploads/2017/06/Designing-an-Exhibition-1.jpg",
      description: "A vibrant collection of watercolor paintings by our talented students",
      artists: 12,
      artworks: 45,
      featured: true,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Digital Dreams",
      category: "digital",
      date: "February 20 - March 10, 2025",
      location: "Innovation Studio",
      time: "9:00 AM - 7:00 PM",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      description: "Cutting-edge digital artwork and 3D creations from our advanced students",
      artists: 8,
      artworks: 32,
      featured: true,
      status: "ongoing"
    },
    {
      id: 3,
      title: "Sculpture Showcase",
      category: "sculpture",
      date: "January 25 - February 28, 2025",
      location: "Outdoor Art Park",
      time: "8:00 AM - 8:00 PM",
      image: "https://media.istockphoto.com/id/887680492/photo/visitors-among-the-stands-of-companies.jpg?s=612x612&w=0&k=20&c=xUzFV0iH9HqAkvvRXtktsr4AGoap31t3xEi00h0u56Y=",
      description: "Beautiful 3D sculptures and installations created by intermediate students",
      artists: 10,
      artworks: 28,
      featured: false,
      status: "ongoing"
    },
    {
      id: 4,
      title: "Young Artists Exhibition",
      category: "mixed",
      date: "February 1-15, 2025",
      location: "Community Center",
      time: "10:00 AM - 5:00 PM",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      description: "A celebration of creativity from our beginner level students",
      artists: 20,
      artworks: 60,
      featured: true,
      status: "upcoming"
    },
    {
      id: 5,
      title: "Portrait Masters",
      category: "drawing",
      date: "January 10-31, 2025",
      location: "Heritage Museum",
      time: "10:00 AM - 6:00 PM",
      image: "https://media.istockphoto.com/id/1460912043/photo/ethnic-food-drinks-hall.jpg?s=612x612&w=0&k=20&c=HLBmaRvnzcwBjquGqMECQfRRbxj3K15LwDTekTm4AvQ=",
      description: "Stunning portrait drawings and studies by our advanced drawing students",
      artists: 6,
      artworks: 25,
      featured: false,
      status: "past"
    },
    {
      id: 6,
      title: "Nature's Palette",
      category: "painting",
      date: "March 1-20, 2025",
      location: "Botanical Garden",
      time: "9:00 AM - 5:00 PM",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      description: "Landscape and nature paintings inspired by our field trips",
      artists: 15,
      artworks: 50,
      featured: true,
      status: "upcoming"
    }
  ];
  // Fetch exhibitions from API
  useEffect(() => {
    const fetchExhibitions = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching exhibitions from API...');
        const result = await ExhibitionsService.getAllExhibitions();
        console.log('📋 Service result:', result);
        console.log('📋 result.success:', result.success);
        console.log('📋 result.data type:', typeof result.data);
        console.log('📋 result.data is array:', Array.isArray(result.data));
        console.log('📋 result.data length:', result.data?.length);

        // Check if we have valid data
        if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
          console.log('✅ SUCCESS - Real API data loaded!');
          console.log(`✅ Total exhibitions from API: ${result.data.length}`);
          console.log('✅ First exhibition:', result.data[0]);
          setExhibitions(result.data);
        } else if (result && Array.isArray(result.data) && result.data.length > 0) {
          // Data is valid even if success flag might be false
          console.log('✅ Real API data loaded (alternative format)');
          console.log(`✅ Total exhibitions from API: ${result.data.length}`);
          setExhibitions(result.data);
        } else {
          // Use fallback mock data if API returns no results
          console.warn('⚠️ API returned no data');
          console.warn('📊 Using fallback mock data instead');
          console.log(`📊 Total fallback exhibitions: ${exhibitionDataFallback.length}`);
          setExhibitions(exhibitionDataFallback);
        }
      } catch (err) {
        console.error('❌ ERROR fetching exhibitions:', err);
        console.error('Error details:', err.message, err.stack);
        setError(err.message);
        console.warn('⚠️ API failed - Using fallback mock data as backup');
        console.log(`📊 Total fallback exhibitions: ${exhibitionDataFallback.length}`);
        // Use fallback mock data on error
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
      artists: ex.artists || 0,
      artworks: ex.artworks || 0,
    }));

    if (selectedCategory === "all") {
      setFilteredExhibitions(transformedExhibitions);
    } else {
      setFilteredExhibitions(
        transformedExhibitions.filter(
          (ex) => ex.category === selectedCategory
        )
      );
    }
  }, [selectedCategory, exhibitions]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "past":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ongoing":
        return "🔴 Currently Ongoing";
      case "upcoming":
        return "⏰ Coming Soon";
      case "past":
        return "✓ Past Exhibition";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Loading exhibitions...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 p-4 m-4">
          <p className="text-red-700 dark:text-red-300">
            Error loading exhibitions: {error}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Showing fallback data. Please try refreshing the page.
          </p>
        </div>
      )}
      {/* Hero Section */}
      {!loading && (
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-20">
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

      {/* Featured Exhibitions */}
      {filteredExhibitions.some((ex) => ex.featured) && selectedCategory !== "all" && (
        <section className=" bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExhibitions
                .filter((ex) => ex.featured)
                .map((exhibition) => (
                  <div
                    key={exhibition.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200 dark:border-purple-900"
                  >
                    {/* Image Container */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={exhibition.image}
                        alt={exhibition.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {exhibition.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 line-clamp-1 text-sm">
                        {exhibition.description}
                      </p>

                      {/* Info Grid */}
                      <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300">
                          <FaCalendar className="text-purple-600 dark:text-purple-400 shrink-0" />
                          <span className="font-semibold line-clamp-1">{exhibition.date}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300">
                          <FaClock className="text-pink-600 dark:text-pink-400 shrink-0" />
                          <span className="font-semibold">{exhibition.time}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300">
                          <FaMapMarkerAlt className="text-red-600 dark:text-red-400 shrink-0" />
                          <span className="font-semibold line-clamp-1">{exhibition.location}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => setSelectedExhibition(exhibition)}
                        className="w-full mt-3 bg-linear-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group/btn text-sm"
                      >
                        <span>View Details</span>
                        <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* All Exhibitions */}
      {filteredExhibitions.filter((ex) => !ex.featured).length > 0 && selectedCategory !== "all" && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-10">
              Other Exhibitions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExhibitions.filter((ex) => !ex.featured).map((exhibition) => (
                <div
                  key={exhibition.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Image Container */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={exhibition.image}
                      alt={exhibition.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {exhibition.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                      {exhibition.description}
                    </p>

                    {/* Info */}
                    <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="line-clamp-1">{exhibition.date}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-red-600 dark:text-red-400 shrink-0" />
                        <span className="line-clamp-1">{exhibition.location}</span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setSelectedExhibition(exhibition)}
                        className="flex-1 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:bg-gray-800 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-gray-700 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          const classId = exhibition.id || exhibition._id || exhibition.exhibitionId;
                          setPrefilledClassId(classId);
                          setShowEnrollForm(true);
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {filteredExhibitions.filter((ex) => !ex.featured).length === 0 && filteredExhibitions.filter((ex) => ex.featured).length === 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl text-center py-6">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No exhibitions found in this category. Try another filter!
            </p>
          </div>
        </section>
      )}

      {/* Show all exhibitions in one section when "All" is selected */}
      {selectedCategory === "all" && filteredExhibitions.length > 0 && (
        <section className="pb-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExhibitions.map((exhibition) => (
                <div
                  key={exhibition.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Image Container */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={exhibition.image}
                      alt={exhibition.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {exhibition.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                      {exhibition.description}
                    </p>

                    {/* Info */}
                    <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="line-clamp-1">{exhibition.date}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-red-600 dark:text-red-400 shrink-0" />
                        <span className="line-clamp-1">{exhibition.location}</span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setSelectedExhibition(exhibition)}
                        className="flex-1 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:bg-gray-800 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-gray-700 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          const classId = exhibition.id || exhibition._id || exhibition.exhibitionId;
                          setPrefilledClassId(classId);
                          setShowEnrollForm(true);
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedCategory === "all" && filteredExhibitions.length === 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl text-center py-6">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No exhibitions found. Try another filter!
            </p>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="py-16 bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900">
        <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-white text-center space-y-3">
              <div className="text-5xl">🎯</div>
              <h3 className="text-2xl font-bold">Learn & Grow</h3>
              <p className="text-white/90">
                Exhibitions showcase student progress and celebrate artistic growth
              </p>
            </div>

            <div className="text-white text-center space-y-3">
              <div className="text-5xl">🌟</div>
              <h3 className="text-2xl font-bold">Share & Connect</h3>
              <p className="text-white/90">
                Bring community together through art appreciation and networking
              </p>
            </div>

            <div className="text-white text-center space-y-3">
              <div className="text-5xl">🏆</div>
              <h3 className="text-2xl font-bold">Inspire & Motivate</h3>
              <p className="text-white/90">
                Recognize talent and inspire future generations of artists
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-6">
              Want to Participate in Our Next Exhibition?
            </h3>
            <button
              onClick={() => {
                setPrefilledClassId('');
                setShowEnrollForm(true);
              }}
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </section>

      {/* Exhibition Detail Modal */}
      {selectedExhibition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedExhibition(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={selectedExhibition.image}
                alt={selectedExhibition.title}
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
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedExhibition.title}</h2>

              <p className="text-gray-600 dark:text-gray-300 text-lg">{selectedExhibition.description}</p>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <FaCalendar className="text-purple-600 dark:text-purple-400" size={20} />
                  <span className="font-semibold">{selectedExhibition.date}</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <FaClock className="text-pink-600 dark:text-pink-400" size={20} />
                  <span className="font-semibold">{selectedExhibition.time}</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <FaMapMarkerAlt className="text-red-600 dark:text-red-400" size={20} />
                  <span className="font-semibold">{selectedExhibition.location}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    // Try to find the ID from various possible fields
                    const classId = selectedExhibition.id || selectedExhibition._id || selectedExhibition.exhibitionId;
                    console.log('📌 Selecting Class ID:', classId, 'from exhibition:', selectedExhibition);
                    setPrefilledClassId(classId);
                    setSelectedExhibition(null);
                    setShowEnrollForm(true);
                  }}
                  className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Register for This Exhibition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Form Modal */}
      <EnrollmentForm
        isOpen={showEnrollForm}
        onClose={() => setShowEnrollForm(false)}
        selectedClassId={prefilledClassId}
      />
    </div>
  );
};

export default ExhibitionsPage;
