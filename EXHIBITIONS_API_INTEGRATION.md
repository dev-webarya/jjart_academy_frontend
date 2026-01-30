# Art Exhibitions API Integration Guide

## Overview
This document explains the complete integration of Art Exhibitions API endpoints with the frontend application.

**Status:** ✅ COMPLETE
**Date:** January 29, 2026
**API Server:** http://93.127.194.118:8095

---

## API Endpoints

### Base Configuration
```
Base URL: http://93.127.194.118:8095
API Prefix: /api/v1
```

### Art Exhibitions Endpoints
```
GET    /api/v1/art-exhibitions              - Get all exhibitions
POST   /api/v1/art-exhibitions              - Create new exhibition
GET    /api/v1/art-exhibitions/{id}         - Get exhibition by ID
PUT    /api/v1/art-exhibitions/{id}         - Update exhibition
DELETE /api/v1/art-exhibitions/{id}         - Delete exhibition
```

### Art Exhibitions Categories Endpoints
```
GET    /api/v1/art-exhibitions-categories/root           - Get root categories
POST   /api/v1/art-exhibitions-categories               - Create category
GET    /api/v1/art-exhibitions-categories/{id}          - Get category by ID
PUT    /api/v1/art-exhibitions-categories/{id}          - Update category
DELETE /api/v1/art-exhibitions-categories/{id}          - Delete category
```

---

## Implementation Files

### 1. API Endpoints Configuration
**File:** `src/data/apiEndpoints.js`

```javascript
// Art Exhibitions
ART_EXHIBITIONS: {
  GET_ALL: `${API_PREFIX}/art-exhibitions`,
  CREATE: `${API_PREFIX}/art-exhibitions`,
  GET_BY_ID: (id) => `${API_PREFIX}/art-exhibitions/${id}`,
  UPDATE: (id) => `${API_PREFIX}/art-exhibitions/${id}`,
  DELETE: (id) => `${API_PREFIX}/art-exhibitions/${id}`,
},

// Art Exhibitions Categories
ART_EXHIBITIONS_CATEGORIES: {
  CREATE: `${API_PREFIX}/art-exhibitions-categories`,
  GET_ROOT: `${API_PREFIX}/art-exhibitions-categories/root`,
  GET_BY_ID: (id) => `${API_PREFIX}/art-exhibitions-categories/${id}`,
  UPDATE: (id) => `${API_PREFIX}/art-exhibitions-categories/${id}`,
  DELETE: (id) => `${API_PREFIX}/art-exhibitions-categories/${id}`,
},
```

### 2. Exhibitions Service
**File:** `src/services/exhibitionsService.js`

Provides comprehensive API methods:
- `getAllExhibitions(params)` - Fetch all exhibitions with optional filters
- `getExhibitionById(id)` - Get specific exhibition
- `createExhibition(data)` - Create new exhibition
- `updateExhibition(id, data)` - Update exhibition
- `deleteExhibition(id)` - Delete exhibition
- `getExhibitionsByCategory(categoryId)` - Filter by category
- `getFeaturedExhibitions()` - Get featured only
- `getUpcomingExhibitions()` - Get upcoming exhibitions
- `getOngoingExhibitions()` - Get ongoing exhibitions

#### Example Usage
```javascript
import ExhibitionsService from '../services/exhibitionsService';

// Get all exhibitions
const result = await ExhibitionsService.getAllExhibitions();
if (result.success) {
  console.log('Exhibitions:', result.data);
}

// Get by category
const watercolors = await ExhibitionsService.getExhibitionsByCategory('watercolor');

// Get featured
const featured = await ExhibitionsService.getFeaturedExhibitions();
```

### 3. Categories Service
**File:** `src/services/exhibitionsCategoryService.js`

Provides category management:
- `getRootCategories(params)` - Get all root categories
- `getCategoryById(id)` - Get specific category
- `createCategory(data)` - Create new category
- `updateCategory(id, data)` - Update category
- `deleteCategory(id)` - Delete category

#### Example Usage
```javascript
import ExhibitionsCategoryService from '../services/exhibitionsCategoryService';

// Get root categories
const result = await ExhibitionsCategoryService.getRootCategories();
if (result.success) {
  console.log('Categories:', result.data);
}
```

### 4. Exhibitions Page Component
**File:** `src/pages/ExhibitionsPage.jsx`

Updated to use real API data with:
- Loading state management
- Error handling with fallback data
- Real API integration
- Category filtering
- Data transformation for UI compatibility

#### Features
- Automatic loading of exhibitions on component mount
- Error states with fallback to mock data
- Real-time category filtering
- Status badges for upcoming/ongoing exhibitions
- Featured exhibition highlighting

---

## Data Response Format

### Exhibition Object
```json
{
  "id": 1,
  "title": "Spring Colors 2025",
  "category": "watercolor",
  "date": "March 15-30, 2025",
  "location": "Main Gallery Hall",
  "time": "10:00 AM - 6:00 PM",
  "image": "https://example.com/image.jpg",
  "description": "A vibrant collection of watercolor paintings",
  "artists": 12,
  "artworks": 45,
  "featured": true,
  "status": "upcoming"
}
```

