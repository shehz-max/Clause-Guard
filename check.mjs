import fs from 'fs';
import https from 'https';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let apiKey = '';
for (const line of envContent.split('\n')) {
  if (line.startsWith('GOOGLE_API_KEY=')) {
    apiKey = line.split('=')[1].trim().replace(/['"]/g, '');
  }
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    if (parsed.models) {
      const embedModels = parsed.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('embedContent'));
      console.log('--- SUPORTED EMBEDDING MODELS ---');
      embedModels.forEach(m => console.log(m.name));
      console.log('---------------------------------');
    } else {
      console.log('Error from Google API:', parsed);
    }
  });
});
