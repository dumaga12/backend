const startTest = async () => {
    // 1. Register a new user
    const registerUrl = 'http://localhost:3001/api/auth/register';
    const email = `biz_v2_${Date.now()}@example.com`;
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
    } catch (e) { console.error(e); return; }

    // 2. Create Business
    console.log('\n--- Step 3: Create Business (Should return new token) ---');
    const businessUrl = 'http://localhost:3001/api/business';
    let newToken = '';
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

        if (data.token) {
            console.log('✅ received new token.');
            newToken = data.token;
        } else {
            console.log('❌ Did NOT receive new token.');
        }

    } catch (e) { console.error(e); }

    // 3. Verify Role Upgrade using NEW token
    console.log('\n--- Step 4: Verify Role Upgrade (Access Protected Route with NEW token) ---');
    const meUrl = 'http://localhost:3001/api/business/me';
    try {
        const res = await fetch(meUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${newToken}`
            }
        });
        console.log('Get My Business Status:', res.status);
        if (res.status === 200) {
            console.log('✅ SUCCESS: User can access business routes.');
        } else {
            console.log('❌ FAIL: User cannot access business routes.');
        }
    } catch (e) { console.error(e); }

};

startTest();
