import * as dotenv from 'dotenv';
import * as path from 'path';
import fetch from 'node-fetch';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkDim() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/gemini-embedding-001',
      content: { parts: [{ text: "Hello world" }] }
    })
  });
  
  const data = await response.json();
  if (data.embedding && data.embedding.values) {
    console.log("DIMENSION: ", data.embedding.values.length);
  } else {
    console.error("FAILED TO EMBED:", JSON.stringify(data, null, 2));
  }
}

checkDim();
