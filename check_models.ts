import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('No GOOGLE_API_KEY found in .env.local');
    process.exit(1);
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('Available models:');
      const embedModels = data.models.filter((m: any) => m.supportedGenerationMethods.includes('embedContent'));
      console.log('--- Embed Models ---');
      embedModels.forEach((m: any) => console.log(`- Name: ${m.name}`));
      
      console.log('\n--- All Models ---');
      data.models.forEach((m: any) => console.log(`- Name: ${m.name} | Methods: ${m.supportedGenerationMethods.join(', ')}`));
    } else {
      console.error('Error fetching models:', data);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

checkModels();
