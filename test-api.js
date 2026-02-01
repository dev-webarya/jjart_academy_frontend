
const BASE_URL = "http://93.127.194.118:8095/api/v1";

async function testEndpoints() {
    console.log("Testing API Endpoints...");

    // Test Art Works
    try {
        console.log("\n--- ART WORKS ---");
        const res = await fetch(`${BASE_URL}/art-works`);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        const items = data.content || data;
        if (items.length > 0) {
            console.log(JSON.stringify(items[0], null, 2));
        } else {
            console.log("No Art Works found");
        }
    } catch (err) {
        console.error("Art Works Error:", err.message);
    }

    // Test Art Materials
    try {
        console.log("\n--- ART MATERIALS ---");
        const res = await fetch(`${BASE_URL}/art-materials`);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        const items = data.content || data;
        if (items.length > 0) {
            console.log(JSON.stringify(items[0], null, 2));
        } else {
            console.log("No Art Materials found");
        }
    } catch (err) {
        console.error("Art Materials Error:", err.message);
    }
}

testEndpoints();
