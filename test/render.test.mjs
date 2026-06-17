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

// 自动识别语言：未标语言的 python，应被高亮（出现内联 color span）且标出 python
const autoCode = render('```\ndef greet(name):\n    print(f"hello {name}")\n    return True\n```', THEMES[0], {});
check('未标语言代码被高亮', /<span style="color:#[0-9a-f]{6}">/.test(autoCode));
check('自动识别标出 python', autoCode.includes('>python<'));
const autoOff = render('```\ndef greet(name):\n    print(name)\n```', THEMES[0], { autoLang: false });
check('关闭自动识别后不高亮', !/<span style="color:#[0-9a-f]{6}">/.test(autoOff));

// 图片地址自动转图片
const bareImg = render('看图 https://example.com/pic.jpg 很好', THEMES[0], {});
check('行内图片地址转 img', bareImg.includes('<img src="https://example.com/pic.jpg"'));
const standaloneImg = render('https://cdn.test.com/a.png', THEMES[0], {});
check('独占行图片地址转居中大图', standaloneImg.includes('<img') && standaloneImg.includes('margin:0 auto'));
const galleryUrls = render('https://t.co/1.jpg https://t.co/2.png https://t.co/3.webp', THEMES[0], {});
check('多个图片地址转网格', (galleryUrls.match(/<img/g) || []).length === 3 && galleryUrls.includes('display:flex'));
const imgOff = render('https://example.com/pic.jpg', THEMES[0], { autoImage: false });
check('关闭后图片地址不转 img', !imgOff.includes('<img'));
const realLink = render('文档 https://example.com/docs 在这', THEMES[0], { linkFootnote: false });
check('非图片地址仍是链接', realLink.includes('<a href="https://example.com/docs"'));

if (failures) { console.error(`\n${failures} 个检查失败`); process.exit(1); }
console.log(`✓ 全部通过（${THEMES.length} 主题 × 2 选项组合 + ${CODE_THEMES.length} 代码配色 + 边界用例）`);
