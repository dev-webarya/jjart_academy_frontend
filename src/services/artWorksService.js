/**
 * Art Works Service
 * Handles all art works and art works categories API calls
 */
import { BASE_URL, API_ENDPOINTS } from '../data/apiEndpoints';

class ArtWorksService {
    constructor() {
        this.baseURL = BASE_URL;
    }

    /**
     * Fetch all art works
     * GET /api/v1/art-works
     */
    async getAllArtWorks() {
        try {
            const url = `${this.baseURL}${API_ENDPOINTS.ART_WORKS.GET_ALL}`;
            console.log('📡 Fetching all art works from:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch art works: HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Art Works API response:', data);

            let artworks = [];
            if (Array.isArray(data)) {
                artworks = data;
            } else if (data.content && Array.isArray(data.content)) {
                artworks = data.content;
            } else if (data.data && Array.isArray(data.data)) {
                artworks = data.data;
            } else if (data.artWorks && Array.isArray(data.artWorks)) {
                artworks = data.artWorks;
            }

            // Map backend fields to frontend structure
            const mappedArtworks = artworks.map(item => ({
                id: item.id,
                title: item.name || item.title || 'Untitled',
                description: item.description || '',
                longDescription: item.description || '',
                artist: {
                    id: item.artistId || 'unknown',
                    name: item.artistName || 'Unknown Artist',
                    avatar: item.artistAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.artistName || 'Backend')}`
                },
                images: item.imageUrl ? [item.imageUrl] : (item.images || []),
                category: item.categoryName || item.category || 'Art',
                medium: item.medium || 'Mixed Media',
                price: item.price || (item.variants && item.variants.length > 0 ? item.variants[0].price : 0),
                sizeOptions: item.variants ? item.variants.map(v => ({
                    id: v.id || v.size, // Fallback if id missing
                    label: v.size,
                    price: v.price,
                    discountPrice: v.discountPrice,
                    stock: v.stock,
                    isDefault: false
                })) : [],
                isAvailable: item.active !== false, // Default to true if undefined, false if explicitly false
                createdAt: item.createdAt,
                likes: item.likes || 0,
                views: item.views || 0,
                features: ['Original Art', 'Certified'] // Mock features if not in backend
            }));

            return {
                success: true,
                data: mappedArtworks,
                message: 'Art works fetched successfully'
            };
        } catch (error) {
            console.error('❌ Error fetching art works:', error.message);
            return {
                success: false,
                message: error.message,
                error
            };
        }
    }

    /**
     * Fetch art work by ID
     * GET /api/v1/art-works/:id
     */
    async getArtWorkById(id) {
        try {
            const url = `${this.baseURL}${API_ENDPOINTS.ART_WORKS.GET_BY_ID(id)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch art work: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data || data,
                message: 'Art work fetched successfully'
            };
        } catch (error) {
            console.error(`❌ Error fetching art work ${id}:`, error);
            return {
                success: false,
                message: error.message,
                error
            };
        }
    }

    /**
     * Fetch all art works categories
     * GET /api/v1/art-works-categories
     */
    async getAllCategories() {
        try {
            const url = `${this.baseURL}${API_ENDPOINTS.ART_WORKS_CATEGORIES.GET_ALL}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.status}`);
            }

            const data = await response.json();
            let categories = [];
            if (Array.isArray(data)) {
                categories = data;
            } else if (data.content && Array.isArray(data.content)) {
                categories = data.content;
            } else if (data.data && Array.isArray(data.data)) {
                categories = data.data;
            }

            return {
                success: true,
                data: categories,
                message: 'Categories fetched successfully'
            };
        } catch (error) {
            console.error('❌ Error fetching categories:', error.message);
            return {
                success: false,
                message: error.message,
                error
            };
        }
    }
}

export default new ArtWorksService();
