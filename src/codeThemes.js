// 代码高亮配色：highlight.js 输出的是 class，微信只认内联样式，
// 所以这里维护 class -> 颜色 的映射，渲染时直接替换为 style。

export const CODE_THEMES = [
  {
    id: 'github-dark', name: 'GitHub 深色', desc: '技术号通用 · 沉稳',
    bg: '#0d1117', fg: '#c9d1d9', barBg: '#161b22', langColor: '#8b949e',
    map: {
      'keyword': '#ff7b72', 'built_in': '#ffa657', 'type': '#ffa657', 'literal': '#79c0ff',
      'number': '#79c0ff', 'regexp': '#a5d6ff', 'string': '#a5d6ff', 'subst': '#c9d1d9',
      'symbol': '#79c0ff', 'class': '#f0883e', 'function': '#d2a8ff', 'title': '#d2a8ff',
      'title.function_': '#d2a8ff', 'title.class_': '#f0883e', 'title.class_.inherited__': '#f0883e',
      'params': '#c9d1d9', 'comment': '#8b949e', 'doctag': '#ff7b72', 'meta': '#79c0ff',
      'section': '#1f6feb', 'tag': '#7ee787', 'name': '#7ee787', 'attr': '#79c0ff',
      'attribute': '#79c0ff', 'variable': '#ffa657', 'bullet': '#79c0ff', 'code': '#a5d6ff',
      'emphasis': '#c9d1d9', 'strong': '#c9d1d9', 'formula': '#a5d6ff', 'link': '#a5d6ff',
      'quote': '#7ee787', 'selector-tag': '#7ee787', 'selector-id': '#79c0ff',
      'selector-class': '#79c0ff', 'selector-attr': '#79c0ff', 'selector-pseudo': '#79c0ff',
      'template-tag': '#ff7b72', 'template-variable': '#ff7b72', 'addition': '#aff5b4',
      'deletion': '#ffdcd7', 'operator': '#ff7b72', 'property': '#79c0ff', 'punctuation': '#c9d1d9',
      'char.escape_': '#79c0ff',
    },
  },
  {
    id: 'one-dark', name: 'Atom One 深色', desc: '柔和护眼 · 经典',
    bg: '#282c34', fg: '#abb2bf', barBg: '#21252b', langColor: '#7f848e',
    map: {
      'keyword': '#c678dd', 'built_in': '#e6c07b', 'type': '#e6c07b', 'literal': '#56b6c2',
      'number': '#d19a66', 'regexp': '#98c379', 'string': '#98c379', 'subst': '#e06c75',
      'symbol': '#61aeee', 'class': '#e6c07b', 'function': '#61afef', 'title': '#61afef',
      'title.function_': '#61afef', 'title.class_': '#e6c07b', 'params': '#abb2bf',
      'comment': '#5c6370', 'doctag': '#c678dd', 'meta': '#61aeee', 'section': '#e06c75',
      'tag': '#e06c75', 'name': '#e06c75', 'attr': '#d19a66', 'attribute': '#98c379',
      'variable': '#d19a66', 'bullet': '#61aeee', 'code': '#98c379', 'formula': '#98c379',
      'link': '#61aeee', 'quote': '#98c379', 'selector-tag': '#e06c75', 'selector-id': '#61aeee',
      'selector-class': '#d19a66', 'selector-attr': '#c678dd', 'selector-pseudo': '#c678dd',
      'template-tag': '#c678dd', 'template-variable': '#c678dd', 'addition': '#98c379',
      'deletion': '#e06c75', 'operator': '#56b6c2', 'property': '#d19a66', 'punctuation': '#abb2bf',
    },
  },
  {
    id: 'monokai', name: 'Monokai', desc: '高饱和 · 活泼',
    bg: '#272822', fg: '#f8f8f2', barBg: '#1e1f1c', langColor: '#90908a',
    map: {
      'keyword': '#f92672', 'built_in': '#66d9ef', 'type': '#66d9ef', 'literal': '#ae81ff',
      'number': '#ae81ff', 'regexp': '#e6db74', 'string': '#e6db74', 'subst': '#f8f8f2',
      'symbol': '#ae81ff', 'class': '#a6e22e', 'function': '#a6e22e', 'title': '#a6e22e',
      'title.function_': '#a6e22e', 'title.class_': '#a6e22e', 'params': '#fd971f',
      'comment': '#75715e', 'doctag': '#f92672', 'meta': '#75715e', 'section': '#a6e22e',
      'tag': '#f92672', 'name': '#f92672', 'attr': '#a6e22e', 'attribute': '#a6e22e',
      'variable': '#f8f8f2', 'bullet': '#ae81ff', 'code': '#e6db74', 'formula': '#e6db74',
      'link': '#66d9ef', 'quote': '#e6db74', 'selector-tag': '#f92672', 'selector-id': '#a6e22e',
      'selector-class': '#a6e22e', 'selector-attr': '#66d9ef', 'selector-pseudo': '#66d9ef',
      'template-tag': '#f92672', 'template-variable': '#f92672', 'addition': '#a6e22e',
      'deletion': '#f92672', 'operator': '#f92672', 'property': '#66d9ef', 'punctuation': '#f8f8f2',
    },
  },
  {
    id: 'github-light', name: 'GitHub 浅色', desc: '清爽白底 · 干净',
    bg: '#f6f8fa', fg: '#24292e', barBg: '#eaeef2', langColor: '#6a737d',
    map: {
      'keyword': '#d73a49', 'built_in': '#e36209', 'type': '#e36209', 'literal': '#005cc5',
      'number': '#005cc5', 'regexp': '#032f62', 'string': '#032f62', 'subst': '#24292e',
      'symbol': '#005cc5', 'class': '#6f42c1', 'function': '#6f42c1', 'title': '#6f42c1',
      'title.function_': '#6f42c1', 'title.class_': '#6f42c1', 'params': '#24292e',
      'comment': '#6a737d', 'doctag': '#d73a49', 'meta': '#005cc5', 'section': '#005cc5',
      'tag': '#22863a', 'name': '#22863a', 'attr': '#005cc5', 'attribute': '#005cc5',
      'variable': '#e36209', 'bullet': '#735c0f', 'code': '#032f62', 'formula': '#032f62',
      'link': '#032f62', 'quote': '#22863a', 'selector-tag': '#22863a', 'selector-id': '#005cc5',
      'selector-class': '#005cc5', 'selector-attr': '#005cc5', 'selector-pseudo': '#005cc5',
      'template-tag': '#d73a49', 'template-variable': '#d73a49', 'addition': '#22863a',
      'deletion': '#b31d28', 'operator': '#d73a49', 'property': '#005cc5', 'punctuation': '#24292e',
    },
  },
  {
    id: 'dracula', name: 'Dracula', desc: '紫调暗黑 · 时髦',
    bg: '#282a36', fg: '#f8f8f2', barBg: '#21222c', langColor: '#6272a4',
    map: {
      'keyword': '#ff79c6', 'built_in': '#8be9fd', 'type': '#8be9fd', 'literal': '#bd93f9',
      'number': '#bd93f9', 'regexp': '#f1fa8c', 'string': '#f1fa8c', 'subst': '#f8f8f2',
      'symbol': '#bd93f9', 'class': '#8be9fd', 'function': '#50fa7b', 'title': '#50fa7b',
      'title.function_': '#50fa7b', 'title.class_': '#8be9fd', 'params': '#ffb86c',
      'comment': '#6272a4', 'doctag': '#ff79c6', 'meta': '#bd93f9', 'section': '#50fa7b',
      'tag': '#ff79c6', 'name': '#ff79c6', 'attr': '#50fa7b', 'attribute': '#50fa7b',
      'variable': '#f8f8f2', 'bullet': '#bd93f9', 'code': '#f1fa8c', 'link': '#8be9fd',
      'quote': '#f1fa8c', 'selector-tag': '#ff79c6', 'selector-id': '#50fa7b',
      'selector-class': '#50fa7b', 'selector-attr': '#bd93f9', 'selector-pseudo': '#bd93f9',
      'template-tag': '#ff79c6', 'template-variable': '#ff79c6', 'addition': '#50fa7b',
      'deletion': '#ff5555', 'operator': '#ff79c6', 'property': '#8be9fd', 'punctuation': '#f8f8f2',
    },
  },
  {
    id: 'nord', name: 'Nord', desc: '冷蓝极简 · 高级',
    bg: '#2e3440', fg: '#d8dee9', barBg: '#272c36', langColor: '#4c566a',
    map: {
      'keyword': '#81a1c1', 'built_in': '#8fbcbb', 'type': '#8fbcbb', 'literal': '#81a1c1',
      'number': '#b48ead', 'regexp': '#ebcb8b', 'string': '#a3be8c', 'subst': '#d8dee9',
      'symbol': '#b48ead', 'class': '#8fbcbb', 'function': '#88c0d0', 'title': '#88c0d0',
      'title.function_': '#88c0d0', 'title.class_': '#8fbcbb', 'params': '#d8dee9',
      'comment': '#616e88', 'doctag': '#81a1c1', 'meta': '#5e81ac', 'section': '#88c0d0',
      'tag': '#81a1c1', 'name': '#81a1c1', 'attr': '#8fbcbb', 'attribute': '#d8dee9',
      'variable': '#d8dee9', 'bullet': '#b48ead', 'code': '#a3be8c', 'link': '#88c0d0',
      'quote': '#a3be8c', 'selector-tag': '#81a1c1', 'selector-id': '#88c0d0',
      'selector-class': '#8fbcbb', 'selector-attr': '#b48ead', 'selector-pseudo': '#b48ead',
      'template-tag': '#81a1c1', 'template-variable': '#81a1c1', 'addition': '#a3be8c',
      'deletion': '#bf616a', 'operator': '#81a1c1', 'property': '#8fbcbb', 'punctuation': '#d8dee9',
    },
  },
  {
    id: 'vscode-dark', name: 'VS Code 深色', desc: '编辑器原味 · 熟悉',
    bg: '#1e1e1e', fg: '#d4d4d4', barBg: '#252526', langColor: '#858585',
    map: {
      'keyword': '#569cd6', 'built_in': '#4ec9b0', 'type': '#4ec9b0', 'literal': '#569cd6',
      'number': '#b5cea8', 'regexp': '#d16969', 'string': '#ce9178', 'subst': '#d4d4d4',
      'symbol': '#b5cea8', 'class': '#4ec9b0', 'function': '#dcdcaa', 'title': '#dcdcaa',
      'title.function_': '#dcdcaa', 'title.class_': '#4ec9b0', 'params': '#9cdcfe',
      'comment': '#6a9955', 'doctag': '#569cd6', 'meta': '#569cd6', 'section': '#dcdcaa',
      'tag': '#569cd6', 'name': '#569cd6', 'attr': '#9cdcfe', 'attribute': '#9cdcfe',
      'variable': '#9cdcfe', 'bullet': '#b5cea8', 'code': '#ce9178', 'link': '#ce9178',
      'quote': '#6a9955', 'selector-tag': '#d7ba7d', 'selector-id': '#d7ba7d',
      'selector-class': '#d7ba7d', 'selector-attr': '#569cd6', 'selector-pseudo': '#569cd6',
      'template-tag': '#569cd6', 'template-variable': '#569cd6', 'addition': '#b5cea8',
      'deletion': '#d16969', 'operator': '#d4d4d4', 'property': '#9cdcfe', 'punctuation': '#d4d4d4',
    },
  },
  {
    id: 'solarized-light', name: 'Solarized 浅色', desc: '暖纸护眼 · 文艺',
    bg: '#fdf6e3', fg: '#657b83', barBg: '#eee8d5', langColor: '#93a1a1',
    map: {
      'keyword': '#859900', 'built_in': '#b58900', 'type': '#b58900', 'literal': '#2aa198',
      'number': '#2aa198', 'regexp': '#2aa198', 'string': '#2aa198', 'subst': '#657b83',
      'symbol': '#cb4b16', 'class': '#b58900', 'function': '#268bd2', 'title': '#268bd2',
      'title.function_': '#268bd2', 'title.class_': '#b58900', 'params': '#657b83',
      'comment': '#93a1a1', 'doctag': '#859900', 'meta': '#cb4b16', 'section': '#268bd2',
      'tag': '#268bd2', 'name': '#268bd2', 'attr': '#b58900', 'attribute': '#b58900',
      'variable': '#cb4b16', 'bullet': '#2aa198', 'code': '#2aa198', 'link': '#268bd2',
      'quote': '#2aa198', 'selector-tag': '#268bd2', 'selector-id': '#268bd2',
      'selector-class': '#b58900', 'selector-attr': '#859900', 'selector-pseudo': '#859900',
      'template-tag': '#859900', 'template-variable': '#859900', 'addition': '#859900',
      'deletion': '#dc322f', 'operator': '#859900', 'property': '#268bd2', 'punctuation': '#657b83',
    },
  },
];

