# CLAWorld · 公众号排版

一个面向微信公众号的 Markdown 排版工具：写 Markdown → 挑主题 → 一键复制进公众号后台，**所见即所得**。
纯静态页面，零依赖 CDN，开箱即用；对标 [doocs/md](https://github.com/doocs/md)、秀米、壹伴的排版审美，但完全免费开源。

打开 `demo/showcase.html` 可直接预览全部主题效果。

## ✨ 功能

- **八套成品主题**，覆盖不同号的气质：
  | 主题 | 适合 |
  | --- | --- |
  | 清新绿 | 微信原生感，通用 |
  | 极客蓝 | 技术号，渐变徽章标题 |
  | 暖阳橙 | 生活方式/情感号，秀米感圆润胶囊 |
  | 杂志黑金 | 深度长文，衬线高级感 |
  | 国风墨韵 | 文化历史号，楷体 + 朱砂印章序号 |
  | 梦幻紫 | 潮流新媒体，渐变浪漫 |
  | 极简灰 | 性冷淡留白，编号章节 |
  | 薄荷手帐 | 日系清新，圆角可爱 |
- **代码高亮**：Mac 风格窗口 + 4 套配色（GitHub 深/浅、One Dark、Monokai），样式全内联，粘进微信不丢色；**没标语言的代码块会自动识别语言并高亮**
- **智能识别地址**：正文里的纯图片地址（`.jpg/.png/.webp…`）自动渲染成图片（多个连排成网格），其它网址自动转文末「参考链接」
- **多图友好**：同一段落写多张图自动横排成网格；图片 `alt` 自动变成居中图注
- **复杂排版语法**：`==高亮==`、`:::tip / info / warning / danger / card / center` 卡片容器、装饰分隔线、表格、任务列表
- **AI 一句话排版**：填入任意一家大模型 API Key（DeepSeek / Kimi / 通义 / 智谱 / OpenAI / Claude / 任意 OpenAI 兼容接口），说一句"把这篇排得适合深夜情感号"，AI 流式重排全文、还能自动换主题；密钥只存在本机浏览器
- **导入导出**：上传/拖入 `.md`、`.html`（自动转 Markdown）、图片（转 Base64 预览）；导出 MD / 完整 HTML
- **细节开关**：字号、主色调、首行缩进、两端对齐、图注、外链自动转文末「参考链接」（规避微信外链限制）
- 草稿自动保存在浏览器本地

## 🚀 使用

无需构建，直接静态托管：

```bash
# 本地预览
npm run serve            # 或 python3 -m http.server 8080
# 打开 http://localhost:8080
```

部署到 GitHub Pages：仓库 Settings → Pages → Source 选 `main` 分支根目录即可。

日常流程：

1. 左侧写 Markdown（或点「上传文件」导入 .md / .html）
2. 顶部选主题，右侧手机框实时预览
3. 点「复制到公众号」（或 `Ctrl/Cmd + Enter`），到公众号后台编辑器里粘贴

> 提示：微信不会上传 Base64 图片，正式发布时图片请使用 http(s) 外链（微信粘贴时会自动转存），或先传到图床。

## 📝 扩展语法速查

```markdown
==荧光笔高亮==

:::tip 可选标题
卡片内容，支持 **Markdown**
:::
（类型：tip / info / warning / danger / card / center）

多图横排：同一段落放多张图
![春](url1) ![夏](url2) ![秋](url3)

图注：alt 文本自动成为居中图注
![这句话会显示在图片下方](url)
```

## 🛠 技术说明

- 微信编辑器粘贴时只保留**内联样式**，所以渲染引擎（`src/renderer.js`）基于 marked 的 token 树自行发射 HTML，所有样式直接写进 `style` 属性，预览即最终效果
- 代码高亮由 highlight.js 完成后，把 class 映射为内联颜色（`src/codeThemes.js`）
- 依赖（marked / highlight.js / turndown）已打包进 `vendor/`，运行时不请求任何 CDN；如需升级依赖，改动后执行 `npm run vendor` 重新打包
- 主题定义在 `src/themes.js`，新增一套主题只需照着现有主题写一个 `make({...})`

```bash
npm test     # 渲染冒烟测试：全部主题 × 选项组合 × 边界用例
```

## 目录结构

```
index.html        应用入口
styles.css        应用界面样式（与文章主题无关）
src/
  themes.js       八套文章主题（内联样式生成器）
  codeThemes.js   代码高亮配色（class → 内联颜色）
  renderer.js     Markdown → 内联 HTML 渲染引擎
  ai.js           AI 一句话排版（多服务商、流式）
  main.js         界面逻辑
  sample.js       示例文章
vendor/           本地化的第三方库（marked / highlight.js / turndown）
demo/showcase.html  全主题静态预览
test/             渲染测试
```