### Category Object
```json
{
  "id": 1,
  "name": "Watercolor",
  "icon": "💧",
  "description": "Watercolor paintings and techniques"
}
```

### API Response Format
```json
{
  "success": true,
  "data": [...],
  "message": "Exhibitions fetched successfully"
}
```

---

## Testing

### Automated Tests
**File:** `src/services/exhibitionsService.test.js`

Comprehensive test suite covering:
- ✅ getAllExhibitions() - Fetch and error handling
- ✅ getExhibitionById() - Get by ID and 404 handling
- ✅ createExhibition() - Create with authorization
- ✅ updateExhibition() - Update operations
- ✅ deleteExhibition() - Delete operations
- ✅ getExhibitionsByCategory() - Category filtering
- ✅ getFeaturedExhibitions() - Featured filtering
- ✅ getUpcomingExhibitions() - Status filtering
- ✅ getOngoingExhibitions() - Status filtering
- ✅ Categories CRUD operations
- ✅ Integration tests with complete workflow

#### Run Tests
```bash
npm test -- exhibitionsService.test.js
```

### Manual Testing
**File:** `EXHIBITIONS_API_TEST.html`

Interactive web interface to test all endpoints:
1. Open `EXHIBITIONS_API_TEST.html` in browser
2. Click on test buttons to run individual endpoint tests
3. View real-time API responses in console
4. Download test logs for documentation

#### Available Tests
- 📋 Get All Exhibitions
- 🎯 Get by Category
- ⭐ Get Featured
- 📂 Get Root Categories
- 🔍 Get by ID
- ⏰ Get Upcoming
- 🔴 Get Ongoing
- ➕ Create (requires token)

---

## Error Handling

All services include error handling with structured responses:

```javascript
{
  success: false,
  data: null,
  message: "Error message",
  error: Error object
}
```

### Fallback Strategy
If API is unavailable, ExhibitionsPage automatically uses mock data:
```javascript
if (result.success && result.data && result.data.length > 0) {
  setExhibitions(result.data);
} else {
  // Use fallback mock data
  setExhibitions(exhibitionDataFallback);
}
```

---

## Authentication

All API requests include authentication headers when available:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
}
```

To authenticate:
1. Login through StudentLogin/AdminLogin
2. Token is automatically stored in localStorage
3. All subsequent API calls include the token

---

## Query Parameters

Support for filtering with query parameters:

```javascript
// Get featured exhibitions
await ExhibitionsService.getAllExhibitions({ featured: true });

// Get by category
await ExhibitionsService.getAllExhibitions({ category: 'watercolor' });

// Get by status
await ExhibitionsService.getAllExhibitions({ status: 'upcoming' });

// Multiple filters
await ExhibitionsService.getAllExhibitions({ 
  featured: true, 
  status: 'upcoming'
});
```

---

## Performance Optimization

1. **Caching**: Consider implementing response caching for frequently accessed data
2. **Pagination**: Add pagination support for large datasets
3. **Lazy Loading**: Load categories on demand
4. **Error Recovery**: Automatic retry on network failures

---

## Future Enhancements

1. Add WebSocket support for real-time updates
2. Implement caching strategy with cache invalidation
3. Add pagination for large exhibition lists
4. Support for image uploads during creation
5. Add search functionality across exhibitions
6. Implement batch operations for admin panel

---

## Troubleshooting

### API Connection Issues
- Check base URL: `http://93.127.194.118:8095`
- Verify network connectivity
- Check browser console for CORS errors

### Authentication Errors
- Ensure valid token in localStorage
- Clear cache and re-login if needed
- Check token expiration

### Data Not Displaying
- Check API response format
- Verify data transformation in component
- Check browser DevTools Network tab

### Empty Results
- Check query parameters
- Verify data exists on backend
- Check API logs for errors

---

## Related Files

- Configuration: `src/data/apiEndpoints.js`
- Services: `src/services/exhibitionsService.js`, `src/services/exhibitionsCategoryService.js`
- Components: `src/pages/ExhibitionsPage.jsx`, `src/components/ExhibitionApplicationPopup.jsx`
- Tests: `src/services/exhibitionsService.test.js`
- Test UI: `EXHIBITIONS_API_TEST.html`

---

## Quick Start

1. **Access API Endpoints**
   ```javascript
   import API_ENDPOINTS from '../data/apiEndpoints';
   const url = `${BASE_URL}${API_ENDPOINTS.ART_EXHIBITIONS.GET_ALL}`;
   ```

2. **Use Service Methods**
   ```javascript
   import ExhibitionsService from '../services/exhibitionsService';
   const result = await ExhibitionsService.getAllExhibitions();
   ```

3. **In React Components**
   ```javascript
   useEffect(() => {
     const fetchData = async () => {
       const result = await ExhibitionsService.getAllExhibitions();
       setExhibitions(result.data);
     };
     fetchData();
   }, []);
   ```

---

## Support

For issues or questions:
1. Check this guide
2. Review test files for examples
3. Open `EXHIBITIONS_API_TEST.html` to debug API responses
4. Check browser console for error messages

---

**Last Updated:** January 29, 2026
**Status:** ✅ Production Ready
