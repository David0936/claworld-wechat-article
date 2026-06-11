// ============================================================
// 渲染引擎：Markdown -> 内联样式 HTML（微信公众号可直接粘贴）
// 基于 marked 的 lexer 拿到 token 树，自己发射 HTML，
// 以便完全控制结构（多图网格、图注、Mac 代码框、卡片容器等）。
// ============================================================

import { marked } from '../vendor/marked.js';
import hljs from '../vendor/highlight.js';
import { FONTS, rgba } from './themes.js';
import { codeThemeById, inlineHighlight } from './codeThemes.js';

// ---------- 自定义语法扩展 ----------

// :::tip 标题 / :::warning / :::card / :::center ... ::: 容器
const containerExt = {
  name: 'container',
  level: 'block',
  start(src) { const i = src.indexOf(':::'); return i < 0 ? undefined : i; },
  tokenizer(src) {
    const cap = /^:{3,}[ \t]*(\w+)?[ \t]*([^\n]*)\n([\s\S]*?)\n:{3,}[ \t]*(?:\n+|$)/.exec(src);
    if (!cap) return;
    const token = {
      type: 'container', raw: cap[0],
      kind: (cap[1] || 'card').toLowerCase(),
      title: (cap[2] || '').trim(),
      tokens: [],
    };
    this.lexer.blockTokens(cap[3], token.tokens);
    return token;
  },
};

// ==高亮文本==
const markExt = {
  name: 'mark',
  level: 'inline',
  start(src) { const i = src.indexOf('=='); return i < 0 ? undefined : i; },
  tokenizer(src) {
    const cap = /^==([^=\n]+)==/.exec(src);
    if (!cap) return;
    return { type: 'mark', raw: cap[0], text: cap[1], tokens: this.lexer.inlineTokens(cap[1]) };
  },
};

marked.use({ extensions: [containerExt, markExt] });

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ---------- 行内 token ----------

function emitInline(tokens, ctx) {
  let out = '';
  for (const tk of tokens || []) {
    switch (tk.type) {
      case 'text':
        out += tk.tokens ? emitInline(tk.tokens, ctx) : (tk.escaped ? tk.text : esc(tk.text));
        break;
      case 'escape':
        out += esc(tk.text); break;
      case 'strong':
        out += `<strong style="${ctx.t.strong}">${emitInline(tk.tokens, ctx)}</strong>`; break;
      case 'em':
        out += `<em style="${ctx.t.em}">${emitInline(tk.tokens, ctx)}</em>`; break;
      case 'del':
        out += `<span style="${ctx.t.del}">${emitInline(tk.tokens, ctx)}</span>`; break;
      case 'mark':
        out += `<span style="${ctx.t.mark}">${emitInline(tk.tokens, ctx)}</span>`; break;
      case 'codespan':
        out += `<code style="${ctx.t.codespan}">${tk.escaped ? tk.text : esc(tk.text)}</code>`; break;
      case 'br':
        out += '<br>'; break;
      case 'link':
        out += emitLink(tk, ctx); break;
      case 'image':
        out += emitImg(tk, ctx, true); break;
      case 'html':
        out += tk.text; break;
      default:
        out += esc(tk.raw || '');
    }
  }
  return out;
}

function emitLink(tk, ctx) {
  const inner = emitInline(tk.tokens, ctx);
  const href = tk.href || '';
  const isWx = /^https?:\/\/mp\.weixin\.qq\.com/.test(href);
  // 微信文内不允许外部超链接，可选转为文末引用
  if (ctx.opts.linkFootnote && /^https?:/.test(href) && !isWx) {
    const n = ctx.foot.push({ href, label: tk.tokens?.map(t => t.text ?? t.raw).join('') || href }) ;
    return `<span style="color:${ctx.t.o.primary};">${inner}</span><sup style="color:${ctx.t.o.primary};font-size:${ctx.t.o.fs - 4}px;">[${n}]</sup>`;
  }
  return `<a href="${esc(href)}" style="${ctx.t.link}">${inner}</a>`;
}

// ---------- 图片 / 多图网格 ----------

function imgStyle(ctx, extra = '') {
  const im = ctx.t.img;
  return `max-width:100%;border-radius:${im.radius};box-shadow:${im.shadow};border:${im.border};display:block;margin:0 auto;${extra}`;
}

function emitImg(tk, ctx, inline = false) {
  const cap = tk.title || (ctx.opts.captions ? tk.text : '');
  if (inline) return `<img src="${esc(tk.href)}" alt="${esc(tk.text)}" style="max-width:100%;vertical-align:middle;border-radius:4px;">`;
  return `<section style="margin:1.6em 0;text-align:center;">` +
    `<img src="${esc(tk.href)}" alt="${esc(tk.text)}" style="${imgStyle(ctx)}">` +
    (cap ? `<section style="${ctx.t.figcaption}">${esc(cap)}</section>` : '') +
    `</section>`;
}

