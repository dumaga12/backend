const startTest = async () => {
    const registerUrl = 'http://localhost:3001/api/auth/register';
    const loginUrl = 'http://localhost:3001/api/auth/login';

    async function test(name, payload, expectedStatus, expectedMessageFragment) {
        console.log(`\n--- Test: ${name} ---`);
        try {
            const res = await fetch(registerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            console.log(`Status: ${res.status}`);
            console.log('Response:', data);

            if (res.status === expectedStatus && data.message && data.message.includes(expectedMessageFragment)) {
                console.log('✅ PASS');
            } else {
                console.log('❌ FAIL');
            }
        } catch (e) { console.error(e); }
    }

    // 1. Missing Email
    await test('Missing Email', { password: 'pass', name: 'User' }, 400, 'Email is required');

    // 2. Missing Password
    await test('Missing Password', { email: 'user@test.com', name: 'User' }, 400, 'Password is required');

    // 3. Invalid Email Format
    await test('Invalid Email', { email: 'not-an-email', password: 'password123', name: 'User' }, 400, 'Invalid email format');

    // 4. Short Password
    await test('Short Password', { email: 'valid@email.com', password: '123', name: 'User' }, 400, 'at least 6 characters');

    // 5. Success
    const successEmail = `success_${Date.now()}@example.com`;
    await test('Success Registration', { email: successEmail, password: 'password123', name: 'Happy User' }, 201, 'User registered successfully');

    // 6. Duplicate User
    await test('Duplicate User', { email: successEmail, password: 'password123', name: 'Happy User' }, 409, 'User with this email already exists');

};

startTest();
