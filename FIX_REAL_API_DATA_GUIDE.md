# 🎨 Debugging Guide - Real API Data Not Showing

**Problem:** API data is not displaying in the UI, static mock data is being shown instead.

## Quick Fix Applied ✅

### 1. **Enhanced Service Response Handling**
   - Updated `exhibitionsService.js` to handle multiple API response formats:
     - Direct array: `[...]`
     - Nested object: `{ data: [...] }`
     - Alternative properties: `{ exhibitions: [...] }`, `{ result: [...] }`, `{ content: [...] }`
   - Added detailed console logging at each step

### 2. **Improved Component Error Checking**
   - Updated `ExhibitionsPage.jsx` to validate response data more thoroughly
   - Added detailed logging for debugging
   - Better fallback logic

## How to Test

### Step 1: Check Console Logs 🔍
1. Open the Exhibitions page in your browser
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. You should see detailed logs:
   ```
   📡 API Request URL: http://93.127.194.118:8095/api/v1/art-exhibitions
   🔄 Fetching exhibitions from API...
   📊 API Response Status: 200 OK
   ✅ Raw API Response: { ... }
   📋 Response format: [Array/Object/etc]
   ✅ Total exhibitions extracted: X
   ```

### Step 2: Use the Test Page 🧪
Open `TEST_REAL_API.html` in your browser and:
1. Click "Test GET All Exhibitions"
2. Look for the response details:
   - Status code should be `200`
   - Data count should be > 0
   - Response type should show the format (Array, Object with .data, etc.)

### Step 3: Check Network Tab 📡
1. Open Developer Tools → Network tab
2. Reload the page
3. Look for request to: `art-exhibitions`
4. Click it and check:
   - **Status**: Should be `200`
   - **Response**: Should show JSON data
   - **Headers**: Check that request is being sent correctly

## What the Code Checks Now

### In `exhibitionsService.js`:
```javascript
// Tries multiple response formats:
if (Array.isArray(data)) {
  exhibitions = data;  // Direct array
} else if (data.data && Array.isArray(data.data)) {
  exhibitions = data.data;  // { data: [...] }
} else if (data.exhibitions && Array.isArray(data.exhibitions)) {
  exhibitions = data.exhibitions;  // { exhibitions: [...] }
} else if (data.result && Array.isArray(data.result)) {
  exhibitions = data.result;  // { result: [...] }
} else if (data.content && Array.isArray(data.content)) {
  exhibitions = data.content;  // { content: [...] }
}
```

### In `ExhibitionsPage.jsx`:
- Checks if `result.data` is an array
- Checks if it has length > 0
- Logs what it receives at each step
- Falls back to mock data only if nothing works

## Common Issues & Solutions

### Issue 1: Still seeing mock data in console
**Solution:**
1. Check the console logs - what does "Raw API Response" show?
2. If you see error logs, check your API endpoint URL
3. Verify the API server is running at: http://93.127.194.118:8095

### Issue 2: API request fails in console
**Solution:**
1. Check if the API server is online
2. Verify CORS is enabled on the backend
3. Try the request directly in browser: http://93.127.194.118:8095/api/v1/art-exhibitions

### Issue 3: Response format is different
**Solution:**
1. Open `TEST_REAL_API.html`
2. Click "Test GET All Exhibitions"
3. Look at the "Full Response" section
4. Note the response structure
5. Update `exhibitionsService.js` to handle that specific format

## Files Modified

1. **`src/services/exhibitionsService.js`** (Line 10-55)
   - Enhanced response parsing
   - Better error handling
   - Detailed console logging

2. **`src/pages/ExhibitionsPage.jsx`** (Line 118-160)
   - Improved validation logic
   - More detailed logging
   - Better error messages

## Next Steps if Still Not Working

1. **Collect Debug Info:**
   ```javascript
   // Run in console on Exhibitions page
   ExhibitionsService.getAllExhibitions().then(r => {
     console.log('Result:', r);
     console.log('Is Array:', Array.isArray(r.data));
     console.log('Length:', r.data?.length);
   });
   ```

2. **Check API Directly:**
   - Use `TEST_REAL_API.html` page
   - Try different endpoints
   - Check response format

3. **Contact Backend Team:**
   - Share the "Raw API Response" from console
   - Confirm the expected response structure
   - Verify API is returning data

## Console Log Guide

| Icon | Meaning |
|------|---------|
| 📡 | Making API request |
| 🔄 | Loading/Processing |
| 📊 | Response status info |
| ✅ | Success - Real data loaded |
| ⚠️ | Warning - Using fallback |
| ❌ | Error - Something failed |
| 📋 | Response format info |

---

**Remember:** The console logs are your best friend for debugging! Always check them first.
