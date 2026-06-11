// ============================================================
// 主题系统
// 微信公众号编辑器粘贴时只保留内联样式（inline style），
// 因此所有主题样式都直接生成在元素的 style 属性里，
// 预览即所得，复制即所得。
// ============================================================

export const FONTS = {
  sans: `-apple-system,BlinkMacSystemFont,'Helvetica Neue','PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif`,
  serif: `Optima-Regular,Optima,'Noto Serif SC','Songti SC',STSongti,'SimSun',serif`,
  kai: `'Kaiti SC',STKaiti,KaiTi,'Noto Serif SC','Songti SC',serif`,
  mono: `'SF Mono',SFMono-Regular,Menlo,Consolas,'Liberation Mono','Courier New',monospace`,
};

export function rgba(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

const CARD_COLORS = {
  info: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',
};
const CARD_ICONS = { tip: '💡', info: 'ℹ️', warning: '⚠️', danger: '🚨', card: '', box: '' };
const CARD_TITLES = { tip: '小贴士', info: '提示', warning: '注意', danger: '警告' };

// 各主题的公共默认值，主题只覆盖自己个性化的部分
function base(o) {
  const tint = a => rgba(o.primary, a);
  return {
    container: `font-family:${o.font};font-size:${o.fs}px;color:${o.text};line-height:1.8;letter-spacing:.3px;word-break:break-word;text-align:left;`,
    p: `margin:1.2em 0;font-size:${o.fs}px;color:${o.text};line-height:1.85;letter-spacing:.4px;`,
    heading(level, inner, ctx) {
      const sizes = { 1: o.fs + 7, 2: o.fs + 4, 3: o.fs + 2, 4: o.fs };
      return `<h${level} style="margin:1.8em 0 1em;font-size:${sizes[level]}px;font-weight:700;color:${o.text};line-height:1.4;">${inner}</h${level}>`;
    },
    bq: `margin:1.5em 0;padding:12px 16px;background:#f7f7f7;border-left:4px solid ${o.primary};border-radius:4px;`,
    bqP: `margin:.45em 0;font-size:${o.fs - 1}px;color:#666;line-height:1.8;letter-spacing:.4px;`,
    strong: `font-weight:700;color:${o.primary};`,
    em: `font-style:italic;color:${o.text};`,
    del: `text-decoration:line-through;color:#999;`,
    codespan: `font-family:${FONTS.mono};font-size:${o.fs - 2}px;color:${o.primary};background:${tint(.08)};padding:2px 5px;border-radius:4px;margin:0 2px;`,
    mark: `background:linear-gradient(transparent 62%,${tint(.3)} 0);padding:0 2px;border-radius:2px;font-weight:inherit;`,
    link: `color:${o.primary};text-decoration:none;border-bottom:1px solid ${tint(.4)};`,
    ulMarker: () => `<span style="color:${o.primary};font-weight:700;margin-right:.55em;">•</span>`,
    olMarker: i => `<span style="color:${o.primary};font-weight:700;margin-right:.5em;font-family:${FONTS.mono};">${i}.</span>`,
    li: `margin:.5em 0;font-size:${o.fs}px;color:${o.text};line-height:1.8;letter-spacing:.4px;`,
    hr: () => `<hr style="border:none;border-top:1px solid #e5e5e5;margin:2.2em 0;">`,
    img: { radius: '8px', shadow: '0 4px 14px rgba(0,0,0,.08)', border: 'none' },
    figcaption: `font-size:${o.fs - 3}px;color:#999;margin-top:8px;letter-spacing:1px;line-height:1.6;`,
    th: `padding:9px 13px;border:1px solid #e5e7eb;background:${tint(.08)};font-weight:700;font-size:${o.fs - 1}px;color:${o.text};`,
    td: `padding:9px 13px;border:1px solid #e5e7eb;font-size:${o.fs - 1}px;color:${o.text};`,
    card(kind, title, bodyHtml) {
      const c = CARD_COLORS[kind] || o.primary;
      if (kind === 'card' || kind === 'box') {
        return `<section style="margin:1.6em 0;background:#fff;border:1px solid #ececec;border-radius:12px;padding:16px 18px;box-shadow:0 4px 16px rgba(0,0,0,.05);">${
          title ? `<section style="font-weight:700;font-size:${o.fs}px;color:${o.text};margin-bottom:8px;">${title}</section>` : ''
        }${bodyHtml}</section>`;
      }
      const icon = CARD_ICONS[kind] ?? '';
      return `<section style="margin:1.6em 0;background:${rgba(c, .07)};border:1px solid ${rgba(c, .22)};border-radius:10px;padding:13px 16px;">` +
        `<section style="font-weight:700;font-size:${o.fs - 1}px;color:${c};margin-bottom:6px;">${icon} ${title || CARD_TITLES[kind] || ''}</section>` +
        bodyHtml + `</section>`;
    },
    footTitle: `font-size:${o.fs - 1}px;font-weight:700;color:${o.text};margin:2em 0 .6em;`,
    footItem: `font-size:${o.fs - 3}px;color:#999;line-height:1.8;word-break:break-all;margin:.3em 0;`,
  };
}

function make(def) {
  return {
    ...def,
    build(o) {
      o = { ...def.defaults, ...o, font: def.defaults.font || FONTS.sans };
      const t = base(o);
      Object.assign(t, def.override(o, t));
      t.o = o;
      return t;
    },
  };
}

const CN_NUM = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾'];
const pad2 = n => String(n).padStart(2, '0');

// ------------------------------------------------------------
// 1. 清新绿 —— 微信原生感，干净克制
// ------------------------------------------------------------
const classic = make({
  id: 'classic', name: '清新绿', desc: '微信原生感，干净克制', chip: '#07c160',
  defaults: { primary: '#07c160', text: '#3f3f3f', font: FONTS.sans },
  override(o) {
    const tint = a => rgba(o.primary, a);
    return {
      heading(level, inner, ctx) {
        if (level === 1) return `<h1 style="margin:1.6em 0 1.2em;text-align:center;font-size:${o.fs + 6}px;font-weight:700;color:${o.text};line-height:1.4;"><span style="display:inline-block;border-bottom:3px solid ${o.primary};padding-bottom:8px;">${inner}</span></h1>`;
        if (level === 2) return `<h2 style="margin:2em 0 1em;font-size:${o.fs + 3}px;font-weight:700;color:${o.text};line-height:1.35;"><span style="display:inline-block;border-left:4px solid ${o.primary};padding-left:11px;">${inner}</span></h2>`;
        if (level === 3) return `<h3 style="margin:1.6em 0 .8em;font-size:${o.fs + 1}px;font-weight:700;color:${o.text};"><span style="color:${o.primary};margin-right:7px;">●</span>${inner}</h3>`;
        return `<h4 style="margin:1.4em 0 .7em;font-size:${o.fs}px;font-weight:700;color:${o.primary};">${inner}</h4>`;
      },
      bq: `margin:1.5em 0;padding:13px 16px;background:${tint(.06)};border-left:4px solid ${o.primary};border-radius:0 8px 8px 0;`,
    };
  },
});

// ------------------------------------------------------------
// 2. 极客蓝 —— 技术文风，渐变徽章
// ------------------------------------------------------------
const tech = make({
  id: 'tech', name: '极客蓝', desc: '技术文首选，渐变徽章标题', chip: '#1e80ff',
  defaults: { primary: '#1e80ff', text: '#353535', font: FONTS.sans },
  override(o) {
    const grad = `linear-gradient(135deg,${o.primary},#00c6ff)`;
    return {
      heading(level, inner, ctx) {
        if (level === 1) return `<h1 style="margin:1.6em 0 1.2em;text-align:center;font-size:${o.fs + 6}px;font-weight:800;color:#1f2329;line-height:1.45;"><span style="background:linear-gradient(transparent 64%,${rgba(o.primary, .18)} 0);padding:0 4px;">${inner}</span></h1>`;
        if (level === 2) return `<h2 style="margin:2.1em 0 1em;font-size:${o.fs + 2}px;font-weight:700;line-height:1.3;"><span style="display:inline-block;background:${grad};color:#fff;padding:6px 15px;border-radius:7px;box-shadow:0 4px 10px ${rgba(o.primary, .3)};"><span style="opacity:.8;margin-right:7px;font-family:${FONTS.mono};">#</span>${inner}</span></h2>`;
        if (level === 3) return `<h3 style="margin:1.7em 0 .8em;font-size:${o.fs + 1}px;font-weight:700;color:#1f2329;"><span style="font-family:${FONTS.mono};color:${o.primary};font-weight:800;margin-right:8px;">&gt;</span>${inner}</h3>`;
        return `<h4 style="margin:1.4em 0 .7em;font-size:${o.fs}px;font-weight:700;color:${o.primary};">${inner}</h4>`;
      },
      bq: `margin:1.5em 0;padding:13px 16px;background:#f3f8ff;border-left:4px solid ${o.primary};border-radius:0 10px 10px 0;`,
      bqP: `margin:.45em 0;font-size:${o.fs - 1}px;color:#5a6b81;line-height:1.8;`,
      img: { radius: '10px', shadow: '0 6px 18px rgba(30,128,255,.12)', border: 'none' },
    };
  },
});

// ------------------------------------------------------------
// 3. 暖阳橙 —— 秀米感，圆润胶囊，适合生活/情感号
// ------------------------------------------------------------
const warm = make({
  id: 'warm', name: '暖阳橙', desc: '秀米感圆润胶囊，生活方式号', chip: '#ff7a45',
  defaults: { primary: '#ff7a45', text: '#4a4038', font: FONTS.sans },
  override(o) {
    const tint = a => rgba(o.primary, a);
    return {
      heading(level, inner, ctx) {
        if (level === 1) return `<h1 style="margin:1.6em 0 1.2em;text-align:center;font-size:${o.fs + 6}px;font-weight:800;color:${o.text};line-height:1.45;"><span style="background:linear-gradient(transparent 60%,${tint(.3)} 0);padding:0 6px;border-radius:4px;">${inner}</span></h1>`;
        if (level === 2) return `<h2 style="margin:2.2em 0 1.1em;text-align:center;font-size:${o.fs + 2}px;font-weight:700;line-height:1.3;"><span style="display:inline-block;background:linear-gradient(135deg,#ff9a3d,#ff5e62);color:#fff;padding:7px 22px;border-radius:100px;box-shadow:0 5px 12px ${tint(.35)};"><span style="font-size:${o.fs - 3}px;opacity:.9;margin-right:8px;letter-spacing:1px;">${pad2(ctx.n2)}</span>${inner}</span></h2>`;
        if (level === 3) return `<h3 style="margin:1.7em 0 .8em;font-size:${o.fs + 1}px;font-weight:700;color:${o.text};"><span style="color:${o.primary};font-weight:800;">「</span>${inner}<span style="color:${o.primary};font-weight:800;">」</span></h3>`;
        return `<h4 style="margin:1.4em 0 .7em;font-size:${o.fs}px;font-weight:700;color:${o.primary};">${inner}</h4>`;
      },
      bq: `margin:1.6em 0;padding:15px 18px;background:#fff7ef;border:1px dashed #ffc9a8;border-radius:14px;`,
      bqP: `margin:.45em 0;font-size:${o.fs - 1}px;color:#8a6d57;line-height:1.85;`,
      hr: () => `<section style="display:flex;align-items:center;margin:2.2em 0;"><span style="flex:1;border-top:1px dashed #ffc9a8;"></span><span style="margin:0 12px;color:${o.primary};font-size:13px;">❋</span><span style="flex:1;border-top:1px dashed #ffc9a8;"></span></section>`,
      ulMarker: () => `<span style="color:${o.primary};margin-right:.55em;">✦</span>`,
      olMarker: i => `<span style="display:inline-block;min-width:1.5em;height:1.5em;line-height:1.5em;text-align:center;background:${tint(.14)};color:${o.primary};font-weight:700;font-size:${o.fs - 3}px;border-radius:50%;margin-right:.55em;">${i}</span>`,
      img: { radius: '14px', shadow: '0 6px 18px rgba(255,122,69,.15)', border: 'none' },
      figcaption: `font-size:${o.fs - 3}px;color:#b09479;margin-top:8px;letter-spacing:1px;`,
    };
  },
});

// ------------------------------------------------------------
// 4. 杂志黑金 —— 衬线高级感，深度长文
// ------------------------------------------------------------
const magazine = make({
  id: 'magazine', name: '杂志黑金', desc: '衬线高级感，深度长文', chip: '#b8965a',
  defaults: { primary: '#b8965a', text: '#222222', font: FONTS.serif },
  override(o) {
    return {
      container: `font-family:${o.font};font-size:${o.fs}px;color:${o.text};line-height:1.9;letter-spacing:.5px;word-break:break-word;text-align:left;`,
      p: `margin:1.3em 0;font-size:${o.fs}px;color:${o.text};line-height:1.95;letter-spacing:.6px;`,
      heading(level, inner, ctx) {
        if (level === 1) return `<h1 style="margin:1.8em 0 1.4em;text-align:center;line-height:1.5;"><section style="width:36px;border-top:2px solid ${o.primary};margin:0 auto 14px;"></section><span style="font-size:${o.fs + 7}px;font-weight:600;color:${o.text};letter-spacing:3px;">${inner}</span><section style="width:36px;border-top:2px solid ${o.primary};margin:14px auto 0;"></section></h1>`;
        if (level === 2) return `<h2 style="margin:2.4em 0 1.2em;text-align:center;font-size:${o.fs + 3}px;font-weight:600;color:${o.text};letter-spacing:2px;line-height:1.4;"><span style="display:inline-block;vertical-align:middle;width:44px;border-top:1px solid #d8c9ae;margin-right:14px;"></span>${inner}<span style="display:inline-block;vertical-align:middle;width:44px;border-top:1px solid #d8c9ae;margin-left:14px;"></span></h2>`;
        if (level === 3) return `<h3 style="margin:1.8em 0 .9em;font-size:${o.fs + 1}px;font-weight:600;color:${o.text};letter-spacing:1.5px;"><span style="display:inline-block;width:9px;height:9px;background:${o.primary};margin-right:10px;"></span>${inner}</h3>`;
        return `<h4 style="margin:1.5em 0 .7em;font-size:${o.fs}px;font-weight:600;color:${o.primary};letter-spacing:1px;">${inner}</h4>`;
      },
      bq: `margin:2em 0;padding:0 24px;text-align:center;border:none;background:none;`,
      bqP: `margin:.5em 0;font-size:${o.fs}px;color:#555;line-height:2;letter-spacing:1px;`,
      // 居中大引号
      bqPrefix: `<section style="text-align:center;font-family:Georgia,serif;font-size:${o.fs + 18}px;line-height:1;color:${o.primary};margin-bottom:-4px;">&ldquo;</section>`,
      strong: `font-weight:700;color:${o.text};background:linear-gradient(transparent 70%,${rgba(o.primary, .35)} 0);padding:0 1px;`,
      mark: `background:linear-gradient(transparent 70%,${rgba(o.primary, .35)} 0);padding:0 2px;`,
      hr: () => `<section style="text-align:center;margin:2.4em 0;color:#c9b893;font-size:12px;letter-spacing:8px;">◆ ◆ ◆</section>`,
      ulMarker: () => `<span style="color:${o.primary};margin-right:.6em;">—</span>`,
      olMarker: i => `<span style="color:${o.primary};font-weight:600;margin-right:.6em;font-family:Georgia,serif;">${pad2(i)}</span>`,
      img: { radius: '0', shadow: 'none', border: 'none' },
      figcaption: `font-size:${o.fs - 4}px;color:#9a9a9a;margin-top:10px;letter-spacing:2.5px;`,
      codespan: `font-family:${FONTS.mono};font-size:${o.fs - 2}px;color:#8a6d3b;background:#f7f2e9;padding:2px 5px;border-radius:3px;margin:0 2px;`,
      link: `color:#8a6d3b;text-decoration:none;border-bottom:1px solid #d8c9ae;`,
    };
  },
});

// ------------------------------------------------------------
// 5. 国风墨韵 —— 楷体 + 朱红印章，文化历史号
// ------------------------------------------------------------
const ink = make({
  id: 'ink', name: '国风墨韵', desc: '楷体朱砂印章，文化历史号', chip: '#a33b2e',
  defaults: { primary: '#a33b2e', text: '#3d3a35', font: FONTS.kai },
  override(o) {
    return {
      container: `font-family:${o.font};font-size:${o.fs}px;color:${o.text};line-height:1.9;letter-spacing:1px;word-break:break-word;text-align:left;background:#faf7f0;padding:18px 14px;border-radius:4px;`,
      p: `margin:1.25em 0;font-size:${o.fs}px;color:${o.text};line-height:2;letter-spacing:1px;`,
      heading(level, inner, ctx) {
        if (level === 1) return `<h1 style="margin:1.5em 0 1.3em;text-align:center;line-height:1.5;"><span style="display:inline-block;font-size:${o.fs + 6}px;font-weight:700;color:${o.text};letter-spacing:5px;border:1px solid #cdb98f;padding:10px 26px;">${inner}</span></h1>`;
        if (level === 2) return `<h2 style="margin:2.2em 0 1.1em;font-size:${o.fs + 2}px;font-weight:700;color:${o.text};letter-spacing:2px;line-height:1.4;"><span style="display:inline-block;background:${o.primary};color:#fdf9ee;font-size:${o.fs - 1}px;padding:4px 9px;border-radius:3px;margin-right:12px;box-shadow:2px 2px 0 ${rgba(o.primary, .25)};">${CN_NUM[(ctx.n2 - 1) % 10]}</span>${inner}</h2>`;
        if (level === 3) return `<h3 style="margin:1.7em 0 .8em;font-size:${o.fs + 1}px;font-weight:700;color:${o.text};letter-spacing:2px;"><span style="color:${o.primary};margin-right:9px;">◆</span>${inner}</h3>`;
        return `<h4 style="margin:1.4em 0 .7em;font-size:${o.fs}px;font-weight:700;color:${o.primary};letter-spacing:1px;">${inner}</h4>`;
      },
      bq: `margin:1.7em 0;padding:14px 18px;background:#f4eedd;border-left:3px solid #cdb98f;border-radius:2px;`,
      bqP: `margin:.45em 0;font-size:${o.fs - 1}px;color:#6b5d4f;line-height:2;letter-spacing:1px;`,
      strong: `font-weight:700;color:${o.primary};`,
      mark: `background:linear-gradient(transparent 60%,${rgba('#cdb98f', .45)} 0);padding:0 2px;`,
      hr: () => `<section style="text-align:center;margin:2.4em 0;color:#b9a684;font-size:14px;">﹏ ❖ ﹏</section>`,
      ulMarker: () => `<span style="color:${o.primary};margin-right:.6em;">❧</span>`,
      olMarker: i => `<span style="color:${o.primary};font-weight:700;margin-right:.6em;">${CN_NUM[(i - 1) % 10]}、</span>`,
      img: { radius: '3px', shadow: '0 3px 12px rgba(80,60,30,.18)', border: '4px solid #fff' },
      figcaption: `font-size:${o.fs - 3}px;color:#9c8b73;margin-top:10px;letter-spacing:2px;`,
      codespan: `font-family:${FONTS.mono};font-size:${o.fs - 2}px;color:${o.primary};background:#f1e9d6;padding:2px 5px;border-radius:3px;`,
      link: `color:${o.primary};text-decoration:none;border-bottom:1px dashed ${rgba(o.primary, .5)};`,
      th: `padding:9px 13px;border:1px solid #ddd0b5;background:#f1e9d6;font-weight:700;font-size:${o.fs - 1}px;color:${o.text};`,
      td: `padding:9px 13px;border:1px solid #ddd0b5;font-size:${o.fs - 1}px;color:${o.text};`,
    };
  },
});

// ------------------------------------------------------------
// 6. 梦幻紫 —— 渐变浪漫，新媒体潮流风
// ------------------------------------------------------------
const violet = make({
  id: 'violet', name: '梦幻紫', desc: '渐变浪漫，潮流新媒体', chip: '#8e5cf6',
  defaults: { primary: '#8e5cf6', text: '#3d3650', font: FONTS.sans },
  override(o) {
    const grad = `linear-gradient(135deg,${o.primary},#ec4899)`;
    return {
      heading(level, inner, ctx) {
        if (level === 1) return `<h1 style="margin:1.6em 0 1.2em;text-align:center;line-height:1.45;"><span style="font-size:${o.fs + 6}px;font-weight:800;color:#46326e;">${inner}</span><section style="width:56px;height:5px;background:${grad};border-radius:100px;margin:12px auto 0;"></section></h1>`;
        if (level === 2) return `<section style="margin:2.1em 0 1em;background:linear-gradient(90deg,${rgba(o.primary, .13)},${rgba('#ec4899', .05)});border-left:4px solid ${o.primary};border-radius:0 10px 10px 0;padding:9px 15px;"><h2 style="margin:0;font-size:${o.fs + 2}px;font-weight:800;color:#5b21b6;line-height:1.4;">${inner}</h2></section>`;
        if (level === 3) return `<h3 style="margin:1.7em 0 .8em;font-size:${o.fs + 1}px;font-weight:700;color:#46326e;"><span style="display:inline-block;width:9px;height:9px;background:${grad};border-radius:50%;margin-right:9px;"></span>${inner}</h3>`;
        return `<h4 style="margin:1.4em 0 .7em;font-size:${o.fs}px;font-weight:700;color:${o.primary};">${inner}</h4>`;
      },
      bq: `margin:1.6em 0;padding:14px 17px;background:linear-gradient(135deg,${rgba(o.primary, .07)},${rgba('#ec4899', .06)});border:1px solid ${rgba(o.primary, .18)};border-radius:14px;`,
      bqP: `margin:.45em 0;font-size:${o.fs - 1}px;color:#6d5f93;line-height:1.85;`,
      strong: `font-weight:700;color:${o.primary};`,
      mark: `background:linear-gradient(transparent 60%,${rgba('#ec4899', .25)} 0);padding:0 2px;border-radius:2px;`,
      hr: () => `<section style="margin:2.2em auto;width:120px;height:3px;background:${grad};border-radius:100px;opacity:.45;"></section>`,
      ulMarker: () => `<span style="display:inline-block;width:7px;height:7px;background:${grad};border-radius:50%;margin-right:.65em;vertical-align:2px;"></span>`,
      img: { radius: '14px', shadow: '0 8px 22px rgba(142,92,246,.18)', border: 'none' },
      figcaption: `font-size:${o.fs - 3}px;color:#a18fc9;margin-top:8px;letter-spacing:1px;`,
      link: `color:#c2419a;text-decoration:none;border-bottom:1px solid ${rgba('#ec4899', .4)};`,
    };
  },
});

// ------------------------------------------------------------
// 7. 极简灰 —— 性冷淡留白，编号章节
// ------------------------------------------------------------
const minimal = make({
  id: 'minimal', name: '极简灰', desc: '性冷淡留白，编号章节', chip: '#111827',
  defaults: { primary: '#111827', text: '#374151', font: FONTS.sans },
  override(o) {
    return {
      container: `font-family:${o.font};font-size:${o.fs}px;color:${o.text};line-height:1.85;letter-spacing:.3px;word-break:break-word;text-align:left;`,
      p: `margin:1.35em 0;font-size:${o.fs}px;color:${o.text};line-height:1.95;letter-spacing:.4px;`,
      heading(level, inner, ctx) {
        if (level === 1) return `<h1 style="margin:1.6em 0 1.3em;font-size:${o.fs + 8}px;font-weight:800;color:#111827;line-height:1.4;letter-spacing:0;">${inner}</h1>`;
        if (level === 2) return `<h2 style="margin:2.4em 0 1em;line-height:1.35;"><span style="display:block;font-family:${FONTS.mono};font-size:${o.fs - 3}px;color:#9ca3af;letter-spacing:2px;margin-bottom:6px;">${pad2(ctx.n2)} /</span><span style="font-size:${o.fs + 4}px;font-weight:800;color:#111827;">${inner}</span></h2>`;
        if (level === 3) return `<h3 style="margin:1.8em 0 .8em;font-size:${o.fs + 1}px;font-weight:700;color:#111827;"><span style="color:#9ca3af;margin-right:8px;">—</span>${inner}</h3>`;
        return `<h4 style="margin:1.5em 0 .7em;font-size:${o.fs}px;font-weight:700;color:#111827;">${inner}</h4>`;
      },
      bq: `margin:1.6em 0;padding:4px 0 4px 18px;background:none;border-left:2px solid #d1d5db;border-radius:0;`,
      bqP: `margin:.5em 0;font-size:${o.fs - 1}px;color:#6b7280;line-height:1.9;`,
      strong: `font-weight:700;color:#111827;`,
      mark: `background:linear-gradient(transparent 62%,#fde68a 0);padding:0 2px;`,
      codespan: `font-family:${FONTS.mono};font-size:${o.fs - 2}px;color:#111827;background:#f3f4f6;padding:2px 5px;border-radius:4px;`,
      link: `color:#111827;text-decoration:none;border-bottom:1.5px solid #111827;`,
      ulMarker: () => `<span style="color:#111827;font-weight:700;margin-right:.6em;">–</span>`,
      olMarker: i => `<span style="color:#9ca3af;font-family:${FONTS.mono};margin-right:.6em;">${pad2(i)}</span>`,
      hr: () => `<section style="margin:2.6em 0;border-top:1px solid #e5e7eb;"></section>`,
      img: { radius: '2px', shadow: 'none', border: '1px solid #f0f0f0' },
      figcaption: `font-size:${o.fs - 3}px;color:#9ca3af;margin-top:9px;letter-spacing:1.5px;font-family:${FONTS.mono};`,
      th: `padding:10px 13px;border-bottom:2px solid #111827;border-top:none;border-left:none;border-right:none;font-weight:700;font-size:${o.fs - 1}px;color:#111827;background:none;text-align:left;`,
      td: `padding:10px 13px;border-bottom:1px solid #e5e7eb;border-top:none;border-left:none;border-right:none;font-size:${o.fs - 1}px;color:${o.text};`,
    };
  },
});

// ------------------------------------------------------------
// 8. 薄荷手帐 —— 圆角清新，可爱日系
// ------------------------------------------------------------
const mint = make({
  id: 'mint', name: '薄荷手帐', desc: '圆角清新，日系手帐感', chip: '#14b8a6',
  defaults: { primary: '#14b8a6', text: '#41504c', font: FONTS.sans },
  override(o) {
    const tint = a => rgba(o.primary, a);
    return {
      heading(level, inner, ctx) {
        if (level === 1) return `<h1 style="margin:1.6em 0 1.2em;text-align:center;line-height:1.45;"><span style="display:inline-block;font-size:${o.fs + 5}px;font-weight:800;color:#0f766e;background:${tint(.1)};border-radius:16px;padding:8px 22px;">${inner}</span></h1>`;
        if (level === 2) return `<h2 style="margin:2.1em 0 1em;font-size:${o.fs + 2}px;font-weight:700;line-height:1.35;"><span style="display:inline-block;border:1.5px solid ${o.primary};color:#0f766e;border-radius:100px;padding:5px 17px;"><span style="display:inline-block;width:8px;height:8px;background:${o.primary};border-radius:50%;margin-right:9px;vertical-align:1px;"></span>${inner}</span></h2>`;
        if (level === 3) return `<h3 style="margin:1.7em 0 .8em;font-size:${o.fs + 1}px;font-weight:700;color:#0f766e;"><span style="display:inline-block;border-bottom:2.5px dotted #5eead4;padding-bottom:3px;">${inner}</span></h3>`;
        return `<h4 style="margin:1.4em 0 .7em;font-size:${o.fs}px;font-weight:700;color:#0f766e;">${inner}</h4>`;
      },
      bq: `margin:1.6em 0;padding:14px 17px;background:#effdfa;border:1px solid #c6f3ea;border-radius:14px;`,
      bqP: `margin:.45em 0;font-size:${o.fs - 1}px;color:#58756e;line-height:1.85;`,
      strong: `font-weight:700;color:#0d9488;`,
      mark: `background:linear-gradient(transparent 60%,${tint(.3)} 0);padding:0 2px;border-radius:2px;`,
      hr: () => `<section style="display:flex;align-items:center;justify-content:center;margin:2.2em 0;color:#99e6dd;font-size:12px;letter-spacing:6px;">∙ ∙ ∙ ∙ ∙</section>`,
      ulMarker: () => `<span style="color:${o.primary};margin-right:.55em;">✿</span>`,
      olMarker: i => `<span style="display:inline-block;min-width:1.5em;height:1.5em;line-height:1.5em;text-align:center;background:${tint(.13)};color:#0f766e;font-weight:700;font-size:${o.fs - 3}px;border-radius:8px;margin-right:.55em;">${i}</span>`,
      img: { radius: '16px', shadow: '0 6px 16px rgba(20,184,166,.14)', border: 'none' },
      figcaption: `font-size:${o.fs - 3}px;color:#7eb3a9;margin-top:8px;letter-spacing:1px;`,
    };
  },
});

export const THEMES = [classic, tech, warm, magazine, ink, violet, minimal, mint];
export const themeById = id => THEMES.find(t => t.id === id) || THEMES[0];
