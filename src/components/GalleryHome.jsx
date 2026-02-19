import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import galleryService from "../services/galleryService";

const GalleryHome = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedGallery = async () => {
            setLoading(true);
            try {
                const result = await galleryService.getAllGalleries();
                if (result.success) {
                    let data = result.data;
                    // Take only first 6 items for home page
                    setGalleries(data.slice(0, 6).map(g => galleryService.transformGalleryData(g)));
                }
            } catch (err) {
                console.error('Failed to load featured gallery:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedGallery();
    }, []);

    if (loading) return null; // Hide if loading for smoother home page experience
    if (galleries.length === 0) return null; // Hide section if no artworks exist

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="space-y-4">
                        <span className="text-purple-600 dark:text-purple-400 font-bold tracking-wider uppercase text-sm">
                            Student Masterpieces
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                            Our Little <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600">Artists'</span> Gallery
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
                            Check out the incredible artwork created by our talented students across various categories.
                        </p>
                    </div>
                    <Link
                        to="/gallery"
                        className="group flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all border border-purple-100 dark:border-gray-700 hover:border-purple-200"
                    >
                        View Full Gallery
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleries.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={item.imageUrl || item.src || item.image}
                                    alt={item.name || item.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400?text=Gallery+Image';
                                    }}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg text-gray-800 dark:text-gray-200 backdrop-blur-sm transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    {item.categoryName || item.category || 'Art'}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                    {item.name || item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                                    {item.description || 'A beautiful creation by our student.'}
                                </p>
                                {item.userName && (
                                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-3">
                                        🎨 By: {item.userName.split('@')[0]}
                                    </p>
                                )}
                                <Link
                                    to="/gallery"
                                    className="text-purple-600 dark:text-purple-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                                >
                                    Learn More <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GalleryHome;
