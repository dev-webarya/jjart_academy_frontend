/**
 * Classes Service
 * Handles all art classes and art classes categories API calls
 */
import { BASE_URL, API_ENDPOINTS } from '../data/apiEndpoints';

class ClassesService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  /**
   * Fetch all art classes
   * GET /api/v1/art-classes
   */
  async getAllClasses() {
    try {
      const url = `${this.baseURL}${API_ENDPOINTS.ART_CLASSES.GET_ALL}`;
      console.log('📡 Fetching all classes from:', url);

      const response = await fetch(url);
      console.log('📊 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch classes: HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Raw API response:', data);

      // Extract actual data from response - handles multiple formats
      let classes = [];
      if (Array.isArray(data)) {
        classes = data;
        console.log('📋 Response format: Direct Array');
      } else if (data.content && Array.isArray(data.content)) {
        classes = data.content;
        console.log('📋 Response format: {content: Array}');
      } else if (data.data && Array.isArray(data.data)) {
        classes = data.data;
        console.log('📋 Response format: {data: Array}');
      } else if (data.classes && Array.isArray(data.classes)) {
        classes = data.classes;
        console.log('📋 Response format: {classes: Array}');
      } else if (data.artClasses && Array.isArray(data.artClasses)) {
        classes = data.artClasses;
        console.log('📋 Response format: {artClasses: Array}');
      }
      // Process and normalize classes
      const mappedClasses = classes.map(item => ({
        ...item,
        id: item.id,
        title: item.name || item.title || 'Untitled Class',
        price: Number(item.price) > 0 ? Number(item.price) :
          (Number(item.basePrice) > 0 ? Number(item.basePrice) :
            (Number(item.enrollmentFee) > 0 ? Number(item.enrollmentFee) : 0)),
        discountPrice: Number(item.discountPrice) > 0 ? Number(item.discountPrice) : null,
        category: item.categoryName || item.category || 'Art',
        proficiency: item.proficiency || item.level || 'Beginner'
      }));

      console.log('✅ Normalized classes:', mappedClasses);

      return {
        success: true,
        data: mappedClasses,
        message: 'Classes fetched successfully'
      };
    } catch (error) {
      console.error('❌ Error fetching classes:', error.message);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Fetch class by ID
   * GET /api/v1/art-classes/:id
   */
  async getClassById(id) {
    try {
      const url = `${this.baseURL}${API_ENDPOINTS.ART_CLASSES.GET_BY_ID(id)}`;
      console.log('📡 Fetching class by ID:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch class: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Class ${id} fetched:`, data);
      return {
        success: true,
        data: data.data || data,
        message: 'Class fetched successfully'
      };
    } catch (error) {
      console.error(`❌ Error fetching class ${id}:`, error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Fetch all art classes categories
   * GET /api/v1/art-classes-categories
   */
  async getAllCategories() {
    try {
      const url = `${this.baseURL}${API_ENDPOINTS.ART_CLASSES_CATEGORIES.GET_ALL}`;
      console.log('📡 Fetching all classes categories from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch classes categories: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Raw categories API response:', data);

      // Extract actual data from response - handles multiple formats
      let categories = [];
      if (Array.isArray(data)) {
        categories = data;
        console.log('📋 Response format: Direct Array');
      } else if (data.content && Array.isArray(data.content)) {
        categories = data.content;
        console.log('📋 Response format: {content: Array}');
      } else if (data.data && Array.isArray(data.data)) {
        categories = data.data;
        console.log('📋 Response format: {data: Array}');
      } else if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories;
        console.log('📋 Response format: {categories: Array}');
      }
      console.log('✅ Extracted categories:', categories);

      return {
        success: true,
        data: categories,
        message: 'Categories fetched successfully'
      };
    } catch (error) {
      console.error('❌ Error fetching classes categories:', error.message);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Fetch root classes categories (no parent)
   * GET /api/v1/art-classes-categories/root
   */
  async getRootCategories() {
    try {
      const url = `${this.baseURL}${API_ENDPOINTS.ART_CLASSES_CATEGORIES.GET_ROOT}`;
      console.log('📡 Fetching root categories from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch root categories: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Root categories fetched:', data);

      return {
        success: true,
        data: data.data || data,
        message: 'Root categories fetched successfully'
      };
    } catch (error) {
      console.error('❌ Error fetching root categories:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Fetch category by ID
   * GET /api/v1/art-classes-categories/:id
   */
  async getCategoryById(id) {
    try {
      const url = `${this.baseURL}${API_ENDPOINTS.ART_CLASSES_CATEGORIES.GET_BY_ID(id)}`;
      console.log('📡 Fetching category by ID:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch category: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Category ${id} fetched:`, data);

      return {
        success: true,
        data: data.data || data,
        message: 'Category fetched successfully'
      };
    } catch (error) {
      console.error(`❌ Error fetching category ${id}:`, error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Create new class (Admin)
   * POST /api/v1/art-classes
   */
  async createClass(classData) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.ART_CLASSES.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create class: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Class created successfully'
      };
    } catch (error) {
      console.error('❌ Error creating class:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Update class (Admin)
   * PUT /api/v1/art-classes/:id
   */
  async updateClass(id, classData) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.ART_CLASSES.UPDATE(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update class: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: 'Class updated successfully'
      };
    } catch (error) {
      console.error('❌ Error updating class:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Delete class (Admin)
   * DELETE /api/v1/art-classes/:id
   */
  async deleteClass(id) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.ART_CLASSES.DELETE(id)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete class: ${response.status}`);
      }

      return {
        success: true,
        message: 'Class deleted successfully'
      };
    } catch (error) {
      console.error('❌ Error deleting class:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }
}

export default new ClassesService();
