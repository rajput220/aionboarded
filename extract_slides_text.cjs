const fs = require('fs');
const path = require('path');

const slidesDir = process.argv[2];
const files = fs.readdirSync(slidesDir).filter(f => f.endsWith('.xml') && f.startsWith('slide'));

files.forEach(file => {
    const content = fs.readFileSync(path.join(slidesDir, file), 'utf8');
    const matches = content.match(/<a:t[^>]*>(.*?)<\/a:t>/g);
    if (matches) {
        console.log(`--- ${file} ---`);
        const texts = matches.map(m => m.replace(/<a:t[^>]*>/, '').replace('<\/a:t>', ''));
        console.log(texts.join(' '));
    }
});
