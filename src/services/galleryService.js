/**
 * Gallery Service
 * Handles all gallery-related API calls (GET endpoints)
 */
import { BASE_URL, API_ENDPOINTS } from '../data/apiEndpoints';
class GalleryService {
  constructor() {
    this.baseURL = BASE_URL;
  }
  /**
   * Fetch all galleries
   * GET /api/v1/art-galleries
   */
  async getAllGalleries() {
    try {
      const url = `${this.baseURL}${API_ENDPOINTS.ART_GALLERIES.GET_ALL}`;
      console.log('📡 Fetching from:', url);
      
      const response = await fetch(url);
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch galleries: HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Raw API response:', data);
      
      // Extract actual data from response - handles multiple formats
      let galleries = [];
      if (Array.isArray(data)) {
        galleries = data;
        console.log('📋 Response format: Direct Array');
      } else if (data.content && Array.isArray(data.content)) {
        galleries = data.content;
        console.log('📋 Response format: {content: Array}');
      } else if (data.data && Array.isArray(data.data)) {
        galleries = data.data;
        console.log('📋 Response format: {data: Array}');
      } else if (data.galleries && Array.isArray(data.galleries)) {
        galleries = data.galleries;
        console.log('📋 Response format: {galleries: Array}');
      }
      console.log('✅ Extracted galleries:', galleries);
      
      return {
        success: true,
        data: galleries,
        message: 'Galleries fetched successfully'
      };
    } catch (error) {
      console.error('❌ Error fetching galleries:', error.message);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Fetch gallery by ID
   * GET /api/v1/art-galleries/:id
   */
  async getGalleryById(id) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.ART_GALLERIES.GET_BY_ID(id)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Gallery ${id} fetched:`, data);
      return {
        success: true,
        data: data.data || data,
        message: 'Gallery fetched successfully'
      };
    } catch (error) {
      console.error(`❌ Error fetching gallery ${id}:`, error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }
  /**
   * Fetch all gallery categories
   * GET /api/v1/art-galleries-categories
   */
  async getAllGalleryCategories() {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.ART_GALLERIES_CATEGORIES.GET_ALL}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery categories: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Gallery categories fetched:', data);
      
      // Extract categories - handles multiple formats
      let categories = [];
      if (Array.isArray(data)) {
        categories = data;
      } else if (data.content && Array.isArray(data.content)) {
        categories = data.content;
      } else if (data.data && Array.isArray(data.data)) {
        categories = data.data;
      } else if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories;
      }
      
      return {
        success: true,
        data: categories,
        message: 'Gallery categories fetched successfully'
      };
    } catch (error) {
      console.error('❌ Error fetching gallery categories:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Fetch root gallery category
   * GET /api/v1/art-galleries-categories/root
   */
  async getRootGalleryCategory() {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.ART_GALLERIES_CATEGORIES.GET_ROOT}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch root gallery category: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Root gallery category fetched:', data);
      
      // Extract root category - handles multiple formats
      let category = data;
      if (data.data && typeof data.data === 'object') {
        category = data.data;
      } else if (data.content && typeof data.content === 'object') {
        category = data.content;
      }
      
      return {
        success: true,
        data: category,
        message: 'Root gallery category fetched successfully'
      };
    } catch (error) {
      console.error('❌ Error fetching root gallery category:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }
  /**
   * Fetch gallery category by ID
   * GET /api/v1/art-galleries-categories/:id
   */
  async getGalleryCategoryById(id) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.ART_GALLERIES_CATEGORIES.GET_BY_ID(id)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery category: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Gallery category ${id} fetched:`, data);
      return {
        success: true,
        data: data.data || data,
        message: 'Gallery category fetched successfully'
      };
    } catch (error) {
      console.error(`❌ Error fetching gallery category ${id}:`, error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Transform gallery data to match frontend format
   */
  transformGalleryData(gallery) {
    return {
      id: gallery.id || gallery._id,
      name: gallery.name || gallery.title,
      description: gallery.description,
      image: gallery.image || gallery.src || gallery.thumbnail,
      category: gallery.category || 'Art',
      artist: gallery.artist || gallery.createdBy || 'Unknown',
      src: gallery.image || gallery.src || gallery.thumbnail,
      title: gallery.name || gallery.title,
      ...gallery
    };
  }

  /**
   * Transform category data to match frontend format
   */
  transformCategoryData(category) {
    return {
      id: category.id || category._id,
      name: category.name,
      ...category
    };
  }
}

// Export singleton instance
export default new GalleryService();
