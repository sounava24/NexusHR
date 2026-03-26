const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) processDir(full);
    else if (f === 'route.ts') {
      const c = fs.readFileSync(full, 'utf8');
      if (!c.includes('force-dynamic')) {
        fs.writeFileSync(full, 'export const dynamic = "force-dynamic";\n' + c);
      }
    }
  }
}

processDir('src/app/api');
