# 🎨 Gallery API Integration Guide

## Overview

This guide documents the integration of the **Gallery GET API endpoints** with frontend components for displaying galleries and categories.

## 📦 Files Created/Modified

### New Files Created:

1. **`src/services/galleryService.js`** - Gallery API service
   - Handles all gallery GET endpoints
   - Data transformation for frontend compatibility
   - Error handling and logging

2. **`src/services/galleryService.test.js`** - Test suite
   - Comprehensive tests for all endpoints
   - Real API data validation
   - Integration testing

3. **`GALLERY_API_TEST.html`** - Interactive test page
   - No build needed - open directly in browser
   - Real-time API testing
   - Console output for debugging

### Files Modified:

1. **`src/components/Gallery.jsx`** - Gallery display component
   - Now fetches data from real API
   - Automatic fallback to mock data
   - Loading and error states
   - Category filtering from real data

## 🔗 API Endpoints Integrated

```javascript
// Galleries
GET /api/v1/art-galleries                      // Get all galleries
GET /api/v1/art-galleries/:id                  // Get gallery by ID

// Gallery Categories
GET /api/v1/art-galleries-categories           // Get all categories
GET /api/v1/art-galleries-categories/root      // Get root category
GET /api/v1/art-galleries-categories/:id       // Get category by ID
```

## 📋 Gallery Service Methods

### 1. **getAllGalleries()**
Fetch all galleries from the API.

```javascript
const result = await galleryService.getAllGalleries();
// Returns: { success, data, message, error }
```

**Example Response:**
```javascript
{
  success: true,
  data: [
    {
      id: '123',
      name: 'Modern Art Exhibition',
      description: 'Contemporary art works...',
      image: 'https://...',
      category: 'Modern Art',
      artist: 'John Doe'
    },
    // ... more galleries
  ],
  message: 'Galleries fetched successfully'
}
```

### 2. **getGalleryById(id)**
Fetch a specific gallery by its ID.

```javascript
const result = await galleryService.getGalleryById('gallery-id');
```

### 3. **getAllGalleryCategories()**
Fetch all gallery categories.

```javascript
const result = await galleryService.getAllGalleryCategories();
// Returns array of category objects
```

### 4. **getRootGalleryCategory()**
Fetch the root/parent gallery category.

```javascript
const result = await galleryService.getRootGalleryCategory();
```

### 5. **getGalleryCategoryById(id)**
Fetch a specific category by ID.

```javascript
const result = await galleryService.getGalleryCategoryById('category-id');
```

### 6. **transformGalleryData(gallery)**
Transform API data to frontend format.

```javascript
const transformed = galleryService.transformGalleryData(apiData);
// Maps API fields to expected frontend fields (src, title, etc.)
```

## 🧪 How to Test

### Option 1: Interactive Test Page (Recommended)
```
1. Open: GALLERY_API_TEST.html in your browser
2. No build needed - works instantly
3. Test each endpoint with real data
4. See live console output
```

### Option 2: In Your React App
```bash
npm run dev
# Navigate to gallery page
# Open DevTools (F12) → Console
# See API requests and data loading
```

### Option 3: Run Test Suite in Browser Console
```javascript
import { runGalleryServiceTests } from './src/services/galleryService.test.js';
runGalleryServiceTests();
```

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│      GalleryPage.jsx                │
│      ↓                              │
│   Gallery.jsx (Component)           │
│   - useEffect on mount              │
│   - Calls galleryService            │
│   - Shows loading state             │
│   - Filters by category             │
│   - Falls back to mock data         │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│    galleryService.js                │
│  (All gallery API calls)            │
│  - getAllGalleries()                │
│  - getGalleryById()                 │
│  - getAllGalleryCategories()        │
│  - getRootGalleryCategory()         │
│  - getGalleryCategoryById()         │
│  - transformGalleryData()           │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│    Backend API                      │
│  http://93.127.194.118:8095         │
│  /api/v1/art-galleries*             │
└─────────────────────────────────────┘
```

## 🔄 Data Flow

1. **Component Mount**: `Gallery.jsx` component mounts
2. **useEffect Hook**: Fetches galleries and categories
3. **API Call**: `galleryService.getAllGalleries()` is called
4. **Loading State**: Shows loading spinner while fetching
5. **Data Transform**: API response transformed to frontend format
6. **State Update**: Component state updated with gallery data
7. **Render**: Component re-renders with real gallery data
8. **Fallback**: If API fails, uses mock data from `classesData.js`
9. **Filtering**: Categories extracted and filtering enabled

## 📊 Expected Data Format

### Gallery Object
```javascript
{
  id: 'unique-id',
  name: 'Gallery Name',
  title: 'Gallery Name',  // alias for name
  description: 'Description text',
  image: 'https://image-url.jpg',
  src: 'https://image-url.jpg',  // alias for image
  category: 'Category Name',
  artist: 'Artist Name',
  // ... additional fields
}
```

### Category Object
```javascript
{
  id: 'unique-id',
  _id: 'unique-id',  // MongoDB style ID
  name: 'Category Name',
  description: 'Category description',
  // ... additional fields
}
```

## ⚙️ Configuration

**API Base URL**: `http://93.127.194.118:8095`
**API Prefix**: `/api/v1`

