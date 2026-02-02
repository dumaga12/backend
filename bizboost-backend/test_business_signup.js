const startTest = async () => {
    // 1. Register a new user
    const registerUrl = 'http://localhost:3001/api/auth/register';
    const email = `biz_test_${Date.now()}@example.com`;
    let token = '';

    console.log('--- Step 1: Register User ---');
    try {
        const res = await fetch(registerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password: 'password123',
                name: 'Future Business Owner'
            })
        });
        const data = await res.json();
        console.log('Register Status:', res.status);
        console.log('Role initially:', data.user.role); // Should be 'customer'

        // Login to get token (though usually register returns it, let's assume we need to login or use whatever register returend)
        // Wait, auth.controller.login returns token. register returns { user }. 
        // We need to login to get the token.
    } catch (e) { console.error(e); return; }

    console.log('\n--- Step 2: Login to get Token ---');
    try {
        const loginUrl = 'http://localhost:3001/api/auth/login';
        const res = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'password123' })
        });
        const data = await res.json();
        token = data.token;
        console.log('Login Status:', res.status);
        if (!token) throw new Error('No token received');
    } catch (e) { console.error(e); return; }

    // 2. Create Business
    console.log('\n--- Step 3: Create Business (Should Succeed now) ---');
    const businessUrl = 'http://localhost:3001/api/business';
    try {
        const res = await fetch(businessUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                business_name: 'My Cool Biz',
                description: 'Best biz ever',
                address: '123 Wall St',
                phone: '555-0000'
            })
        });
        const data = await res.json();
        console.log('Create Business Status:', res.status);
        console.log('Response:', data);

        if (res.status === 201) {
            console.log('✅ SUCCESS: Business created.');
        } else {
            console.log('❌ FAIL: Still getting error.');
        }

    } catch (e) { console.error(e); }

    // 3. Verify Role Upgrade
    // Can check by calling a business-only route (like getMyBusiness)
    console.log('\n--- Step 4: Verify Role Upgrade (Access Protected Route) ---');
    const meUrl = 'http://localhost:3001/api/business/me';
    try {
        const res = await fetch(meUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        console.log('Get My Business Status:', res.status);
        // If 200, it means role checks passed (since /me still requires role='business' in routes)
        if (res.status === 200) {
            console.log('✅ SUCCESS: User can access business routes (Role upgraded).');
        } else {
            console.log('❌ FAIL: User cannot access business routes.');
        }
    } catch (e) { console.error(e); }

};

startTest();
