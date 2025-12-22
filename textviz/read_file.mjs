import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const inputPath = join(process.cwd(), 'node_modules', '@milkdown', 'plugin-math', 'lib', 'index.d.ts');
const outputPath = 'C:/Users/gaara/.gemini/antigravity/brain/a4dcaff2-5acf-4c7b-a2ae-b82939136975/debug_out.txt';

try {
    const content = await readFile(inputPath, 'utf-8');
    await writeFile(outputPath, content);
    console.log('Written to ' + outputPath);
} catch (error) {
    await writeFile(outputPath, 'Error: ' + error.message);
}
