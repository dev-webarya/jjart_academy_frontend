import { BASE_URL } from '../data/apiEndpoints';
import API_ENDPOINTS from '../data/apiEndpoints';

/**
 * Art Exhibitions Categories Service
 * Handles all API calls related to art exhibition categories
 */

class ExhibitionsCategoryService {
  // Get all categories (root categories)
  static async getRootCategories(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS_CATEGORIES.GET_ROOT}${queryString ? '?' + queryString : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Root categories fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching root categories:', error);
      return {
        success: false,
        data: [],
        message: error.message,
        error
      };
    }
  }

  // Get category by ID
  static async getCategoryById(id) {
    try {
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS_CATEGORIES.GET_BY_ID(id)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Category fetched successfully'
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.message,
        error
      };
    }
  }

  // Create new category
  static async createCategory(categoryData) {
    try {
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS_CATEGORIES.CREATE}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Category created successfully'
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        data: null,
        message: error.message,
        error
      };
    }
  }

  // Update category
  static async updateCategory(id, categoryData) {
    try {
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS_CATEGORIES.UPDATE(id)}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Category updated successfully'
      };
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.message,
        error
      };
    }
  }

  // Delete category
  static async deleteCategory(id) {
    try {
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS_CATEGORIES.DELETE(id)}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: null,
        message: 'Category deleted successfully'
      };
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.message,
        error
      };
    }
  }
}

export default ExhibitionsCategoryService;
