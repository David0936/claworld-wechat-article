import { THEMES, themeById } from './themes.js';
import { CODE_THEMES, buildFollowTheme, inlineHighlight } from './codeThemes.js';
import { render, DEFAULT_OPTS } from './renderer.js';
import { AI_PRESETS, aiRun } from './ai.js';
import { SAMPLE_MD } from './sample.js';
import hljs from '../vendor/highlight.js';
import TurndownService from '../vendor/turndown.js';

const $ = id => document.getElementById(id);
const editor = $('editor');
const preview = $('preview');

// ---------- 状态 ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem('cw.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('cw.' + k, JSON.stringify(v)); } catch { /* ignore */ } },
};

const state = {
  themeId: store.get('theme', 'classic'),
  opts: { ...DEFAULT_OPTS, ...store.get('opts', {}) },
  html: '',
};
editor.value = store.get('md', null) ?? SAMPLE_MD;

// ---------- 渲染 ----------
let timer = null;
function rerender(immediate = false) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    state.html = render(editor.value, themeById(state.themeId), state.opts);
    preview.innerHTML = state.html;
    const text = editor.value.replace(/[#>*`\-\[\]()=:|!]/g, '').replace(/\s/g, '');
    $('wordCount').textContent = `${text.length} 字 · 约 ${Math.max(1, Math.round(text.length / 450))} 分钟`;
    store.set('md', editor.value);
  }, immediate ? 0 : 200);
}
editor.addEventListener('input', () => rerender());

// ---------- 主题切换条 ----------
function renderThemeBar() {
  $('themeBar').innerHTML = THEMES.map(t =>
    `<button class="theme-chip ${t.id === state.themeId ? 'active' : ''}" data-id="${t.id}" title="${t.desc}">
      <span class="dot" style="background:${t.chip}"></span>${t.name}</button>`).join('');
}
$('themeBar').addEventListener('click', e => {
  const btn = e.target.closest('.theme-chip');
  if (!btn) return;
  state.themeId = btn.dataset.id;
  store.set('theme', state.themeId);
  renderThemeBar();
  buildCodeThemePicker();
  rerender(true);
});
renderThemeBar();

// ---------- 设置面板 ----------
function openDrawer(id) { $(id).classList.add('open'); $('overlay').classList.add('show'); }
function closeDrawers() {
  document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
  $('overlay').classList.remove('show');
}
$('overlay').addEventListener('click', closeDrawers);
document.querySelectorAll('.drawer-close').forEach(b => b.addEventListener('click', closeDrawers));
$('btnSettings').addEventListener('click', () => openDrawer('settingsDrawer'));
$('btnAI').addEventListener('click', () => openDrawer('aiDrawer'));

// ---- 代码配色：带实时预览的卡片选择器 ----
const CODE_PREVIEW = `function hello(name) {\n  // 打个招呼\n  return \`Hi, \${name}\`;\n}`;

function currentPrimary() {
  return state.opts.primary || themeById(state.themeId).defaults.primary;
}

function codeThemeCard(ct) {
  let body;
  try { body = inlineHighlight(hljs.highlight(CODE_PREVIEW, { language: 'javascript' }).value, ct); }
  catch { body = CODE_PREVIEW; }
  const active = state.opts.codeTheme === ct.id ? ' active' : '';
  const dot = c => `<span class="cc-dot" style="background:${c}"></span>`;
  return `<button type="button" class="code-card${active}" data-id="${ct.id}">
    <div class="cc-window" style="background:${ct.bg}">
      <div class="cc-bar" style="background:${ct.barBg}">${dot('#ff5f56')}${dot('#ffbd2e')}${dot('#27c93f')}</div>
      <pre class="cc-code" style="color:${ct.fg}"><code>${body}</code></pre>
    </div>
    <div class="cc-meta"><span class="cc-name">${ct.name}</span><span class="cc-desc">${ct.desc || ''}</span></div>
  </button>`;
}

function buildCodeThemePicker() {
  const list = [buildFollowTheme(currentPrimary()), ...CODE_THEMES];
  $('codeThemeGrid').innerHTML = list.map(codeThemeCard).join('');
}
$('codeThemeGrid').addEventListener('click', e => {
  const card = e.target.closest('.code-card');
  if (!card) return;
  state.opts.codeTheme = card.dataset.id;
  store.set('opts', state.opts);
  buildCodeThemePicker();
  rerender(true);
});
buildCodeThemePicker();

function syncSettingsUI() {
  $('optFontSize').value = String(state.opts.fontSize);
  $('optIndent').checked = state.opts.indent;
  $('optJustify').checked = state.opts.justify;
  $('optMacCode').checked = state.opts.macCode;
  $('optAutoLang').checked = state.opts.autoLang;
  $('optAutoImage').checked = state.opts.autoImage;
  $('optLinkFootnote').checked = state.opts.linkFootnote;
  $('optCaptions').checked = state.opts.captions;
  $('optPrimary').value = state.opts.primary || themeById(state.themeId).defaults.primary;
}
syncSettingsUI();

