const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-\[\#020611\]/g, 'bg-white dark:bg-[#020611]');
  content = content.replace(/text-white/g, 'text-foreground dark:text-white');
  content = content.replace(/border-white\//g, 'border-black/5 dark:border-white/');
  content = content.replace(/bg-white\//g, 'bg-black/5 dark:bg-white/');
  content = content.replace(/text-muted-foreground/g, 'text-muted-foreground dark:text-white/60');
  fs.writeFileSync(file, content);
}

updateFile('app/page.tsx');
updateFile('components/Projects.tsx');
