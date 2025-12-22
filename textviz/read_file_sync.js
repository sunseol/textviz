
const fs = require('fs');
const path = require('path');

const inputPath = path.join(process.cwd(), 'node_modules', '@milkdown', 'plugin-math', 'lib', 'index.d.ts');
const outputPath = 'C:/Users/gaara/.gemini/antigravity/brain/a4dcaff2-5acf-4c7b-a2ae-b82939136975/debug_out.txt';

console.log('Start Sync Read');
try {
    const content = fs.readFileSync(inputPath, 'utf-8');
    fs.writeFileSync(outputPath, content);
    console.log('Success: ' + outputPath);
} catch (e) {
    console.error('Error: ' + e.message);
}
