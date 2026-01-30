import { BASE_URL } from '../data/apiEndpoints';
import API_ENDPOINTS from '../data/apiEndpoints';

/**
 * Art Exhibitions Service
 * Handles all API calls related to art exhibitions
 */

class ExhibitionsService {
  // Get all exhibitions
  static async getAllExhibitions(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.GET_ALL}${queryString ? '?' + queryString : ''}`;
      
      console.log('📡 API Request URL:', url);
      console.log('🔄 Fetching exhibitions from API...');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      console.log('📊 API Response Status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Raw API Response:', data);
      
      // Handle different response formats
      let exhibitions = [];
      
      if (Array.isArray(data)) {
        // Response is directly an array
        exhibitions = data;
        console.log('📋 Response format: Array');
      } else if (data.data && Array.isArray(data.data)) {
        // Response has data property with array
        exhibitions = data.data;
        console.log('📋 Response format: {data: Array}');
      } else if (data.exhibitions && Array.isArray(data.exhibitions)) {
        // Response has exhibitions property
        exhibitions = data.exhibitions;
        console.log('📋 Response format: {exhibitions: Array}');
      } else if (data.result && Array.isArray(data.result)) {
        // Response has result property
        exhibitions = data.result;
        console.log('📋 Response format: {result: Array}');
      } else if (data.content && Array.isArray(data.content)) {
        // Response has content property
        exhibitions = data.content;
        console.log('📋 Response format: {content: Array}');
      }
      
      console.log(`✅ Total exhibitions extracted: ${exhibitions.length}`);
      console.log('🎨 First exhibition:', exhibitions[0]);
      
      if (!Array.isArray(exhibitions) || exhibitions.length === 0) {
        console.warn('⚠️ No exhibitions found in API response');
      }
      
      return {
        success: true,
        data: exhibitions,
        message: 'Exhibitions fetched successfully'
      };
    } catch (error) {
      console.error('❌ Error fetching exhibitions:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return {
        success: false,
        data: [],
        message: error.message,
        error
      };
    }
  }

  // Get exhibition by ID
  static async getExhibitionById(id) {
    try {
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.GET_BY_ID(id)}`;
      
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
        message: 'Exhibition fetched successfully'
      };
    } catch (error) {
      console.error(`Error fetching exhibition ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.message,
        error
      };
    }
  }

  // Create new exhibition
  static async createExhibition(exhibitionData) {
    try {
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.CREATE}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(exhibitionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Exhibition created successfully'
      };
    } catch (error) {
      console.error('Error creating exhibition:', error);
      return {
        success: false,
        data: null,
        message: error.message,
        error
      };
    }
  }

  // Update exhibition
  static async updateExhibition(id, exhibitionData) {
    try {
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.UPDATE(id)}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(exhibitionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Exhibition updated successfully'
      };
    } catch (error) {
      console.error(`Error updating exhibition ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.message,
        error
      };
    }
  }

  // Delete exhibition
  static async deleteExhibition(id) {
    try {
      const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.DELETE(id)}`;
      
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
        message: 'Exhibition deleted successfully'
      };
    } catch (error) {
      console.error(`Error deleting exhibition ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.message,
        error
      };
    }
  }

  // Get exhibitions by category
  static async getExhibitionsByCategory(categoryId) {
    try {
      const response = await this.getAllExhibitions({ categoryId });
      return response;
    } catch (error) {
      console.error('Error fetching exhibitions by category:', error);
      return {
        success: false,
        data: [],
        message: error.message,
        error
      };
    }
  }

  // Get featured exhibitions
  static async getFeaturedExhibitions() {
    try {
      const response = await this.getAllExhibitions({ featured: true });
      return response;
    } catch (error) {
      console.error('Error fetching featured exhibitions:', error);
      return {
        success: false,
        data: [],
        message: error.message,
        error
      };
    }
  }

  // Get upcoming exhibitions
  static async getUpcomingExhibitions() {
    try {
      const response = await this.getAllExhibitions({ status: 'upcoming' });
      return response;
    } catch (error) {
      console.error('Error fetching upcoming exhibitions:', error);
      return {
        success: false,
        data: [],
        message: error.message,
        error
      };
    }
  }

  // Get ongoing exhibitions
  static async getOngoingExhibitions() {
    try {
      const response = await this.getAllExhibitions({ status: 'ongoing' });
      return response;
    } catch (error) {
      console.error('Error fetching ongoing exhibitions:', error);
      return {
        success: false,
        data: [],
        message: error.message,
        error
      };
    }
  }
}

export default ExhibitionsService;
