const fs = require('fs');

const xmlFile = process.argv[2];
const content = fs.readFileSync(xmlFile, 'utf8');

const matches = content.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
if (matches) {
    const texts = matches.map(m => m.replace(/<w:t[^>]*>/, '').replace('</w:t>', ''));
    console.log(texts.join(' '));
} else {
    console.log('No text found');
}
