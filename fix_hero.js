const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

content = content.replace(/text-foreground dark:text-white\/62/g, 'text-white/70');
content = content.replace(/border-black\/5 dark:border-white\/10 bg-black\/5 dark:bg-white\/\[0\.055\]/g, 'border-white/10 bg-white/[0.05]');
content = content.replace(/text-foreground dark:text-white opacity-80/g, 'text-white opacity-80');
content = content.replace(/text-foreground dark:text-white\/65/g, 'text-white/70');
content = content.replace(/hover:text-foreground dark:text-white/g, 'hover:text-white');
content = content.replace(/border-black\/5 dark:border-white\/10 bg-black\/20 px-6 text-xs font-semibold text-foreground dark:text-white\/70 backdrop-blur-md transition hover:-translate-y-1 hover:border-black\/5 dark:border-white\/25 hover:text-foreground dark:text-white/g, 'border-white/10 bg-white/5 px-6 text-xs font-semibold text-white/70 backdrop-blur-md transition hover:-translate-y-1 hover:border-white/25 hover:text-white');

fs.writeFileSync('app/page.tsx', content);
