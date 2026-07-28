

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    // 1. Register/Login to get token
    const loginRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email: 'test_api@example.com', password: 'password123' })
    });
    
    let token = '';
    if (loginRes.ok) {
        const loginData = await loginRes.json();
        token = loginData.token;
    } else {
        const loginRes2 = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test_api@example.com', password: 'password123' })
        });
        const loginData = await loginRes2.json();
        token = loginData.token;
    }

    // 2. Test /api/legal-assistant
    const res = await fetch('http://localhost:5000/api/legal-assistant', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ query: 'What are my rights if my landlord increases rent without notice?' })
    });

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

test();
