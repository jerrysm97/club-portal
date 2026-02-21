const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace colors
    let newContent = content.replace(/#1A237E/g, '#111111'); // Dark Blue -> Dark
    newContent = newContent.replace(/#283593/g, '#C8102E'); // Hover Blue -> Primary Red
    newContent = newContent.replace(/#3949AB/g, '#A30D25'); // Lighter Blue -> Darker Red
    newContent = newContent.replace(/#E8EAF6/g, '#FAFAFA'); // Blue 50 -> Light Gray
    newContent = newContent.replace(/#C5CAE9/g, '#E5E5E5'); // Blue 100 -> Border Gray

    // Replace rounded corners
    newContent = newContent.replace(/rounded-3xl/g, 'rounded-sm');
    newContent = newContent.replace(/rounded-2xl/g, 'rounded-sm');
    newContent = newContent.replace(/rounded-xl/g, 'rounded-sm');
    newContent = newContent.replace(/rounded-lg/g, 'rounded-sm');

    // Replace shadows
    newContent = newContent.replace(/shadow-2xl/g, 'shadow-sm');
    newContent = newContent.replace(/shadow-xl/g, 'shadow-sm');
    newContent = newContent.replace(/shadow-lg/g, 'shadow-sm');
    newContent = newContent.replace(/shadow-md/g, 'shadow-sm');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

walkDir('./app/portal', processFile);
walkDir('./components/portal', processFile);
walkDir('./components/ui', processFile);
console.log('Theme refactor complete.');