export const codeThemeById = id => CODE_THEMES.find(t => t.id === id) || CODE_THEMES[0];

// 颜色明暗调节：amt>0 变亮，amt<0 变暗（用于「跟随主题」配色）
function shade(hex, amt) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const f = c => {
    const v = amt >= 0 ? c + (255 - c) * amt : c * (1 + amt);
    return Math.max(0, Math.min(255, Math.round(v)));
  };
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// 「跟随主题」：代码配色随文章主色变化（浅纸底，主色当关键字主调），
// 保证任意主色都在浅底上可读
export function buildFollowTheme(primary) {
  const kw = shade(primary, -0.15);   // 关键字：主色压暗一点，提高对比
  const fn = shade(primary, -0.4);    // 函数名：更深
  const accent = '#9a6700';           // 字符串/数字：暖金，与多数主色互补
  return {
    id: 'follow', name: '跟随主题', desc: '配色跟随文章主色',
    bg: '#fbfbfa', fg: '#383a42', barBg: '#f0f0ee', langColor: '#a8a29e',
    map: {
      'keyword': kw, 'built_in': fn, 'type': fn, 'literal': kw,
      'number': accent, 'regexp': '#3d7a3d', 'string': '#3d7a3d', 'subst': '#383a42',
      'symbol': accent, 'class': fn, 'function': fn, 'title': fn,
      'title.function_': fn, 'title.class_': fn, 'params': '#383a42',
      'comment': '#a8a29e', 'doctag': kw, 'meta': kw, 'section': fn,
      'tag': kw, 'name': kw, 'attr': accent, 'attribute': accent,
      'variable': accent, 'bullet': accent, 'code': '#3d7a3d', 'link': fn,
      'quote': '#3d7a3d', 'selector-tag': kw, 'selector-id': fn,
      'selector-class': accent, 'selector-attr': kw, 'selector-pseudo': kw,
      'template-tag': kw, 'template-variable': kw, 'addition': '#3d7a3d',
      'deletion': '#c0392b', 'operator': kw, 'property': fn, 'punctuation': '#383a42',
    },
  };
}

// 把 hljs 的 <span class="hljs-xxx yyy_"> 转成 <span style="color:...">
export function inlineHighlight(html, ct) {
  return html.replace(/<span class="([^"]*)"/g, (m, cls) => {
    const parts = cls.split(/\s+/).map(c => c.replace(/^hljs-/, ''));
    const scoped = parts.join('.');
    const color = ct.map[scoped] || ct.map[parts[0]] || ct.fg;
    return `<span style="color:${color}"`;
  });
}
