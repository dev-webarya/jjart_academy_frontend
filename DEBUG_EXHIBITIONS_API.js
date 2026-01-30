// Paste this entire code in your browser console while on ExhibitionsPage
// This will test if the API data is working correctly

console.log('🔍 DETAILED EXHIBITIONS API DEBUG SCRIPT');
console.log('═'.repeat(50));

async function debugExhibitionsAPI() {
  try {
    console.log('\n1️⃣  Testing API Direct Call...');
    console.log('   Endpoint: http://93.127.194.118:8095/api/v1/art-exhibitions');
    
    const apiUrl = 'http://93.127.194.118:8095/api/v1/art-exhibitions';
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    
    console.log(`   ✅ Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`   ❌ HTTP Error: ${response.status}`);
      return;
    }
    
    const rawData = await response.json();
    console.log('\n2️⃣  Raw API Response:');
    console.log('   ', rawData);
    
    console.log('\n3️⃣  Response Type Analysis:');
    console.log(`   - Is Array: ${Array.isArray(rawData)}`);
    console.log(`   - Type: ${typeof rawData}`);
    console.log(`   - Keys: ${Object.keys(rawData).join(', ')}`);
    
    console.log('\n4️⃣  Looking for data array...');
    let foundData = null;
    let foundWhere = null;
    
    if (Array.isArray(rawData)) {
      foundData = rawData;
      foundWhere = 'Direct Array';
    } else if (rawData.data && Array.isArray(rawData.data)) {
      foundData = rawData.data;
      foundWhere = 'rawData.data';
    } else if (rawData.exhibitions && Array.isArray(rawData.exhibitions)) {
      foundData = rawData.exhibitions;
      foundWhere = 'rawData.exhibitions';
    } else if (rawData.result && Array.isArray(rawData.result)) {
      foundData = rawData.result;
      foundWhere = 'rawData.result';
    } else if (rawData.content && Array.isArray(rawData.content)) {
      foundData = rawData.content;
      foundWhere = 'rawData.content';
    } else {
      console.warn('   ⚠️ Could not find data array in response!');
      console.warn('   Available properties:', Object.keys(rawData));
    }
    
    if (foundData) {
      console.log(`   ✅ Found ${foundData.length} items in: ${foundWhere}`);
      console.log(`   Sample item:`, foundData[0]);
    }
    
    console.log('\n5️⃣  Testing ExhibitionsService...');
    
    // Import the service (this assumes it's available globally)
    if (typeof ExhibitionsService !== 'undefined') {
      const serviceResult = await ExhibitionsService.getAllExhibitions();
      console.log('   Service Result:', serviceResult);
      console.log(`   - Success: ${serviceResult.success}`);
      console.log(`   - Data is Array: ${Array.isArray(serviceResult.data)}`);
      console.log(`   - Data Length: ${serviceResult.data?.length}`);
      console.log(`   - Message: ${serviceResult.message}`);
      
      if (Array.isArray(serviceResult.data) && serviceResult.data.length > 0) {
        console.log('   ✅ Service returning real data!');
      } else {
        console.warn('   ⚠️ Service not returning data properly');
      }
    } else {
      console.warn('   ⚠️ ExhibitionsService not found in window scope');
    }
    
    console.log('\n6️⃣  Checking component state...');
    // Check if exhibitions are displayed
    const exhibitionElements = document.querySelectorAll('[class*="exhibition"]');
    console.log(`   Found ${exhibitionElements.length} exhibition DOM elements`);
    
    // Check for mock data indicators
    const mockDataText = document.body.innerText;
    const hasMockData = mockDataText.includes('Modern Abstract Exhibition') || 
                       mockDataText.includes('Contemporary Art Showcase');
    console.log(`   Showing mock data: ${hasMockData}`);
    
    console.log('\n7️⃣  SUMMARY:');
    console.log('═'.repeat(50));
    if (foundData && foundData.length > 0) {
      console.log('✅ API is returning data');
    } else {
      console.log('❌ API not returning expected data format');
    }
    
    if (!hasMockData && foundData && foundData.length > 0) {
      console.log('✅ UI is showing real API data');
    } else {
      console.log('❌ UI is showing mock data (API data not being used)');
    }
    
  } catch (error) {
    console.error('❌ DEBUG ERROR:', error);
    console.error('Error Message:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the debug function
debugExhibitionsAPI();

// Also log what happens next
console.log('\n📋 Watching for changes...');
console.log('The page will update with the above information.');
