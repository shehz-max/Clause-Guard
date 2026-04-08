const fs = require('fs');
const path = require('path');

async function testUpload() {
  console.log("Starting upload test...");
  
  const filePath = path.resolve(process.cwd(), 'Sample_Contract.pdf');
  if (!fs.existsSync(filePath)) {
    console.error("Test file Sample_Contract.pdf does not exist.");
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'application/pdf' });
  
  const formData = new FormData();
  formData.append('file', blob, 'Sample_Contract.pdf');

  // Try Next.js dev server on 3000 or 3002
  const ports = [3000, 3002];
  let success = false;

  for (const port of ports) {
    if (success) break;
    
    try {
      console.log(`Trying localhost:${port}...`);
      const response = await fetch(`http://localhost:${port}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const text = await response.text();
      console.log(`Port ${port} HTTP Status: ${response.status}`);
      console.log(`Port ${port} HTTP Response: ${text}`);
      
      if (response.status === 200) {
        success = true;
        console.log("Upload Success! Supabase accepted the document and chunks perfectly.");
      }
    } catch (e) {
      console.log(`Port ${port} offline or unreachable.`);
    }
  }

  if (!success) {
    console.log("Could not successfully contact local development server. Make sure 'npm run dev' is running!");
  }
}

testUpload();
