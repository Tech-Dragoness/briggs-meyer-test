import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testApiKey() {
  const apiKey = process.env.GEMINI_API_KEY; // Load from environment
  console.log('Testing API Key:', apiKey);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const body = JSON.stringify({
    contents: [
      {
        parts: [
          { text: 'Hello, this is a test' }
        ]
      }
    ]
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing API key:', error.message);
  }
}

testApiKey();