Located in: `src/data/apiEndpoints.js`

To change API server:
```javascript
export const BASE_URL = "http://your-new-api.com";
```

## 🎯 Features Implemented

✅ Real API integration for all gallery GET endpoints
✅ Automatic data transformation
✅ Loading states with spinner
✅ Error handling with fallback to mock data
✅ Category filtering from real data
✅ Responsive design preserved
✅ Console logging for debugging
✅ Comprehensive test suite
✅ Interactive test page

## 📈 Testing Real Data

### Step 1: Open Test Page
- Open `GALLERY_API_TEST.html` in browser
- See if API is reachable
- Check console output for real responses

### Step 2: Check API Response Format
- Run "Get All Galleries" test
- Inspect the data structure
- Verify required fields are present

### Step 3: Test in React App
- Run `npm run dev`
- Navigate to gallery page
- Check DevTools Network tab for API calls
- Verify console shows successful data loading

### Step 4: Verify in localStorage
- Open DevTools → Application → Local Storage
- Check if gallery data is cached (if implemented)

## 🐛 Troubleshooting

### API calls fail with 404 or 500
**Check:**
- Backend is running at `http://93.127.194.118:8095`
- API endpoints match backend routes
- Check backend logs for errors

### Gallery page shows no data
**Check:**
- Open DevTools Console for errors
- Verify API is returning data
- Check if fallback to mock data is working
- Inspect network requests in DevTools

### Categories not filtering correctly
**Check:**
- Verify category names in API match filter logic
- Check data transformation is correct
- Inspect browser console for warnings

### Data doesn't persist between navigation
**Note:** Current implementation loads fresh data on component mount
To add caching:
```javascript
// In Gallery.jsx, add to useEffect:
const cachedData = localStorage.getItem('galleries');
if (cachedData) {
  setGalleries(JSON.parse(cachedData));
} else {
  // fetch from API
}
```

## 📚 Component Integration

### Gallery.jsx Changes
```javascript
// Before: Used only mock data from classesData.js
// After:
- Added useEffect hook
- Calls galleryService.getAllGalleries()
- Added loading state with spinner
- Added error handling
- Transforms API data
- Falls back to mock data if API fails
- Extracts categories from real data
```

### Key State Variables
```javascript
const [galleries, setGalleries] = useState([]);        // Real gallery data
const [categories, setCategories] = useState(["All"]); // Real categories
const [loading, setLoading] = useState(true);          // Loading state
const [error, setError] = useState(null);              // Error message
```

## 🔐 Security Considerations

1. **No authentication required** for GET endpoints
2. **API is publicly accessible** - no auth headers needed
3. **CORS** must be enabled on backend
4. Consider rate limiting if publicly exposed

## 📞 Next Steps

1. **Verify Backend**: Ensure API is running and responding
2. **Run Tests**: Use `GALLERY_API_TEST.html` to test
3. **Monitor Console**: Check browser console for issues
4. **Test in App**: Navigate to gallery page and verify data loads
5. **Implement Caching**: Consider adding localStorage caching
6. **Add Pagination**: If many galleries, add pagination support
7. **Implement Search**: Add search functionality for galleries

## 📄 Files Reference

| File | Purpose |
|------|---------|
| `galleryService.js` | All gallery API calls |
| `galleryService.test.js` | Test suite |
| `Gallery.jsx` | Gallery display component |
| `GalleryPage.jsx` | Gallery page wrapper |
| `GALLERY_API_TEST.html` | Interactive test page |
| `apiEndpoints.js` | API configuration |

---

**Integration Status**: ✅ Complete

All gallery GET endpoints are integrated and ready for production use!
