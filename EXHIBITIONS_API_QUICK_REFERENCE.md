# 🎨 Art Exhibitions API - Quick Reference

## ✅ Integration Complete

All Art Exhibitions API endpoints have been integrated with the frontend and tested.

---

## 📦 What Was Created

### 1. Services
- ✅ `src/services/exhibitionsService.js` - Exhibitions API methods
- ✅ `src/services/exhibitionsCategoryService.js` - Categories API methods

### 2. Components
- ✅ Updated `src/pages/ExhibitionsPage.jsx` - Real API integration

### 3. Tests
- ✅ `src/services/exhibitionsService.test.js` - Comprehensive test suite
- ✅ `EXHIBITIONS_API_TEST.html` - Interactive web testing interface

### 4. Documentation
- ✅ `EXHIBITIONS_API_INTEGRATION.md` - Complete integration guide

---

## 🚀 Quick Usage

### Import Service
```javascript
import ExhibitionsService from '../services/exhibitionsService';
import ExhibitionsCategoryService from '../services/exhibitionsCategoryService';
```

### Get All Exhibitions
```javascript
const result = await ExhibitionsService.getAllExhibitions();
// result = { success: true, data: [...], message: "..." }
```

### Get Specific Exhibition
```javascript
const result = await ExhibitionsService.getExhibitionById(1);
```

### Filter by Category
```javascript
const result = await ExhibitionsService.getExhibitionsByCategory('watercolor');
```

### Get Featured Only
```javascript
const result = await ExhibitionsService.getFeaturedExhibitions();
```

### Get by Status
```javascript
const upcoming = await ExhibitionsService.getUpcomingExhibitions();
const ongoing = await ExhibitionsService.getOngoingExhibitions();
```

### Get Categories
```javascript
const result = await ExhibitionsCategoryService.getRootCategories();
```

---

## 📋 API Endpoints

| Method | Endpoint | Service Method |
|--------|----------|-----------------|
| GET | `/api/v1/art-exhibitions` | `getAllExhibitions()` |
| POST | `/api/v1/art-exhibitions` | `createExhibition(data)` |
| GET | `/api/v1/art-exhibitions/{id}` | `getExhibitionById(id)` |
| PUT | `/api/v1/art-exhibitions/{id}` | `updateExhibition(id, data)` |
| DELETE | `/api/v1/art-exhibitions/{id}` | `deleteExhibition(id)` |
| GET | `/api/v1/art-exhibitions-categories/root` | `getRootCategories()` |
| POST | `/api/v1/art-exhibitions-categories` | `createCategory(data)` |
| GET | `/api/v1/art-exhibitions-categories/{id}` | `getCategoryById(id)` |
| PUT | `/api/v1/art-exhibitions-categories/{id}` | `updateCategory(id, data)` |
| DELETE | `/api/v1/art-exhibitions-categories/{id}` | `deleteCategory(id)` |

---

## 🧪 Testing

### Web Interface Test
1. Open `EXHIBITIONS_API_TEST.html` in browser
2. Click test buttons
3. View real-time API responses
4. Download logs if needed

### Automated Tests
```bash
npm test -- exhibitionsService.test.js
```

### Response Format
```javascript
{
  success: true,
  data: [...],
  message: "Exhibitions fetched successfully",
  error: null
}
```

---

## 🛡️ Features

✅ **Error Handling** - Graceful fallback to mock data  
✅ **Loading States** - Proper loading indicators  
✅ **Authentication** - Token-based auth support  
✅ **Query Parameters** - Filter and search support  
✅ **Type Safety** - Consistent response format  
✅ **Automatic Retry** - Error recovery mechanism  

---

## 📊 Data Example

```javascript
{
  id: 1,
  title: "Spring Colors 2025",
  category: "watercolor",
  date: "March 15-30, 2025",
  location: "Main Gallery Hall",
  time: "10:00 AM - 6:00 PM",
  image: "https://...",
  description: "A vibrant collection...",
  artists: 12,
  artworks: 45,
  featured: true,
  status: "upcoming"
}
```

---

## 🔗 Related Files

- API Config: `src/data/apiEndpoints.js`
- Services: `src/services/exhibitionsService.js`
- Page: `src/pages/ExhibitionsPage.jsx`
- Tests: `src/services/exhibitionsService.test.js`
- Web Test: `EXHIBITIONS_API_TEST.html`
- Guide: `EXHIBITIONS_API_INTEGRATION.md`

---

## ⚡ In React Components

```javascript
import { useState, useEffect } from 'react';
import ExhibitionsService from '../services/exhibitionsService';

function MyComponent() {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const result = await ExhibitionsService.getAllExhibitions();
      if (result.success) {
        setExhibitions(result.data);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {exhibitions.map(ex => (
        <div key={ex.id}>{ex.title}</div>
      ))}
    </div>
  );
}

export default MyComponent;
```

---

## 🔐 Authentication

Automatically handled! Token is:
- Stored in localStorage after login
- Included in all API requests
- Used for authorization headers

```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

---

## 📱 Query Examples

```javascript
// Featured exhibitions
/api/v1/art-exhibitions?featured=true

// By category
/api/v1/art-exhibitions?category=watercolor

// By status
/api/v1/art-exhibitions?status=upcoming

// Multiple filters
/api/v1/art-exhibitions?featured=true&status=ongoing&category=painting
```

---

## ❌ Error Handling

All methods return consistent format:

```javascript
// Success
{
  success: true,
  data: [...],
  message: "Success message"
}

// Error
{
  success: false,
  data: null,
  message: "Error message",
  error: Error object
}
```

---

## 📞 Support

For issues:
1. Check `EXHIBITIONS_API_INTEGRATION.md` for details
2. Run `EXHIBITIONS_API_TEST.html` to debug API
3. Check browser console for errors
4. Review test file for examples

---

**Status:** ✅ Ready to Use  
**Last Updated:** January 29, 2026  
**API Server:** http://93.127.194.118:8095
