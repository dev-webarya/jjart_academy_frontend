# Art Classes API Integration - Quick Testing Guide

## 🚀 Quick Start

### Step 1: View the API Test Page
Open this file in your browser:
```
TEST_CLASSES_API.html
```

### Step 2: Run Tests
1. Click "Test Get All Classes" button
2. Click "Test Get All Categories" button
3. Click "Test Get Root Categories" button
4. Or click "Run All Tests" for complete test suite

### Step 3: View Results in Browser
The component automatically displays:
- Loading spinners during API calls
- Error messages if API fails
- Category filters populated from API
- All classes rendered in responsive grid

---

## 📊 Expected API Responses

### Get All Classes
```javascript
// Expected Response Format:
[
  {
    id: 1,
    title: "Drawing Class for Kids",
    category: "Drawing",
    level: "Beginner",
    price: "₹999",
    image: "https://...",
    description: "...",
    instructor: "Sarah Johnson",
    students: 234,
    duration: "8 weeks"
  },
  ...
]
```

### Get All Categories
```javascript
// Expected Response Format:
[
  {
    id: 1,
    name: "Drawing",
    title: "Drawing"
  },
  {
    id: 2,
    name: "Painting",
    title: "Painting"
  },
  ...
]
```

---

## 🔍 How to Verify Integration Works

### 1. **Check Console Logs**
- Open DevTools: `F12` or `Ctrl+Shift+I`
- Go to Console tab
- Look for blue/green logs with:
  - 🔄 Fetching messages
  - ✅ Success messages
  - Shows response status and data

### 2. **Check Network Tab**
- Open DevTools: `F12`
- Go to Network tab
- Look for these requests:
  - `/api/v1/art-classes` (GET)
  - `/api/v1/art-classes-categories` (GET)
- Status should be `200 OK`

### 3. **Check Rendered Data**
- Scroll to Classes section on homepage
- Should see:
  - ✅ Loading spinner (briefly)
  - ✅ Classes displayed in grid
  - ✅ Category dropdown populated from API
  - ✅ Skill level dropdown with options
  - ✅ Search working in real-time

### 4. **Check Error Handling**
- If API is down, you should see:
  - ✅ Error banner displayed
  - ✅ Fallback data shown
  - ✅ Component doesn't crash
  - ✅ Filters still work

---

## 🧪 Manual Testing Checklist

### Classes Loading
- [ ] Loading spinner appears when page loads
- [ ] Spinner disappears after ~2 seconds
- [ ] Classes appear in grid (4 columns on desktop)
- [ ] All class cards have images
- [ ] All class cards have prices
- [ ] All class cards have skill level badges

### Category Filter
- [ ] Category dropdown has "All" option
- [ ] Category dropdown has categories from API
- [ ] Selecting a category filters classes
- [ ] Selecting "All" shows all classes
- [ ] Filter works with search

### Skill Level Filter
- [ ] All 5 level options present
- [ ] Selecting level filters classes
- [ ] Works with category filter
- [ ] Works with search

### Search Function
- [ ] Type in search box filters classes
- [ ] Searches by title and description
- [ ] Works with category and level filters
- [ ] Real-time search (no delay)

### Responsive Design
- [ ] Mobile (1 column): classes display properly
- [ ] Tablet (2 columns): layout correct
- [ ] Desktop (3 columns): layout correct
- [ ] Large screen (4 columns): layout correct
- [ ] All text readable on all sizes

### Buttons & Interactions
- [ ] "Enroll Now" button is clickable
- [ ] Hover effects work smoothly
- [ ] Buttons are accessible (keyboard)
- [ ] Cursor changes to pointer on hover

### Error Scenarios
- [ ] If API down: error banner shows
- [ ] If API down: fallback data displays
- [ ] Clear error message displayed
- [ ] Can still interact with filters

---

## 🔌 API Endpoints Being Called

```
GET http://93.127.194.118:8095/api/v1/art-classes
GET http://93.127.194.118:8095/api/v1/art-classes-categories
```

### Status Codes Expected
- **200 OK** - Successful request
- **400 Bad Request** - Invalid parameters
- **401 Unauthorized** - Need authentication
- **404 Not Found** - Endpoint doesn't exist
- **500 Server Error** - API error

---

## 📝 Testing Results Log

| Test | Status | Notes |
|------|--------|-------|
| Get All Classes | ✅/❌ | |
| Get Categories | ✅/❌ | |
| Rendering | ✅/❌ | |
| Filters | ✅/❌ | |
| Search | ✅/❌ | |
| Mobile | ✅/❌ | |
| Error Handling | ✅/❌ | |

---

## 🛠️ Troubleshooting

### Issue: Classes not loading
**Check:**
1. Is API server running? `http://93.127.194.118:8095`
2. Check browser console for errors (F12)
3. Check Network tab (F12) for failed requests
4. Check if fallback data is showing

### Issue: Categories dropdown empty
**Check:**
1. Console should show "Categories fetched"
2. Verify API returns categories with `name` field
3. Check if API response has data in `content`, `data`, or direct array

### Issue: Classes show but images broken
**Check:**
1. Image URLs in API response are valid
2. Component has fallback image enabled
3. Check CORS settings if images from external CDN

### Issue: Search not working
**Check:**
1. Classes loaded successfully
2. Type slowly to see real-time filtering
3. Check console for any JavaScript errors

---

## 📞 Support

If integration fails:
1. Check API server status
2. Review console logs (F12 → Console)
3. Verify API endpoints return valid JSON
4. Check response format matches expected structure

---

## 📂 Files Involved

| File | Purpose |
|------|---------|
| `src/services/classesService.js` | API calls |
| `src/components/Classes.jsx` | UI component |
| `src/data/apiEndpoints.js` | API configuration |
| `TEST_CLASSES_API.html` | Testing page |

---

**Status:** 🟢 Ready for Production Testing
