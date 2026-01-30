import ExhibitionsService from './exhibitionsService';
import ExhibitionsCategoryService from './exhibitionsCategoryService';
import { BASE_URL } from '../data/apiEndpoints';

/**
 * Test suite for Exhibitions API Integration
 * Tests both ExhibitionsService and ExhibitionsCategoryService
 */

// Mock fetch function for testing
global.fetch = jest.fn();

describe('ExhibitionsService', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  describe('getAllExhibitions', () => {
    test('should fetch all exhibitions successfully', async () => {
      const mockData = [
        {
          id: 1,
          title: 'Spring Colors 2025',
          category: 'watercolor',
          date: 'March 15-30, 2025',
          location: 'Main Gallery Hall',
          time: '10:00 AM - 6:00 PM',
          image: 'https://example.com/image.jpg',
          description: 'A vibrant collection of watercolor paintings',
          artists: 12,
          artworks: 45,
          featured: true,
          status: 'upcoming'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData })
      });

      const result = await ExhibitionsService.getAllExhibitions();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(result.message).toBe('Exhibitions fetched successfully');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should handle API error gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const result = await ExhibitionsService.getAllExhibitions();

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.error).toBeDefined();
    });

    test('should support query parameters', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      await ExhibitionsService.getAllExhibitions({ featured: true });

      const callUrl = fetch.mock.calls[0][0];
      expect(callUrl).toContain('featured=true');
    });
  });

  describe('getExhibitionById', () => {
    test('should fetch exhibition by ID successfully', async () => {
      const mockExhibition = {
        id: 1,
        title: 'Spring Colors 2025',
        category: 'watercolor'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockExhibition })
      });

      const result = await ExhibitionsService.getExhibitionById(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockExhibition);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should handle not found error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await ExhibitionsService.getExhibitionById(999);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
    });
  });

  describe('createExhibition', () => {
    test('should create exhibition successfully', async () => {
      const newExhibition = {
        title: 'New Exhibition',
        category: 'painting',
        date: 'April 1-30, 2025'
      };

      const createdExhibition = { id: 7, ...newExhibition };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: createdExhibition })
      });

      const result = await ExhibitionsService.createExhibition(newExhibition);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(7);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/art-exhibitions'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    test('should include authorization header', async () => {
      localStorage.setItem('token', 'test-token-123');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {} })
      });

      await ExhibitionsService.createExhibition({});

      const callHeaders = fetch.mock.calls[0][1].headers;
      expect(callHeaders.Authorization).toBe('Bearer test-token-123');
    });
  });

  describe('updateExhibition', () => {
    test('should update exhibition successfully', async () => {
      const updateData = { title: 'Updated Title' };
      const updatedExhibition = { id: 1, ...updateData };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: updatedExhibition })
      });

      const result = await ExhibitionsService.updateExhibition(1, updateData);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Updated Title');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/art-exhibitions/1'),
        expect.objectContaining({
          method: 'PUT'
        })
      );
    });
  });

  describe('deleteExhibition', () => {
    test('should delete exhibition successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      const result = await ExhibitionsService.deleteExhibition(1);

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/art-exhibitions/1'),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  describe('getExhibitionsByCategory', () => {
    test('should fetch exhibitions by category', async () => {
      const mockData = [
        {
          id: 1,
          title: 'Spring Colors 2025',
          category: 'watercolor'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData })
      });

      const result = await ExhibitionsService.getExhibitionsByCategory('watercolor');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });
  });

  describe('getFeaturedExhibitions', () => {
    test('should fetch featured exhibitions only', async () => {
      const mockData = [
        {
          id: 1,
          title: 'Spring Colors 2025',
          featured: true
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData })
      });

      const result = await ExhibitionsService.getFeaturedExhibitions();

      expect(result.success).toBe(true);
      const callUrl = fetch.mock.calls[0][0];
      expect(callUrl).toContain('featured=true');
    });
  });

  describe('getUpcomingExhibitions', () => {
    test('should fetch upcoming exhibitions', async () => {
      const mockData = [
        {
          id: 1,
          title: 'Spring Colors 2025',
          status: 'upcoming'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData })
      });

      const result = await ExhibitionsService.getUpcomingExhibitions();

      expect(result.success).toBe(true);
      const callUrl = fetch.mock.calls[0][0];
      expect(callUrl).toContain('status=upcoming');
    });
  });

  describe('getOngoingExhibitions', () => {
    test('should fetch ongoing exhibitions', async () => {
      const mockData = [
        {
          id: 2,
          title: 'Digital Dreams',
          status: 'ongoing'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData })
      });

      const result = await ExhibitionsService.getOngoingExhibitions();

      expect(result.success).toBe(true);
      const callUrl = fetch.mock.calls[0][0];
      expect(callUrl).toContain('status=ongoing');
    });
  });
});

