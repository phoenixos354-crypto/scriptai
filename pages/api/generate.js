// pages/api/generate.js
// API key dikirim dari browser per-request, TIDAK disimpan di server sama sekali.
// Server hanya jadi proxy agar key tidak terekspos di browser network tab.

const PROVIDER_CONFIGS = {
  claude: {
    url: 'https://api.anthropic.com/v1/messages',
    buildHeaders: (key) => ({
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    }),
    buildBody: (prompt) => JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
    extractText: (data) => data.content?.[0]?.text,
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    buildHeaders: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    buildBody: (prompt) => JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
    extractText: (data) => data.choices?.[0]?.message?.content,
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    buildHeaders: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    buildBody: (prompt, model) => JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
    extractText: (data) => data.choices?.[0]?.message?.content,
  },
  google: {
    url: (key, model) => `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-2.0-flash"}:generateContent?key=${key}`,
    buildHeaders: () => ({ 'Content-Type': 'application/json' }),
    buildBody: (prompt) => JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1500 },
    }),
    extractText: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text,
  },
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    buildHeaders: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://scriptai.vercel.app',
    }),
    buildBody: (prompt, model) => JSON.stringify({
      model: model || 'meta-llama/llama-3-8b-instruct',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
    extractText: (data) => data.choices?.[0]?.message?.content,
  },
  together: {
    url: 'https://api.together.xyz/v1/chat/completions',
    buildHeaders: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    buildBody: (prompt, model) => JSON.stringify({
      model: model || 'meta-llama/Llama-3-8b-chat-hf',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
    extractText: (data) => data.choices?.[0]?.message?.content,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, apiKey, provider = 'claude', model } = req.body

  if (!prompt) return res.status(400).json({ error: 'Prompt kosong' })
  if (!apiKey) return res.status(400).json({ error: 'API key tidak boleh kosong' })

  const cfg = PROVIDER_CONFIGS[provider]
  if (!cfg) return res.status(400).json({ error: `Provider "${provider}" tidak dikenali` })

  try {
    const url = typeof cfg.url === 'function' ? cfg.url(apiKey, model) : cfg.url
    const headers = cfg.buildHeaders(apiKey)
    const body = cfg.buildBody(prompt, model)

    const response = await fetch(url, { method: 'POST', headers, body })

    // API key sudah tidak dibutuhkan lagi, tidak disimpan ke mana pun
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      const msg = err.error?.message || err.message || `HTTP ${response.status}`
      return res.status(response.status).json({ error: msg })
    }

    const data = await response.json()
    const text = cfg.extractText(data)

    if (!text) return res.status(500).json({ error: 'Response AI kosong atau tidak terbaca' })

    return res.status(200).json({ result: text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