function bindOpt(id, key, type = 'checkbox') {
  $(id).addEventListener('change', e => {
    state.opts[key] = type === 'checkbox' ? e.target.checked
      : type === 'number' ? Number(e.target.value) : e.target.value;
    store.set('opts', state.opts);
    rerender(true);
  });
}
bindOpt('optFontSize', 'fontSize', 'number');
bindOpt('optIndent', 'indent');
bindOpt('optJustify', 'justify');
bindOpt('optMacCode', 'macCode');
bindOpt('optAutoLang', 'autoLang');
bindOpt('optAutoImage', 'autoImage');
bindOpt('optLinkFootnote', 'linkFootnote');
bindOpt('optCaptions', 'captions');
$('optPrimary').addEventListener('change', e => {
  state.opts.primary = e.target.value;
  store.set('opts', state.opts); buildCodeThemePicker(); rerender(true);
});
$('optPrimaryReset').addEventListener('click', () => {
  state.opts.primary = null;
  store.set('opts', state.opts); syncSettingsUI(); buildCodeThemePicker(); rerender(true);
});

// ---------- 复制到公众号 ----------
async function copyToWechat() {
  rerender(true);
  await new Promise(r => setTimeout(r, 30));
  const html = state.html;
  try {
    await navigator.clipboard.write([new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([editor.value], { type: 'text/plain' }),
    })]);
  } catch {
    // 回退：选区复制
    const tmp = document.createElement('div');
    tmp.style.cssText = 'position:fixed;left:-9999px;top:0;';
    tmp.innerHTML = html;
    document.body.appendChild(tmp);
    const range = document.createRange();
    range.selectNodeContents(tmp);
    const sel = getSelection();
    sel.removeAllRanges(); sel.addRange(range);
    document.execCommand('copy');
    sel.removeAllRanges(); tmp.remove();
  }
  toast('已复制 ✓ 去公众号后台粘贴即可');
}
$('btnCopy').addEventListener('click', copyToWechat);

// ---------- 导入 / 导出 ----------
const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });

function loadFile(file) {
  const name = file.name.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(name)) {
    const fr = new FileReader();
    fr.onload = () => { insertSnippet(`\n\n![图注](${fr.result})\n\n`); toast('已插入图片（Base64 仅用于预览，发布请用图床外链）'); };
    fr.readAsDataURL(file);
    return;
  }
  const fr = new FileReader();
  fr.onload = () => {
    let md = fr.result;
    if (/\.(html?|xhtml)$/.test(name)) md = turndown.turndown(md);
    editor.value = md;
    rerender(true);
    toast(`已导入 ${file.name}`);
  };
  fr.readAsText(file);
}
$('fileInput').addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); e.target.value = ''; });
$('btnUpload').addEventListener('click', () => $('fileInput').click());

editor.addEventListener('dragover', e => { e.preventDefault(); editor.classList.add('dragging'); });
editor.addEventListener('dragleave', () => editor.classList.remove('dragging'));
editor.addEventListener('drop', e => {
  e.preventDefault(); editor.classList.remove('dragging');
  if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
});

function download(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name; a.click();
  URL.revokeObjectURL(a.href);
}
$('btnExportMd').addEventListener('click', () => download('article.md', editor.value, 'text/markdown'));
$('btnExportHtml').addEventListener('click', () =>
  download('article.html', `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>文章导出</title></head><body style="max-width:677px;margin:0 auto;padding:20px 16px;">${state.html}</body></html>`, 'text/html'));
$('btnSample').addEventListener('click', () => {
  if (editor.value.trim() && !confirm('将覆盖当前内容，载入示例文章？')) return;
  editor.value = SAMPLE_MD; rerender(true);
});

// ---------- 快捷插入 ----------
function insertSnippet(text, wrap = null) {
  const { selectionStart: s, selectionEnd: e, value: v } = editor;
  if (wrap) {
    const sel = v.slice(s, e) || wrap.placeholder;
    editor.value = v.slice(0, s) + wrap.before + sel + wrap.after + v.slice(e);
    editor.selectionStart = s + wrap.before.length;
    editor.selectionEnd = s + wrap.before.length + sel.length;
  } else {
    editor.value = v.slice(0, s) + text + v.slice(e);
    editor.selectionStart = editor.selectionEnd = s + text.length;
  }
  editor.focus();
  rerender();
}

