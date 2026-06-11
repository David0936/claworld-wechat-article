// 代码高亮配色：highlight.js 输出的是 class，微信只认内联样式，
// 所以这里维护 class -> 颜色 的映射，渲染时直接替换为 style。

export const CODE_THEMES = [
  {
    id: 'github-dark', name: 'GitHub 深色',
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
    id: 'one-dark', name: 'Atom One 深色',
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
    id: 'monokai', name: 'Monokai',
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
    id: 'github-light', name: 'GitHub 浅色',
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
];

export const codeThemeById = id => CODE_THEMES.find(t => t.id === id) || CODE_THEMES[0];

// 把 hljs 的 <span class="hljs-xxx yyy_"> 转成 <span style="color:...">
export function inlineHighlight(html, ct) {
  return html.replace(/<span class="([^"]*)"/g, (m, cls) => {
    const parts = cls.split(/\s+/).map(c => c.replace(/^hljs-/, ''));
    const scoped = parts.join('.');
    const color = ct.map[scoped] || ct.map[parts[0]] || ct.fg;
    return `<span style="color:${color}"`;
  });
}
