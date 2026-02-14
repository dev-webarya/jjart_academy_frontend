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
   * Get authentication headers with JWT token
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  /**
   * Create a new gallery item (Student upload)
   * POST /api/v1/art-galleries
   * @param {Object} galleryData - Gallery data matching ArtGalleryRequestDto
   * @param {string} galleryData.title - Title of the gallery item (required)
   * @param {string} galleryData.description - Description
   * @param {string} galleryData.artistName - Artist name
   * @param {string} galleryData.medium - Art medium
   * @param {string} galleryData.imageUrl - Image URL or base64 data
   * @param {string} galleryData.categoryId - Category ID  
   * @param {string[]} galleryData.tags - Tags array
   */
  async createGalleryItem(galleryData) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.ART_GALLERIES.CREATE}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(galleryData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create gallery item: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Gallery item created:', data);
      return {
        success: true,
        data: data,
        message: 'Gallery item created successfully'
      };
    } catch (error) {
      console.error('❌ Error creating gallery item:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Get current user's gallery items (for students to see their uploads)
   * GET /api/v1/art-galleries/my
   */
  async getMyGalleryItems() {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.ART_GALLERIES.MY}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch gallery items: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ My gallery items fetched:', data);

      // Extract galleries - handles multiple formats
      let galleries = [];
      if (Array.isArray(data)) {
        galleries = data;
      } else if (data.content && Array.isArray(data.content)) {
        galleries = data.content;
      } else if (data.data && Array.isArray(data.data)) {
        galleries = data.data;
      }

      return {
        success: true,
        data: galleries,
        message: 'Gallery items fetched successfully'
      };
    } catch (error) {
      console.error('❌ Error fetching gallery items:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
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
    // Handle imageUrl from backend response
    const imageSource = gallery.imageUrl || gallery.image || gallery.src || gallery.thumbnail;
    return {
      id: gallery.id || gallery._id,
      name: gallery.name || gallery.title,
      description: gallery.description,
      image: imageSource,
      imageUrl: imageSource,
      category: gallery.categoryName || gallery.category || 'Art',
      categoryName: gallery.categoryName || gallery.category,
      artist: gallery.userName || gallery.artist || gallery.createdBy || 'Unknown',
      src: imageSource,
      title: gallery.name || gallery.title,
      createdAt: gallery.createdAt,
      status: gallery.status,
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
