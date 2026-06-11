// 默认示例文章：用内嵌 SVG 作演示图片，离线也能完整预览

function demoImg(label, c1, c2, w = 720, h = 420) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><text x="50%" y="52%" font-family="-apple-system,PingFang SC,sans-serif" font-size="34" fill="rgba(255,255,255,.92)" text-anchor="middle">${label}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

const hero = demoImg('封面大图 · Hero', '#6366f1', '#ec4899');
const g1 = demoImg('图 1', '#06b6d4', '#3b82f6', 480, 480);
const g2 = demoImg('图 2', '#10b981', '#84cc16', 480, 480);
const g3 = demoImg('图 3', '#f59e0b', '#ef4444', 480, 480);

export const SAMPLE_MD = `# 公众号排版，从此一句话搞定

![一张漂亮的封面图，alt 文本会自动变成图注](${hero})

各位好，这是 **CLAWorld 公众号排版工具** 的演示文章。它解决的核心问题只有一个：==让排版不再花时间==。写好 Markdown，选个主题，一键复制进公众号后台，所见即所得。

:::tip 三步上手
1. 左边写 Markdown（或上传 .md / .html 文件）
2. 顶部挑一个喜欢的主题，右边实时预览
3. 点「复制到公众号」，去后台 Ctrl+V
:::

## 复杂排版？都给你装好了

长文章最怕一坨文字。小标题、引用、卡片、高亮交替出现，读者才有呼吸感。

> 排版的本质不是装饰，而是控制读者的视线与节奏。
> —— 某位不愿透露姓名的编辑

需要警示信息时，换一种卡片：

:::warning 发文前检查
微信会过滤文内的外部链接。本工具默认把外链自动转成文末「参考链接」，这个行为可以在设置里关闭。
:::

### 列表也被精心对待

- 八套成品主题：清新绿、极客蓝、暖阳橙、杂志黑金、国风墨韵、梦幻紫、极简灰、薄荷手帐
- 字号、首行缩进、两端对齐、图注开关，皆可调
- ==高亮==、**加粗**、\`行内代码\`、[外部链接](https://github.com/David0936/claworld-wechat-article)各有样式

1. 有序列表的编号也是主题的一部分
2. 比如暖阳橙是圆形角标，国风墨韵是「壹、贰、叁」
3. 切换主题试试看

## 多图排版，不再竖着叠

把多张图片写在同一段落里，自动变成横排网格：

![春](${g1}) ![夏](${g2}) ![秋](${g3})

单张图片则居中展示，alt 文本自动成为图注——对图片多的文章非常友好。

## 程序员的代码块

技术号的刚需：Mac 风格窗口 + 语法高亮，全部内联样式，粘进微信不丢色。

\`\`\`javascript
// 一句话排版的核心流程
async function format(article, instruction) {
  const tokens = marked.lexer(article);
  const html = emit(tokens, theme);     // 样式全部内联
  await navigator.clipboard.write(html); // 直接粘贴进公众号
  return '搞定 ✨';
}
\`\`\`

## 数据表格

| 功能 | 秀米 | 壹伴 | 本工具 |
| --- | :-: | :-: | :-: |
| Markdown 写作 | ✗ | ✗ | ✓ |
| 代码高亮 | ✗ | ✗ | ✓ |
| AI 一句话排版 | ✗ | 部分 | ✓ |
| 免费开源 | ✗ | ✗ | ✓ |

---

:::center
**试试右上角的「AI 排版」**

填入任意一家大模型的 API Key，
说一句「把这篇文章改成适合深夜情感号的风格」，
然后看着它自己动。
:::
`;