const SNIPPETS = {
  h2: { text: '\n\n## 小标题\n\n' },
  bold: { wrap: { before: '**', after: '**', placeholder: '重点' } },
  mark: { wrap: { before: '==', after: '==', placeholder: '高亮' } },
  quote: { text: '\n\n> 引用一句话\n\n' },
  code: { text: '\n\n```javascript\nconsole.log("hello");\n```\n\n' },
  img: { text: '\n\n![图注写在这里](https://图片地址)\n\n' },
  gallery: { text: '\n\n![图1](地址1) ![图2](地址2) ![图3](地址3)\n\n' },
  tip: { text: '\n\n:::tip 小贴士\n卡片内容，支持 **Markdown**\n:::\n\n' },
  warning: { text: '\n\n:::warning 注意\n警示内容\n:::\n\n' },
  center: { text: '\n\n:::center\n居中的内容\n:::\n\n' },
  hr: { text: '\n\n---\n\n' },
  table: { text: '\n\n| 列一 | 列二 |\n| --- | --- |\n| 内容 | 内容 |\n\n' },
};
document.querySelectorAll('[data-snippet]').forEach(btn =>
  btn.addEventListener('click', () => {
    const sn = SNIPPETS[btn.dataset.snippet];
    insertSnippet(sn.text, sn.wrap);
  }));

// ---------- AI 排版 ----------
const aiCfg = store.get('ai', { preset: 'deepseek', baseUrl: '', apiKey: '', model: '' });
$('aiPreset').innerHTML = AI_PRESETS.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

function syncAiUI(fromPreset = false) {
  const p = AI_PRESETS.find(x => x.id === aiCfg.preset) || AI_PRESETS[0];
  $('aiPreset').value = p.id;
  if (fromPreset) { aiCfg.baseUrl = p.baseUrl; aiCfg.model = p.model; }
  $('aiBaseUrl').value = aiCfg.baseUrl || p.baseUrl;
  $('aiModel').value = aiCfg.model || p.model;
  $('aiKey').value = aiCfg.apiKey || '';
}
syncAiUI();
$('aiPreset').addEventListener('change', e => { aiCfg.preset = e.target.value; syncAiUI(true); saveAi(); });
['aiBaseUrl', 'aiModel', 'aiKey'].forEach(id => $(id).addEventListener('change', () => {
  aiCfg.baseUrl = $('aiBaseUrl').value.trim();
  aiCfg.model = $('aiModel').value.trim();
  aiCfg.apiKey = $('aiKey').value.trim();
  saveAi();
}));
function saveAi() { store.set('ai', aiCfg); }

document.querySelectorAll('.ai-quick').forEach(b =>
  b.addEventListener('click', () => { $('aiInstruction').value = b.dataset.prompt; }));

let aiBackup = null;
$('aiRestore').addEventListener('click', () => {
  if (aiBackup != null) { editor.value = aiBackup; aiBackup = null; $('aiRestore').hidden = true; rerender(true); toast('已恢复原文'); }
});

$('aiRun').addEventListener('click', async () => {
  const instruction = $('aiInstruction').value.trim();
  if (!instruction) return toast('先告诉 AI 你想怎么排～');
  if (!aiCfg.apiKey) return toast('请先填写 API Key（仅保存在你的浏览器里）');
  const p = AI_PRESETS.find(x => x.id === aiCfg.preset) || AI_PRESETS[0];
  const cfg = { type: p.type, baseUrl: aiCfg.baseUrl || p.baseUrl, model: aiCfg.model || p.model, apiKey: aiCfg.apiKey };

  aiBackup = editor.value;
  const btn = $('aiRun');
  btn.disabled = true; btn.textContent = '思考中…';
  $('aiStatus').textContent = '';
  try {
    const { theme, markdown } = await aiRun({
      cfg, markdown: aiBackup, instruction, themes: THEMES,
      onDelta: (_d, full) => {
        btn.textContent = `生成中 ${full.length} 字…`;
        editor.value = full; rerender();
        editor.scrollTop = editor.scrollHeight;
      },
    });
    editor.value = markdown;
    if (theme && themeById(theme).id === theme) {
      state.themeId = theme; store.set('theme', theme); renderThemeBar(); buildCodeThemePicker();
    }
    rerender(true);
    $('aiRestore').hidden = false;
    $('aiStatus').textContent = '完成 ✓ 不满意可点「恢复原文」';
    toast('AI 排版完成 ✨');
  } catch (err) {
    editor.value = aiBackup; rerender(true);
    $('aiStatus').textContent = '出错了：' + err.message;
  } finally {
    btn.disabled = false; btn.textContent = '开始排版 ✨';
  }
});

// ---------- 杂项 ----------
let toastTimer;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); copyToWechat(); }
  if (e.key === 'Escape') closeDrawers();
});

editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    insertSnippet('  ');
  }
});

rerender(true);
