/**
 * Art Materials Service
 * Handles all art materials and art materials categories API calls
 */
import { BASE_URL, API_ENDPOINTS } from '../data/apiEndpoints';

class ArtMaterialsService {
    constructor() {
        this.baseURL = BASE_URL;
    }

    /**
     * Fetch all art materials
     * GET /api/v1/art-materials
     */
    async getAllMaterials() {
        try {
            const url = `${this.baseURL}${API_ENDPOINTS.ART_MATERIALS.GET_ALL}`;
            console.log('📡 Fetching all art materials from:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch art materials: HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Art Materials API response:', data);

            // Extract the content array from paginated response
            let materials = [];
            if (Array.isArray(data)) {
                materials = data;
            } else if (data.content && Array.isArray(data.content)) {
                materials = data.content;
            } else if (data.data && Array.isArray(data.data)) {
                materials = data.data;
            } else if (data.artMaterials && Array.isArray(data.artMaterials)) {
                materials = data.artMaterials;
            }

            console.log('📦 Extracted materials array:', materials);

            // Return raw API data without transformation
            // Component will use: imageUrl, categoryName, basePrice, discount, variants
            return {
                success: true,
                data: materials,
                message: 'Art materials fetched successfully'
            };
        } catch (error) {
            console.error('❌ Error fetching art materials:', error.message);
            return {
                success: false,
                message: error.message,
                data: [],
                error
            };
        }
    }

    /**
     * Fetch art material by ID
     * GET /api/v1/art-materials/:id
     */
    async getMaterialById(id) {
        try {
            const url = `${this.baseURL}${API_ENDPOINTS.ART_MATERIALS.GET_BY_ID(id)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch art material: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data || data,
                message: 'Art material fetched successfully'
            };
        } catch (error) {
            console.error(`❌ Error fetching art material ${id}:`, error);
            return {
                success: false,
                message: error.message,
                error
            };
        }
    }

    /**
     * Fetch all art materials categories
     * GET /api/v1/art-materials-categories
     */
    async getAllCategories() {
        try {
            const url = `${this.baseURL}${API_ENDPOINTS.ART_MATERIALS_CATEGORIES.GET_ALL}`;
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

export default new ArtMaterialsService();
