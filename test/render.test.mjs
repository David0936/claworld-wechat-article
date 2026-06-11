// 冒烟测试：示例文章 × 全部主题 × 关键选项组合，校验输出完整性
// 运行：npm test
import { render } from '../src/renderer.js';
import { THEMES } from '../src/themes.js';
import { SAMPLE_MD } from '../src/sample.js';
import { CODE_THEMES } from '../src/codeThemes.js';

let failures = 0;
const check = (name, cond, extra = '') => {
  if (!cond) { failures++; console.error(`✗ ${name} ${extra}`); }
};

function balancedTags(html) {
  const stack = [];
  const re = /<\/?([a-z0-9]+)(?:\s[^>]*)?>/gi;
  const voidTags = new Set(['img', 'br', 'hr', 'input']);
  let m;
  while ((m = re.exec(html))) {
    const tag = m[1].toLowerCase();
    if (voidTags.has(tag)) continue;
    if (m[0][1] === '/') {
      if (stack.pop() !== tag) return `闭合不匹配: ${tag} @${m.index}`;
    } else stack.push(tag);
  }
  return stack.length ? `未闭合: ${stack.join(',')}` : null;
}

for (const theme of THEMES) {
  for (const opts of [
    { fontSize: 16 },
    { fontSize: 15, indent: true, justify: true, macCode: false, linkFootnote: false, captions: false },
  ]) {
    const html = render(SAMPLE_MD, theme, opts);
    const tag = `${theme.id} ${JSON.stringify(opts)}`;
    check(`${tag} 非空`, html.length > 2000);
    check(`${tag} 无 undefined`, !/undefined/.test(html));
    check(`${tag} 无 [object`, !/\[object /.test(html));
    const bal = balancedTags(html);
    check(`${tag} 标签闭合`, !bal, bal || '');
    check(`${tag} 包含代码高亮`, html.includes('<pre'));
    check(`${tag} 多图网格`, html.includes('display:flex'));
    check(`${tag} 容器卡片`, html.includes('发文前检查'));
    check(`${tag} 表格`, html.includes('<table'));
    if (opts.linkFootnote !== false) check(`${tag} 外链脚注`, html.includes('参考链接'));
  }
}

// 代码主题逐一渲染
for (const ct of CODE_THEMES) {
  const html = render('```python\ndef f(x):\n    return x + 1  # 注释\n```', THEMES[0], { codeTheme: ct.id });
  check(`code-theme ${ct.id}`, html.includes(ct.bg) && !html.includes('class="hljs'));
}

// 边界用例
const edge = render('段落 <脚本>&amp; "引号"\n\n- [ ] 待办\n- [x] 已完成\n\n```\n无语言代码\n```', THEMES[0], {});
check('HTML 转义', edge.includes('&lt;脚本&gt;'));
check('任务列表', edge.includes('☐') && edge.includes('☑'));
check('空内容', render('', THEMES[0], {}).includes('<section'));

if (failures) { console.error(`\n${failures} 个检查失败`); process.exit(1); }
console.log(`✓ 全部通过（${THEMES.length} 主题 × 2 选项组合 + ${CODE_THEMES.length} 代码配色 + 边界用例）`);
