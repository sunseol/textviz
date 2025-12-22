
const { math, katexOptionsCtx } = require('@milkdown/plugin-math');
const { mathBlock, mathInline } = require('@milkdown/plugin-math');

console.log('math:', math);
console.log('katexOptionsCtx:', katexOptionsCtx);
console.log('Type of katexOptionsCtx:', typeof katexOptionsCtx);
console.log('Is export valid:', katexOptionsCtx !== undefined);
