
import * as MathPlugin from '@milkdown/plugin-math';

console.log('Keys:', Object.keys(MathPlugin));
console.log('math type:', typeof MathPlugin.math);
console.log('math is array:', Array.isArray(MathPlugin.math));
if (Array.isArray(MathPlugin.math)) {
    console.log('math length:', MathPlugin.math.length);
    MathPlugin.math.forEach((p, i) => console.log(`Plugin ${i}:`, p.name || 'anonymous'));
}

console.log('katexOptionsCtx exported:', !!MathPlugin.katexOptionsCtx);
try {
    console.log('katexOptionsCtx ID:', MathPlugin.katexOptionsCtx.id); // Check if it has an ID (Slice)
} catch (e) {
    console.log('katexOptionsCtx inspection error:', e.message);
}
