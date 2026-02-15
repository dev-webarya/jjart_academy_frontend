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

            // Extract the content array from paginated response
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

            console.log('🎨 Extracted artworks array:', artworks);

            // Map backend isActive to frontend isAvailable for consistency
            const processedArtworks = artworks.map(artwork => ({
                ...artwork,
                isAvailable: artwork.isActive !== false // default to true if not present
            }));

            // Return processed API data
            // Component will use: imageUrl, name, categoryName, artistName, basePrice, discountPrice, artMedium, size, isAvailable
            return {
                success: true,
                data: processedArtworks,
                message: 'Art works fetched successfully'
            };
        } catch (error) {
            console.error('❌ Error fetching art works:', error.message);
            return {
                success: false,
                message: error.message,
                data: [],
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
