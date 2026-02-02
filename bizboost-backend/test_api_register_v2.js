const startTest = async () => {
    const url = 'http://localhost:3001/api/auth/register';

    // Test 1: Using fullName (Scenario likely used by frontend)
    console.log('--- Test 1: Using "fullName" ---');
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `test_fullname_${Date.now()}@example.com`,
                password: 'password123',
                fullName: 'Test User Fullname'
            })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Response:', data);
    } catch (e) { console.error(e); }

    // Test 2: Using full_name 
    console.log('\n--- Test 2: Using "full_name" ---');
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `test_full_name_${Date.now()}@example.com`,
                password: 'password123',
                full_name: 'Test User full_name'
            })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Response:', data);
    } catch (e) { console.error(e); }
};

startTest();
