// ============================================================
// AI 一句话排版：浏览器直连各家大模型 API（密钥仅存本地）
// ============================================================

export const AI_PRESETS = [
  { id: 'deepseek', name: 'DeepSeek', type: 'openai', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { id: 'kimi', name: 'Kimi 月之暗面', type: 'openai', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-32k' },
  { id: 'qwen', name: '通义千问', type: 'openai', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  { id: 'zhipu', name: '智谱 GLM', type: 'openai', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-air' },
  { id: 'claude', name: 'Claude (Anthropic)', type: 'anthropic', baseUrl: 'https://api.anthropic.com', model: 'claude-sonnet-4-6' },
  { id: 'openai', name: 'OpenAI', type: 'openai', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { id: 'custom', name: '自定义（OpenAI 兼容）', type: 'openai', baseUrl: '', model: '' },
];

export function buildSystemPrompt(themes) {
  return `你是顶级的微信公众号排版编辑，精通中文新媒体写作与排版（参考秀米、壹伴、135编辑器的审美）。
用户会给你一篇 Markdown 文章和一句排版/改写指令，你需要输出处理后的完整 Markdown。

可用的扩展语法（在标准 Markdown 之上）：
1. ==高亮文本== ：荧光笔强调
2. 卡片容器（内部支持 Markdown）：
   :::tip 可选标题
   内容
   :::
   可用类型：tip(贴士) / info(提示) / warning(注意) / danger(警告) / card(白底卡片) / center(内容居中)
3. 多图横排：把多张图片写在同一段落（同一行，空格分隔），会自动排成网格
4. 图片说明：图片的 alt 文本会显示为居中图注，如 ![这是图注](url)
5. 分隔线 --- 会渲染为主题装饰分隔符
6. 代码块、表格、引用、有序/无序列表均会被精心排版

可切换的整体主题（如需更换，在输出的第一行单独写 <!-- theme: 主题id -->）：
${themes.map(t => `- ${t.id}：${t.name}（${t.desc}）`).join('\n')}

规则：
- 只输出排版后的 Markdown 全文，不要任何解释、前言或代码围栏包裹
- 保持原文的事实、观点、数据不变，除非用户明确要求改写
- 善用小标题切分长文，重点句用 ==高亮== 或 **加粗**，关键提醒放进 :::tip 等卡片
- 中文与英文/数字之间加空格，标点规范化`;
}

function parseThemeDirective(md) {
  let theme = null;
  let out = md.trim();
  // 去掉模型可能加的围栏
  const fence = /^```(?:markdown|md)?\n([\s\S]*?)\n```$/m.exec(out);
  if (fence && fence[0].length > out.length * 0.9) out = fence[1];
  const m = /^<!--\s*theme:\s*([\w-]+)\s*-->\s*\n?/.exec(out);
  if (m) { theme = m[1]; out = out.slice(m[0].length); }
  return { theme, markdown: out };
}

async function* sseLines(resp) {
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      const s = line.trim();
      if (s.startsWith('data:')) yield s.slice(5).trim();
    }
  }
}

async function readErr(resp) {
  let detail = '';
  try { detail = (await resp.text()).slice(0, 300); } catch { /* ignore */ }
  throw new Error(`API 请求失败 (${resp.status})：${detail || resp.statusText}`);
}

export async function aiRun({ cfg, markdown, instruction, themes, onDelta }) {
  const system = buildSystemPrompt(themes);
  const user = `【排版指令】${instruction}\n\n【文章 Markdown】\n${markdown}`;
  let text = '';
  const push = d => { if (d) { text += d; onDelta?.(d, text); } };

  if (cfg.type === 'anthropic') {
    const resp = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/v1/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': cfg.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: cfg.model, max_tokens: 16000, stream: true,
        system, messages: [{ role: 'user', content: user }],
      }),
    });
    if (!resp.ok) await readErr(resp);
    for await (const data of sseLines(resp)) {
      if (data === '[DONE]') break;
      try {
        const j = JSON.parse(data);
        if (j.type === 'content_block_delta') push(j.delta?.text);
        if (j.type === 'error') throw new Error(j.error?.message || 'API 错误');
      } catch (e) { if (e instanceof SyntaxError) continue; throw e; }
    }
  } else {
    const resp = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${cfg.apiKey}` },
      body: JSON.stringify({
        model: cfg.model, stream: true,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
    });
    if (!resp.ok) await readErr(resp);
    for await (const data of sseLines(resp)) {
      if (data === '[DONE]') break;
      try { push(JSON.parse(data).choices?.[0]?.delta?.content); }
      catch (e) { if (e instanceof SyntaxError) continue; throw e; }
    }
  }

  if (!text.trim()) throw new Error('模型没有返回内容，请检查模型名称与额度');
  return parseThemeDirective(text);
}