function emitGallery(imgs, ctx) {
  // 同一段落里的多张图片 -> 横向网格（>3 张自动换行）
  const n = imgs.length;
  const basis = n <= 3 ? `${(100 / n).toFixed(2)}%` : '33.33%';
  const cells = imgs.map(tk =>
    `<section style="flex:1 1 calc(${basis} - 6px);min-width:calc(${basis} - 6px);">` +
    `<img src="${esc(tk.href)}" alt="${esc(tk.text)}" style="width:100%;border-radius:${ctx.t.img.radius};box-shadow:${ctx.t.img.shadow};border:${ctx.t.img.border};display:block;">` +
    `</section>`).join('');
  const caps = imgs.map(tk => tk.title || (ctx.opts.captions ? tk.text : '')).filter(Boolean);
  return `<section style="margin:1.6em 0;">` +
    `<section style="display:flex;flex-wrap:wrap;gap:6px;align-items:stretch;">${cells}</section>` +
    (caps.length ? `<section style="text-align:center;${ctx.t.figcaption}">${esc(caps.join(' · '))}</section>` : '') +
    `</section>`;
}

// ---------- 代码块 ----------

function emitCode(tk, ctx) {
  const o = ctx.t.o;
  const ct = codeThemeById(ctx.opts.codeTheme);
  const lang = (tk.lang || '').trim().split(/\s+/)[0].toLowerCase();
  let body;
  try {
    body = lang && hljs.getLanguage(lang)
      ? inlineHighlight(hljs.highlight(tk.text, { language: lang }).value, ct)
      : esc(tk.text);
  } catch { body = esc(tk.text); }

  const dot = c => `<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${c};margin-right:7px;"></span>`;
  const macBar = ctx.opts.macCode
    ? `<section style="background:${ct.barBg};padding:9px 14px;display:flex;align-items:center;">` +
      dot('#ff5f56') + dot('#ffbd2e') + dot('#27c93f') +
      (lang ? `<span style="margin-left:auto;color:${ct.langColor};font-size:12px;font-family:${FONTS.mono};">${esc(lang)}</span>` : '') +
      `</section>`
    : '';
  return `<section style="margin:1.6em 0;border-radius:10px;overflow:hidden;box-shadow:0 5px 16px rgba(0,0,0,.14);">` +
    macBar +
    `<pre style="margin:0;background:${ct.bg};padding:14px 16px;overflow-x:auto;">` +
    `<code style="font-family:${FONTS.mono};font-size:${Math.max(o.fs - 3, 12)}px;line-height:1.65;color:${ct.fg};display:block;white-space:pre;">${body}</code>` +
    `</pre></section>`;
}

// ---------- 段落 / 列表 / 引用 / 表格 ----------

function pStyle(ctx) {
  let s = ctx.t.p;
  if (ctx.align) s += `text-align:${ctx.align};`;
  else if (ctx.opts.justify) s += 'text-align:justify;';
  if (ctx.opts.indent && !ctx.inCard && !ctx.align) s += 'text-indent:2em;';
  if (ctx.inCard) s = ctx.t.bqP;
  return s;
}

function emitParagraph(tk, ctx) {
  const toks = tk.tokens || [];
  const imgs = toks.filter(t => t.type === 'image');
  const rest = toks.filter(t => t.type !== 'image' && !(t.type === 'text' && !t.text.trim()) && t.type !== 'br');
  if (imgs.length && rest.length === 0) {
    return imgs.length === 1 ? emitImg(imgs[0], ctx) : emitGallery(imgs, ctx);
  }
  return `<p style="${pStyle(ctx)}">${emitInline(toks, ctx)}</p>`;
}

function emitList(tk, ctx, depth = 0) {
  const items = tk.items.map((it, i) => {
    let marker;
    if (it.task) {
      marker = `<span style="color:${ctx.t.o.primary};margin-right:.5em;">${it.checked ? '☑' : '☐'}</span>`;
    } else {
      marker = tk.ordered
        ? ctx.t.olMarker((Number(tk.start) || 1) + i)
        : ctx.t.ulMarker();
    }
    // list_item 的 tokens 里可能混着行内文本（text）和嵌套块（list/blockquote/code）
    let body = '';
    for (const sub of it.tokens || []) {
      if (sub.type === 'text') body += emitInline(sub.tokens || [sub], ctx);
      else if (sub.type === 'paragraph') body += emitInline(sub.tokens, ctx);
      else body += emitBlocks([sub], ctx, depth + 1);
    }
    return `<li style="${ctx.t.li}">${marker}${body}</li>`;
  }).join('');
  const tag = tk.ordered ? 'ol' : 'ul';
  return `<${tag} style="list-style:none;margin:${depth ? '.3em' : '1.2em'} 0;padding-left:${depth ? '1.4em' : '4px'};">${items}</${tag}>`;
}

