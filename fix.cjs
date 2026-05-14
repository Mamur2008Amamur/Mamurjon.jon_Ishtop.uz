const fs = require('fs');
const file = 'c:/Users/hp/OneDrive/Desktop/edubot_fixed/client/js/services.js';
let content = fs.readFileSync(file, 'utf8');

// Replace string literal backslashes from when it was written from a python script
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$\{/g, '${');
content = content.replace(/\\n/g, '\n');
content = content.replace(/\\'/g, "'");

fs.writeFileSync(file, content);
console.log('Fixed services.js successfully');
