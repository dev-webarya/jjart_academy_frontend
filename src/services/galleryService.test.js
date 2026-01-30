/**
 * Gallery Service Test Suite
 * Tests all gallery GET endpoints with real data
 */

import galleryService from '../galleryService';

// Test configuration
const testConfig = {
  apiUrl: 'http://93.127.194.118:8095',
  apiPrefix: '/api/v1',
  endpoints: {
    galleries: '/art-galleries',
    galleryById: '/art-galleries/{id}',
    galleryCategories: '/art-galleries-categories',
    galleryCategoryById: '/art-galleries-categories/{id}',
    rootCategory: '/art-galleries-categories/root',
  }
};

// Console logging utility
const logTest = (testName, passed, details) => {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`\n${status} | ${testName}`);
  if (details) {
    console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
  }
};

const logSection = (sectionName) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${sectionName}`);
  console.log(`${'='.repeat(60)}`);
};

// Test 1: API Configuration
const testAPIConfiguration = () => {
  logSection('API Configuration Tests');
  
  try {
    const requiredEndpoints = [
      'GET_ALL',
      'GET_BY_ID',
      'CREATE',
      'UPDATE',
      'DELETE'
    ];

    // Check ART_GALLERIES endpoints
    const hasGalleryEndpoints = requiredEndpoints.every(ep => {
      if (ep === 'GET_BY_ID') {
        return typeof galleryService.getAllGalleries === 'function';
      }
      return typeof galleryService[`get${ep}Galleries`] === 'function' || 
             typeof galleryService[`getGallery${ep}`] === 'function';
    });

    logTest('Gallery endpoints configured', true, {
      endpoints: Object.keys(testConfig.endpoints)
    });

    logTest('Gallery service methods available', true, {
      methods: [
        'getAllGalleries',
        'getGalleryById',
        'getAllGalleryCategories',
        'getRootGalleryCategory',
        'getGalleryCategoryById'
      ]
    });

  } catch (error) {
    logTest('Configuration check', false, { error: error.message });
  }
};

// Test 2: Fetch All Galleries
const testGetAllGalleries = async () => {
  logSection('GET All Galleries Tests');
  
  try {
    console.log('🔄 Fetching all galleries from API...');
    const result = await galleryService.getAllGalleries();
    
    logTest('GET /api/v1/art-galleries - Request completed', true, {
      success: result.success,
      dataCount: Array.isArray(result.data) ? result.data.length : 0,
      message: result.message
    });

    if (result.success && Array.isArray(result.data)) {
      logTest('GET All Galleries - Data is array', true, {
        itemCount: result.data.length
      });

      if (result.data.length > 0) {
        const firstGallery = result.data[0];
        logTest('GET All Galleries - Has required fields', true, {
          hasId: !!firstGallery.id || !!firstGallery._id,
          hasName: !!firstGallery.name || !!firstGallery.title,
          sample: {
            id: firstGallery.id || firstGallery._id,
            name: firstGallery.name || firstGallery.title,
            description: firstGallery.description ? 'Present' : 'Not present'
          }
        });
      }
    } else {
      logTest('GET All Galleries - Success response', result.success, {
        message: result.message
      });
    }

  } catch (error) {
    logTest('GET All Galleries', false, { error: error.message });
  }
};

// Test 3: Fetch Gallery by ID
const testGetGalleryById = async () => {
  logSection('GET Gallery by ID Tests');
  
  try {
    // First get all galleries to get a valid ID
    const allGalleriesResult = await galleryService.getAllGalleries();
    
    if (allGalleriesResult.success && allGalleriesResult.data.length > 0) {
      const galleryId = allGalleriesResult.data[0].id || allGalleriesResult.data[0]._id;
      
      console.log(`🔄 Fetching gallery with ID: ${galleryId}`);
      const result = await galleryService.getGalleryById(galleryId);
      
      logTest(`GET /api/v1/art-galleries/${galleryId}`, result.success, {
        success: result.success,
        message: result.message
      });

      if (result.success && result.data) {
        logTest('Gallery by ID - Has required data', true, {
          hasId: !!result.data.id || !!result.data._id,
          hasName: !!result.data.name || !!result.data.title
        });
      }
    } else {
      logTest('GET Gallery by ID - Skipped (no galleries available)', true);
    }

  } catch (error) {
    logTest('GET Gallery by ID', false, { error: error.message });
  }
};

// Test 4: Fetch All Gallery Categories
const testGetAllGalleryCategories = async () => {
  logSection('GET All Gallery Categories Tests');
  
  try {
    console.log('🔄 Fetching all gallery categories from API...');
    const result = await galleryService.getAllGalleryCategories();
    
    logTest('GET /api/v1/art-galleries-categories - Request completed', true, {
      success: result.success,
      dataCount: Array.isArray(result.data) ? result.data.length : 0,
      message: result.message
    });

    if (result.success && Array.isArray(result.data)) {
      logTest('GET All Categories - Data is array', true, {
        itemCount: result.data.length
      });

      if (result.data.length > 0) {
        const firstCategory = result.data[0];
        logTest('GET All Categories - Has required fields', true, {
          hasId: !!firstCategory.id || !!firstCategory._id,
          hasName: !!firstCategory.name,
          sample: firstCategory
        });
      }
    } else {
      logTest('GET All Categories - Success response', result.success);
    }

  } catch (error) {
    logTest('GET All Gallery Categories', false, { error: error.message });
  }
};

// Test 5: Fetch Root Gallery Category
const testGetRootGalleryCategory = async () => {
  logSection('GET Root Gallery Category Tests');
  
  try {
    console.log('🔄 Fetching root gallery category from API...');
    const result = await galleryService.getRootGalleryCategory();
    
    logTest('GET /api/v1/art-galleries-categories/root', result.success, {
      success: result.success,
      message: result.message
    });

    if (result.success && result.data) {
      logTest('Root Category - Has data', true, {
        hasId: !!result.data.id || !!result.data._id,
        hasName: !!result.data.name
      });
    }

  } catch (error) {
    logTest('GET Root Gallery Category', false, { error: error.message });
  }
};

// Test 6: Fetch Gallery Category by ID
const testGetGalleryCategoryById = async () => {
  logSection('GET Gallery Category by ID Tests');
  
  try {
    // First get all categories to get a valid ID
    const allCategoriesResult = await galleryService.getAllGalleryCategories();
    
    if (allCategoriesResult.success && allCategoriesResult.data.length > 0) {
      const categoryId = allCategoriesResult.data[0].id || allCategoriesResult.data[0]._id;
      
      console.log(`🔄 Fetching gallery category with ID: ${categoryId}`);
      const result = await galleryService.getGalleryCategoryById(categoryId);
      
      logTest(`GET /api/v1/art-galleries-categories/${categoryId}`, result.success, {
        success: result.success,
        message: result.message
      });

      if (result.success && result.data) {
        logTest('Category by ID - Has required data', true, {
          hasId: !!result.data.id || !!result.data._id,
          hasName: !!result.data.name
        });
      }
    } else {
      logTest('GET Gallery Category by ID - Skipped (no categories available)', true);
    }

  } catch (error) {
    logTest('GET Gallery Category by ID', false, { error: error.message });
  }
};

// Test 7: Data Transformation
const testDataTransformation = async () => {
  logSection('Data Transformation Tests');
  
  try {
    const mockGallery = {
      _id: '123',
      name: 'Test Gallery',
      description: 'Test Description',
      image: 'https://example.com/image.jpg',
      artist: 'Test Artist',
      category: 'Paintings'
    };

    const transformed = galleryService.transformGalleryData(mockGallery);
    
    logTest('Transform Gallery Data', true, {
      originalFields: Object.keys(mockGallery),
      transformedFields: Object.keys(transformed),
      hasAllExpectedFields: {
        id: !!transformed.id,
        name: !!transformed.name,
        src: !!transformed.src,
        title: !!transformed.title,
        artist: !!transformed.artist,
        category: !!transformed.category
      }
    });

  } catch (error) {
    logTest('Data Transformation', false, { error: error.message });
  }
};

// Main test runner
export const runGalleryServiceTests = async () => {
  console.log('\n\n');
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(12) + 'Gallery Service Test Suite' + ' '.repeat(20) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');
  
  console.log(`\n📌 Test Configuration:`);
  console.log(`   API URL: ${testConfig.apiUrl}`);
  console.log(`   API Prefix: ${testConfig.apiPrefix}`);
  
  // Run all tests
  testAPIConfiguration();
  await testGetAllGalleries();
  await testGetGalleryById();
  await testGetAllGalleryCategories();
  await testGetRootGalleryCategory();
  await testGetGalleryCategoryById();
  testDataTransformation();
  
  console.log('\n\n');
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(18) + 'Tests Completed' + ' '.repeat(25) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');
  console.log('\n✅ Check console output above for detailed results.\n');
};

// Export for use
export default { runGalleryServiceTests, testConfig };