function emitBlockquote(tk, ctx) {
  const prev = ctx.inCard; ctx.inCard = true;
  const inner = emitBlocks(tk.tokens, ctx);
  ctx.inCard = prev;
  return (ctx.t.bqPrefix || '') + `<blockquote style="${ctx.t.bq}">${inner}</blockquote>`;
}

function emitTable(tk, ctx) {
  const alignOf = a => a ? `text-align:${a};` : '';
  const head = tk.header.map(c => `<th style="${ctx.t.th}${alignOf(c.align)}">${emitInline(c.tokens, ctx)}</th>`).join('');
  const rows = tk.rows.map(r =>
    `<tr>${r.map(c => `<td style="${ctx.t.td}${alignOf(c.align)}">${emitInline(c.tokens, ctx)}</td>`).join('')}</tr>`
  ).join('');
  return `<section style="margin:1.6em 0;overflow-x:auto;">` +
    `<table style="border-collapse:collapse;width:100%;"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></section>`;
}

function emitContainer(tk, ctx) {
  const prevAlign = ctx.align, prevCard = ctx.inCard;
  if (tk.kind === 'center') {
    ctx.align = 'center';
    const inner = emitBlocks(tk.tokens, ctx);
    ctx.align = prevAlign;
    return `<section style="margin:1.4em 0;text-align:center;">${inner}</section>`;
  }
  ctx.inCard = true;
  const inner = emitBlocks(tk.tokens, ctx);
  ctx.inCard = prevCard;
  const title = tk.title ? emitInline(marked.lexer(tk.title, { gfm: true })[0]?.tokens || [], ctx) : '';
  return ctx.t.card(tk.kind, title, inner);
}

// ---------- 块级总调度 ----------

function emitBlocks(tokens, ctx, depth = 0) {
  let out = '';
  for (const tk of tokens || []) {
    switch (tk.type) {
      case 'space': break;
      case 'heading': {
        if (tk.depth === 2) { ctx.n2++; ctx.n3 = 0; }
        if (tk.depth === 3) ctx.n3++;
        out += ctx.t.heading(Math.min(tk.depth, 4), emitInline(tk.tokens, ctx), ctx);
        break;
      }
      case 'paragraph': out += emitParagraph(tk, ctx); break;
      case 'code': out += emitCode(tk, ctx); break;
      case 'blockquote': out += emitBlockquote(tk, ctx); break;
      case 'list': out += emitList(tk, ctx, depth); break;
      case 'table': out += emitTable(tk, ctx); break;
      case 'hr': out += ctx.t.hr(ctx); break;
      case 'container': out += emitContainer(tk, ctx); break;
      case 'html': out += tk.text; break;
      case 'text':
        out += `<p style="${pStyle(ctx)}">${emitInline(tk.tokens || [tk], ctx)}</p>`; break;
      default: break;
    }
  }
  return out;
}

// ---------- 对外入口 ----------

export const DEFAULT_OPTS = {
  fontSize: 16,
  indent: false,        // 段落首行缩进
  justify: false,       // 两端对齐
  macCode: true,        // Mac 风格代码框
  codeTheme: 'github-dark',
  linkFootnote: true,   // 外链转文末引用
  captions: true,       // 图片 alt 显示为图注
  primary: null,        // 主色覆盖（null = 使用主题默认）
};

export function render(markdown, theme, opts = {}) {
  opts = { ...DEFAULT_OPTS, ...opts };
  const t = theme.build({ fs: Number(opts.fontSize) || 16, ...(opts.primary ? { primary: opts.primary } : {}) });
  const ctx = { t, opts, n2: 0, n3: 0, foot: [], align: null, inCard: false };
  const tokens = marked.lexer(markdown || '', { gfm: true, breaks: true });
  let body = emitBlocks(tokens, ctx);

  // 文末参考链接
  if (ctx.foot.length) {
    body += `<section style="margin-top:2.5em;">` +
      `<section style="${t.footTitle}">参考链接</section>` +
      ctx.foot.map((f, i) =>
        `<section style="${t.footItem}">[${i + 1}] ${esc(f.label)}: ${esc(f.href)}</section>`).join('') +
      `</section>`;
  }
  return `<section data-tool="claworld" style="${t.container}">${body}</section>`;
}
