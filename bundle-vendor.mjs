// 把 npm 依赖打包成本地 ESM 单文件，避免运行时依赖任何 CDN
import * as esbuild from 'esbuild';
import { writeFileSync } from 'fs';

// marked
await esbuild.build({
  entryPoints: ['node_modules/marked/lib/marked.esm.js'],
  bundle: true, format: 'esm', minify: true,
  outfile: 'vendor/marked.js',
});

// highlight.js：core + 常用语言
writeFileSync('hljs-entry.js', `
import hljs from 'highlight.js/lib/core';
${['javascript','typescript','python','java','go','rust','c','cpp','csharp','bash','shell','json','yaml','xml','css','sql','markdown','php','ruby','kotlin','swift','dockerfile','ini','diff','plaintext']
  .map(l => `import ${l.replace(/[^a-z]/g,'_')} from 'highlight.js/lib/languages/${l}';\nhljs.registerLanguage('${l}', ${l.replace(/[^a-z]/g,'_')});`).join('\n')}
export default hljs;
`);
await esbuild.build({
  entryPoints: ['hljs-entry.js'],
  bundle: true, format: 'esm', minify: true,
  outfile: 'vendor/highlight.js',
});

// turndown (HTML -> Markdown)
writeFileSync('turndown-entry.js', `import TurndownService from 'turndown'; export default TurndownService;`);
await esbuild.build({
  entryPoints: ['turndown-entry.js'],
  bundle: true, format: 'esm', minify: true,
  outfile: 'vendor/turndown.js',
});
console.log('vendor bundles done');