describe('ExhibitionsCategoryService', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  describe('getRootCategories', () => {
    test('should fetch root categories successfully', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Painting',
          icon: '🖌️'
        },
        {
          id: 2,
          name: 'Drawing',
          icon: '✏️'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCategories })
      });

      const result = await ExhibitionsCategoryService.getRootCategories();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCategories);
      expect(result.message).toBe('Root categories fetched successfully');
    });

    test('should handle API error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const result = await ExhibitionsCategoryService.getRootCategories();

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
    });
  });

  describe('getCategoryById', () => {
    test('should fetch category by ID', async () => {
      const mockCategory = {
        id: 1,
        name: 'Painting',
        icon: '🖌️'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCategory })
      });

      const result = await ExhibitionsCategoryService.getCategoryById(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCategory);
    });
  });

  describe('createCategory', () => {
    test('should create category successfully', async () => {
      const newCategory = {
        name: 'Sculpture',
        icon: '🗿'
      };

      const createdCategory = { id: 3, ...newCategory };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: createdCategory })
      });

      const result = await ExhibitionsCategoryService.createCategory(newCategory);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(3);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/art-exhibitions-categories'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  describe('updateCategory', () => {
    test('should update category successfully', async () => {
      const updateData = { name: 'Digital Sculpture' };
      const updatedCategory = { id: 3, ...updateData };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: updatedCategory })
      });

      const result = await ExhibitionsCategoryService.updateCategory(3, updateData);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Digital Sculpture');
    });
  });

  describe('deleteCategory', () => {
    test('should delete category successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      const result = await ExhibitionsCategoryService.deleteCategory(3);

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/art-exhibitions-categories/3'),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });
});

/**
 * Integration Test
 * Test the combination of Exhibitions and Categories
 */
describe('Exhibitions Integration', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('should load exhibitions and filter by category', async () => {
    const mockExhibitions = [
      {
        id: 1,
        title: 'Spring Colors',
        category: 'watercolor'
      },
      {
        id: 2,
        title: 'Digital Dreams',
        category: 'digital'
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockExhibitions })
    });

    const result = await ExhibitionsService.getAllExhibitions();

    expect(result.success).toBe(true);
    expect(result.data.length).toBe(2);

    // Filter by category
    const watercolorExhibitions = result.data.filter(ex => ex.category === 'watercolor');
    expect(watercolorExhibitions.length).toBe(1);
    expect(watercolorExhibitions[0].title).toBe('Spring Colors');
  });

  test('should handle complete CRUD operations', async () => {
    // Create
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 10, title: 'New Exhibition' } })
    });

    let result = await ExhibitionsService.createExhibition({ title: 'New Exhibition' });
    expect(result.success).toBe(true);

    // Read
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 10, title: 'New Exhibition' } })
    });

    result = await ExhibitionsService.getExhibitionById(10);
    expect(result.success).toBe(true);

    // Update
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 10, title: 'Updated Exhibition' } })
    });

    result = await ExhibitionsService.updateExhibition(10, { title: 'Updated Exhibition' });
    expect(result.success).toBe(true);

    // Delete
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    result = await ExhibitionsService.deleteExhibition(10);
    expect(result.success).toBe(true);

    expect(fetch).toHaveBeenCalledTimes(4);
  });
});
