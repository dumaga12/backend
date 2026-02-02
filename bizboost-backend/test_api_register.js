const startTest = async () => {
    const url = 'http://localhost:3001/api/auth/register';

    // Test 1: Missing name (Simulate what frontend might be doing wrong)
    console.log('--- Test 1: Missing Name ---');
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test_api_missing_name@example.com',
                password: 'password123'
            })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Response:', data);
    } catch (e) { console.error(e); }

    // Test 2: Full Valid Payload
    console.log('\n--- Test 2: Valid Payload ---');
    const validEmail = `test_api_${Date.now()}@example.com`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: validEmail,
                password: 'password123',
                name: 'Test API User'
            })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Response:', data);
    } catch (e) { console.error(e); }
};

startTest();
