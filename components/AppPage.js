import { useState } from 'react'

const GAYA_VIDEO = [
  'Review Jujur','Storytelling Pengalaman','Soft Selling','Hard Selling',
  'Demo Produk','Tutorial','3 Alasan Wajib Punya','Comparison / Perbandingan',
  'Life Hack','POV (Point of View)','Before After','Reaction Pertama Mencoba',
  'Unboxing Produk','Problem Solution','Testimoni Viral','Ekspektasi vs Realita',
  'Edukasi + Produk','Trend Challenge','Rating / Skoring Produk','Day in My Life ft. Produk',
]
const GAYA_BAHASA = [
  'Informatif / Edukatif','Storytelling','Persuasif','Santai / Conversational',
  'Humor / Komedi','Dramatis','Inspiratif / Motivasi','Naratif Profesional',
  'Provokatif','Clickbait Hook','Tutorial / Step-by-Step','Review / Opini',
  'Story Confession','Fakta Unik / Fun Facts','Analisis / Deep Explanation',
  'Argumentatif','Satire / Sindiran','Emotional Story',
  'ASMR / Slow & Calm','Hype / Energetic','Whisper Secret','Gen-Z Slang',
]
const RUMUS_SCRIPT = [
  'Hook (Masalah) → Penjelasan → Solusi → CTA',
  'Hook → Cerita → Hasil → CTA',
  'Hook → Demo Produk → Benefit → CTA',
  'Hook → Kesalahan Umum → Solusi Produk → CTA',
  'Hook → Before → After → CTA',
  'Hook → Fakta Mengejutkan → Edukasi → CTA',
  'Hook → Review Jujur → Benefit → CTA',
  'Hook → Tutorial Cepat → Produk → CTA',
  'Hook → Reaction Pertama Mencoba → Benefit → CTA',
  'Hook → Problem → Testimoni → CTA',
  'Hook → Kelebihan → Kekurangan → Kesimpulan → CTA',
  'Hook → Alasan 1 → Alasan 2 → Alasan 3 → CTA',
  'Hook → Produk A → Produk B → Kesimpulan → CTA',
  'Hook → Tips → Demo → CTA',
  'Hook → Buka Produk → Reaksi → CTA',
  'Hook → Pertanyaan → Jawaban → Produk → CTA',
  'Hook → Mitos → Fakta → Produk → CTA',
  'Hook → Pengalaman Pribadi → Transformasi → CTA',
  'Hook → Statistik / Data → Solusi → CTA',
  'Hook → Ekspektasi → Realita → Kejutan → CTA',
  'Hook → Pain Point → Empati → Solusi → CTA',
]
const PROVIDERS = {
  claude:     { label: 'Claude', placeholder: 'sk-ant-api03-...', hasModel: false },
  openai:     { label: 'OpenAI', placeholder: 'sk-proj-...', hasModel: false },
  groq:       { label: 'Groq', placeholder: 'gsk_...', hasModel: false },
  google:     { label: 'Google Gemini', placeholder: 'AIza...', hasModel: true,
    models: ['gemini-2.0-flash','gemini-2.0-flash-lite','gemini-1.5-flash','gemini-1.5-flash-8b'] },
  openrouter: { label: 'OpenRouter', placeholder: 'sk-or-v1-...', hasModel: true,
    models: ['meta-llama/llama-3-8b-instruct','meta-llama/llama-3-70b-instruct','openai/gpt-4o','anthropic/claude-3.5-sonnet','deepseek/deepseek-chat','qwen/qwen-2-72b-instruct','google/gemma-7b-it','mistralai/mistral-7b-instruct'] },
  together:   { label: 'Together AI', placeholder: 'tok-...', hasModel: true,
    models: ['meta-llama/Llama-3-8b-chat-hf','meta-llama/Llama-3-70b-chat-hf','mistralai/Mistral-7B-Instruct-v0.3','mistralai/Mixtral-8x7B-Instruct-v0.1','Qwen/Qwen2-72B-Instruct','google/gemma-2-27b-it','deepseek-ai/deepseek-llm-67b-chat'] },
}

function get(key, fb) { try { return localStorage.getItem(key) || fb } catch { return fb } }

function buildPrompt({ nama, fitur, gaVid, gaBhs, rumus, aiVid, aiBhs, aiRumus }) {
  const gv = aiVid ? 'PILIHKAN gaya video yang paling cocok dan berpotensi viral untuk produk ini' : (gaVid || 'fleksibel')
  const gb = aiBhs ? 'PILIHKAN gaya bahasa yang paling engaging dan viral untuk produk ini' : (gaBhs || 'persuasif dan santai')

  const daftarRumus = `Hook (Masalah) → Penjelasan → Solusi → CTA
Hook → Cerita → Hasil → CTA
Hook → Demo Produk → Benefit → CTA
Hook → Kesalahan Umum → Solusi Produk → CTA
Hook → Before → After → CTA
Hook → Fakta Mengejutkan → Edukasi → CTA
Hook → Review Jujur → Benefit → CTA
Hook → Tutorial Cepat → Produk → CTA
Hook → Reaction Pertama Mencoba → Benefit → CTA
Hook → Problem → Testimoni → CTA
Hook → Kelebihan → Kekurangan → Kesimpulan → CTA
Hook → Alasan 1 → Alasan 2 → Alasan 3 → CTA
Hook → Produk A → Produk B → Kesimpulan → CTA
Hook → Tips → Demo → CTA
Hook → Buka Produk → Reaksi → CTA
Hook → Pertanyaan → Jawaban → Produk → CTA
Hook → Mitos → Fakta → Produk → CTA
Hook → Pengalaman Pribadi → Transformasi → CTA
Hook → Statistik / Data → Solusi → CTA
Hook → Ekspektasi → Realita → Kejutan → CTA
Hook → Pain Point → Empati → Solusi → CTA`

  const rsInstruction = aiRumus
    ? `PILIHKAN satu rumus dari daftar berikut yang paling cocok dan berpotensi viral untuk produk ini:
${daftarRumus}
Setelah memilih, gunakan label dari rumus tersebut untuk setiap bagian script.`
    : `Gunakan rumus: ${rumus || 'Hook → Penjelasan → Solusi → CTA'}
Gunakan label dari rumus tersebut untuk setiap bagian script.`

  const aiPickNote = (aiVid || aiBhs || aiRumus)
    ? `\n\nINFO AI PICK: Untuk setiap script, tulis 1 baris info di paling atas sebelum script dimulai:
» Gaya Video: [nama gaya] | Gaya Bahasa: [nama gaya] | Rumus: [rumus yang dipilih]`
    : ''

  return `Kamu adalah copywriter video affiliate Shopee terbaik Indonesia yang ahli membuat konten viral di TikTok dan Shopee Video.

Produk: ${nama}
${fitur ? 'Detail produk:\n' + fitur : ''}

Buat TEPAT 5 script voice over video affiliate:
- Gaya video: ${gv}
- Gaya bahasa: ${gb}
- ${rsInstruction}
- Durasi: ±15 detik per script (40–60 kata)
- Bahasa Indonesia yang natural, tidak kaku
- Setiap script WAJIB diawali Hook kuat yang bikin orang berhenti scroll dalam 3 detik pertama
- Setiap script WAJIB diakhiri CTA: "klik beli sekarang, link di keranjang kuning!"
${aiPickNote}

ATURAN FORMAT — Setiap bagian script diberi label dalam kurung kotak sesuai rumus yang dipakai.
Contoh untuk rumus "Hook (Masalah) → Penjelasan → Solusi → CTA":
[HOOK] Pernah kesel gak sih ngecat rumah tapi catnya encer banget, jadi harus berkali-kali lapis?
[PENJELASAN] Gila sih, ini pas gue buka kalengnya... langsung kerasa bedanya sama cat biasa.
[SOLUSI] Ini Avitex Wizz Interior, 40% lebih kental dari cat kebanyakan. Sekali poles langsung nutup sempurna!
[CTA] Langsung cek keranjang kuning buat buktiin sendiri efisiensinya!

Contoh untuk rumus "Hook → Before → After → CTA":
[HOOK] Dulu tiap pakai rok selalu deg-degan, takut tembus pandang...
[BEFORE] Udah coba banyak rok tapi tetep aja tipis dan gak nyaman dipakai seharian.
[AFTER] Sejak pakai Naomi Kawaii Skirt, tenang banget! Ada furing tebel, bahan premium, gak kaku.
[CTA] Buktiin sendiri, klik beli sekarang link di keranjang kuning!

Label harus PERSIS mengikuti nama-nama di rumus yang dipilih (dalam huruf kapital, tanpa spasi → gunakan underscore jika perlu, misal ALASAN_1, SOLUSI_PRODUK, dll).

Format output WAJIB:

SCRIPT 1:
[isi label dan teks sesuai rumus]

SCRIPT 2:
[isi label dan teks sesuai rumus]

SCRIPT 3:
[isi label dan teks sesuai rumus]

SCRIPT 4:
[isi label dan teks sesuai rumus]

SCRIPT 5:
[isi label dan teks sesuai rumus]`
}

function parseScripts(text) {
  const list = []
  const re = /SCRIPT\s*\d+\s*:\s*([\s\S]*?)(?=SCRIPT\s*\d+\s*:|$)/gi
  let m
  while ((m = re.exec(text)) !== null) { const t = m[1].trim(); if (t) list.push(t) }
  return list
}

export default function AppPage({ user, onLogout }) {
  const [provider, setProvider] = useState(() => get('sai_prov','claude'))
  const [apiKey, setApiKey]     = useState(() => get('sai_key',''))
  const [model, setModel] = useState(() => {
    const savedProvider = get('sai_prov','claude')
    return PROVIDERS[savedProvider]?.models?.[0] || ''
  })
  const [showKey, setShowKey]   = useState(false)
  const [nama, setNama]     = useState('')
  const [fitur, setFitur]   = useState('')
  const [gaVid, setGaVid]   = useState('')
  const [gaBhs, setGaBhs]   = useState('')
  const [rumus, setRumus]   = useState('')
  const [aiVid, setAiVid]   = useState(false)
  const [aiBhs, setAiBhs]   = useState(false)
  const [aiRumus, setAiRumus] = useState(false)
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [copied, setCopied]   = useState({})

  function onProvider(p) {
    const defaultModel = PROVIDERS[p]?.models?.[0] || ''
    setProvider(p)
    setModel(defaultModel)
    try { localStorage.setItem('sai_prov',p) } catch {}
  }
  function onApiKey(v)   { setApiKey(v);   try { localStorage.setItem('sai_key',v) } catch {} }

  async function generate() {
    if (!nama.trim())   return setError('Masukkan nama produk!')
    if (!apiKey.trim()) return setError('Masukkan API key terlebih dahulu!')
    setError(''); setLoading(true); setScripts([])
    try {
      const prompt = buildPrompt({ nama, fitur, gaVid, gaBhs, rumus, aiVid, aiBhs, aiRumus })
      // Key dikirim ke /api/generate (server kita, HTTPS)
      // Server jadi proxy ke AI provider — key tidak disimpan di server sama sekali
      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey, provider, model }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generate gagal')
      const parsed = parseScripts(data.result)
      setScripts(parsed.length ? parsed : [data.result])
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  function copyOne(idx, text) {
    navigator.clipboard.writeText(text)
    setCopied(c => ({ ...c, [idx]: true }))
    setTimeout(() => setCopied(c => ({ ...c, [idx]: false })), 2000)
  }
  function copyAll() {
    navigator.clipboard.writeText(scripts.map((sc,i) => `SCRIPT ${i+1}:\n${sc}`).join('\n\n'))
    setCopied({ all: true }); setTimeout(() => setCopied({}), 2000)
  }
  function reset() {
    setNama(''); setFitur(''); setGaVid(''); setGaBhs(''); setRumus('')
    setAiVid(false); setAiBhs(false); setAiRumus(false); setScripts([]); setError('')
  }

  const cfg = PROVIDERS[provider]

  return (
    <div style={S.page}>
      <div style={S.bg1}/><div style={S.bg2}/>

      <div style={S.topbar}>
        <span style={S.logo}>Script<span style={{color:'#ff3c6e'}}>AI</span></span>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <span style={S.userBadge}>✦ {user}</span>
          <button style={S.logoutBtn} onClick={onLogout}>Keluar</button>
        </div>
      </div>

      <div style={S.hero}>
        <h1 style={S.h1}>Generate Script Video<br/><span style={S.grad}>Affiliate yang Viral</span></h1>
        <p style={{color:'#6b6b82',fontSize:'1rem'}}>5 script siap pakai dalam hitungan detik.</p>
      </div>

      <div style={S.container}>
        <div style={S.grid}>
          {/* ── LEFT ── */}
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>

            {/* Provider Card */}
            <div style={S.card}>
              <div style={S.cardTitle}><span style={S.dot}/>Konfigurasi AI</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'14px'}}>
                {Object.entries(PROVIDERS).map(([k,c]) => (
                  <button key={k} onClick={() => onProvider(k)}
                    style={{...S.tab, ...(provider===k ? S.tabActive : {})}}>
                    {c.label}
                  </button>
                ))}
              </div>

              <div style={{marginBottom:'14px'}}>
                <label style={S.label}>API Key — {cfg.label}</label>
                <div style={{position:'relative'}}>
                  <input type={showKey?'text':'password'} value={apiKey}
                    onChange={e => onApiKey(e.target.value)}
                    placeholder={cfg.placeholder}
                    style={{...S.input, paddingRight:'44px', fontFamily:'monospace', fontSize:'0.82rem', letterSpacing:'0.04em'}}
                  />
                  <button type="button" onClick={() => setShowKey(!showKey)} style={S.eyeBtn}>
                    {showKey ? '🙈' : '👁'}
                  </button>
                </div>
                <p style={{fontSize:'0.7rem',color:'#6b6b82',marginTop:'5px'}}>
                  🔒 Key dikirim terenkripsi ke server, tidak pernah disimpan.
                </p>
              </div>

              {cfg.hasModel && (
                <div>
                  <label style={S.label}>Pilih Model</label>
                  <select value={model} onChange={e => setModel(e.target.value)} style={S.input}>
                    <option value="">-- Pilih model --</option>
                    {cfg.models.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Produk Card */}
            <div style={S.card}>
              <div style={S.cardTitle}><span style={{...S.dot,background:'#ff8c42',boxShadow:'0 0 8px #ff8c42'}}/>Input Produk</div>

              <div style={{marginBottom:'14px'}}>
                <label style={S.label}>Nama Produk</label>
                <input value={nama} onChange={e => setNama(e.target.value)}
                  placeholder="cth: Raffaza Arumi Dress Set Hijab Belt..." style={S.input}/>
              </div>

              <div style={{marginBottom:'14px'}}>
                <label style={S.label}>Fitur Produk</label>
                <textarea value={fitur} onChange={e => setFitur(e.target.value)}
                  placeholder={"- Kelebihan produk\n- Komposisi + Manfaat\n- Harga & Promo"}
                  style={{...S.input, minHeight:'90px', resize:'vertical', lineHeight:1.5}}/>
              </div>

              <DTW label="Gaya Video"        value={gaVid}  onChange={setGaVid}  options={GAYA_VIDEO}    aiOn={aiVid}   onToggle={() => { setAiVid(!aiVid); setGaVid('') }}   hint="✦ AI akan pilih gaya video terbaik untuk produk ini"/>
              <DTW label="Gaya Bahasa"       value={gaBhs}  onChange={setGaBhs}  options={GAYA_BAHASA}   aiOn={aiBhs}   onToggle={() => { setAiBhs(!aiBhs); setGaBhs('') }}   hint="✦ AI akan pilih gaya bahasa yang paling viral"/>
              <DTW label="Rumus Script Video" value={rumus} onChange={setRumus}  options={RUMUS_SCRIPT}  aiOn={aiRumus} onToggle={() => { setAiRumus(!aiRumus); setRumus('') }} hint="✦ AI akan pilih rumus script yang paling convert"/>

              {error && <div style={S.errBox}>{error}</div>}

              <div style={{display:'flex',gap:'10px',marginTop:'4px'}}>
                <button onClick={reset} style={S.btnReset}>Reset</button>
                <button onClick={generate} disabled={loading}
                  style={{...S.btnGen, flex:1, opacity:loading?0.6:1}}>
                  {loading ? 'Generating...' : '✦ Generate 5 Script Video'}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div>
            <div style={S.outCard}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                <div style={S.cardTitle}><span style={{...S.dot,background:'#4ef0b4',boxShadow:'0 0 8px #4ef0b4'}}/>Generated Scripts</div>
                {scripts.length > 0 && (
                  <button onClick={copyAll} style={S.btnCopyAll}>
                    {copied.all ? '✓ Copied!' : '⊕ Copy Semua'}
                  </button>
                )}
              </div>

              <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'16px'}}>
                <span style={{display:'inline-block',width:'7px',height:'7px',borderRadius:'50%',flexShrink:0,
                  background: loading?'#ff8c42':scripts.length?'#4ef0b4':'#6b6b82',
                  boxShadow: (loading||scripts.length)?`0 0 6px ${loading?'#ff8c42':'#4ef0b4'}`:'none'}}/>
                <span style={{fontSize:'0.78rem',color:'#6b6b82'}}>
                  {loading ? 'Sedang generate...' : scripts.length ? `${scripts.length} script siap ✓` : 'Menunggu input...'}
                </span>
              </div>

              <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'12px'}}>
                {loading && (
                  <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px'}}>
                    <div style={S.spinner}/>
                    <p style={{color:'#6b6b82',fontSize:'0.88rem',textAlign:'center',marginTop:'16px'}}>
                      AI sedang menulis script terbaik<br/>untuk produkmu...
                    </p>
                  </div>
                )}
                {!loading && !scripts.length && (
                  <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px',textAlign:'center'}}>
                    <div style={{fontSize:'2.5rem',opacity:0.3,marginBottom:'12px'}}>✦</div>
                    <p style={{color:'#6b6b82',fontSize:'0.88rem',lineHeight:1.6}}>
                      Isi form di sebelah kiri dan<br/>klik Generate untuk melihat hasilnya.
                    </p>
                  </div>
                )}
                {!loading && scripts.map((sc, i) => (
                  <div key={i} style={S.scriptItem}>
                    <div style={S.scriptNum}>
                      <span>✦ SCRIPT {i+1}</span>
                      <button onClick={() => copyOne(i, sc)} style={S.copyBtn}>
                        {copied[i] ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div style={S.scriptText}>
                      {sc.split('\n').map((line, li) => {
                        const labelMatch = line.match(/^(\[[A-Z_0-9]+\])(.*)/)
                        if (labelMatch) {
                          const label = labelMatch[1].replace(/[\[\]]/g,'').toLowerCase()
                          const labelColors = {
                            hook: { bg:'rgba(255,60,110,0.15)', color:'#ff3c6e', border:'rgba(255,60,110,0.3)' },
                            cta:  { bg:'rgba(255,140,66,0.15)', color:'#ff8c42', border:'rgba(255,140,66,0.3)' },
                          }
                          const def = { bg:'rgba(78,240,180,0.1)', color:'#4ef0b4', border:'rgba(78,240,180,0.25)' }
                          const c = labelColors[label] || def
                          return (
                            <div key={li} style={{marginBottom:'8px', borderRadius:'8px', overflow:'hidden', border:`1px solid ${c.border}`}}>
                              <span style={{display:'inline-block', background:c.bg, color:c.color, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em', padding:'2px 8px', borderRight:`1px solid ${c.border}`}}>
                                {labelMatch[1]}
                              </span>
                              <span style={{padding:'4px 10px', display:'inline', fontSize:'0.88rem', color:'#d0d0e0', lineHeight:1.6}}>
                                {labelMatch[2].trim()}
                              </span>
                            </div>
                          )
                        }
                        return line.trim() ? (
                          <div key={li} style={{fontSize:'0.88rem', color:'#8a8a9a', marginBottom:'4px', fontStyle:'italic'}}>{line}</div>
                        ) : null
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

function DTW({ label, value, onChange, options, aiOn, onToggle, hint }) {
  return (
    <div style={{marginBottom:'16px'}}>
      <label style={{display:'block',fontSize:'0.75rem',fontWeight:500,color:'#6b6b82',marginBottom:'7px',letterSpacing:'0.04em',textTransform:'uppercase'}}>{label}</label>
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
        <select value={value} onChange={e => onChange(e.target.value)} disabled={aiOn}
          style={{...S.input, flex:1, opacity:aiOn?0.4:1, cursor:aiOn?'not-allowed':'pointer'}}>
          <option value="">-- Pilih --</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',flexShrink:0}}>
          <span style={{fontSize:'0.58rem',color:'#6b6b82',textTransform:'uppercase',letterSpacing:'0.04em',whiteSpace:'nowrap'}}>AI Pick</span>
          <div onClick={onToggle} style={{width:'42px',height:'22px',borderRadius:'99px',cursor:'pointer',
            background:aiOn?'linear-gradient(135deg,#ff3c6e,#ff8c42)':'#18181f',
            border:aiOn?'none':'1px solid #2a2a38',position:'relative',transition:'all 0.25s',
            boxShadow:aiOn?'0 0 10px rgba(255,60,110,0.35)':'none'}}>
            <div style={{position:'absolute',width:'14px',height:'14px',borderRadius:'50%',
              top:'50%',transform:'translateY(-50%)',
              left:aiOn?'calc(100% - 18px)':'4px',
              background:aiOn?'white':'#6b6b82',transition:'all 0.25s'}}/>
          </div>
        </div>
      </div>
      {aiOn && <p style={{fontSize:'0.72rem',color:'#ff3c6e',marginTop:'5px',fontStyle:'italic'}}>{hint}</p>}
    </div>
  )
}

const S = {
  page:       { minHeight:'100vh', background:'#0a0a0f', position:'relative', overflow:'hidden' },
  bg1:        { position:'fixed', top:'-30%', left:'-20%', width:'60%', height:'70%', background:'radial-gradient(ellipse, rgba(255,60,110,0.07) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 },
  bg2:        { position:'fixed', bottom:'-20%', right:'-10%', width:'50%', height:'60%', background:'radial-gradient(ellipse, rgba(78,240,180,0.05) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 },
  topbar:     { position:'sticky', top:0, zIndex:100, backdropFilter:'blur(20px)', background:'rgba(10,10,15,0.85)', borderBottom:'1px solid #2a2a38', padding:'14px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  logo:       { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.2rem', letterSpacing:'-0.02em', color:'#f0f0f5' },
  userBadge:  { fontSize:'0.78rem', color:'#6b6b82', background:'#18181f', border:'1px solid #2a2a38', padding:'4px 12px', borderRadius:'8px' },
  logoutBtn:  { background:'none', border:'1px solid #2a2a38', color:'#6b6b82', padding:'5px 14px', borderRadius:'8px', cursor:'pointer', fontSize:'0.8rem', fontFamily:"'DM Sans',sans-serif" },
  hero:       { textAlign:'center', padding:'56px 24px 32px', position:'relative', zIndex:1 },
  h1:         { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(1.8rem,4vw,3rem)', lineHeight:1.1, letterSpacing:'-0.03em', marginBottom:'12px', color:'#f0f0f5' },
  grad:       { background:'linear-gradient(135deg,#ff3c6e,#ff8c42,#4ef0b4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  container:  { maxWidth:'1200px', margin:'0 auto', padding:'0 24px 80px', position:'relative', zIndex:1 },
  grid:       { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:'24px', alignItems:'start' },
  card:       { background:'#13131c', border:'1px solid #2a2a38', borderRadius:'20px', padding:'28px' },
  cardTitle:  { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'0.95rem', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px', color:'#f0f0f5' },
  dot:        { display:'inline-block', width:'8px', height:'8px', borderRadius:'50%', background:'#ff3c6e', boxShadow:'0 0 8px #ff3c6e', flexShrink:0 },
  label:      { display:'block', fontSize:'0.75rem', fontWeight:500, color:'#6b6b82', marginBottom:'7px', letterSpacing:'0.04em', textTransform:'uppercase' },
  input:      { width:'100%', background:'#18181f', border:'1px solid #2a2a38', borderRadius:'12px', color:'#f0f0f5', fontFamily:"'DM Sans',sans-serif", fontSize:'0.92rem', padding:'12px 16px', outline:'none' },
  eyeBtn:     { position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color:'#6b6b82' },
  tab:        { padding:'6px 14px', borderRadius:'8px', border:'1px solid #2a2a38', background:'transparent', color:'#6b6b82', fontFamily:"'DM Sans',sans-serif", fontSize:'0.78rem', fontWeight:500, cursor:'pointer' },
  tabActive:  { background:'linear-gradient(135deg,#ff3c6e,#ff8c42)', borderColor:'transparent', color:'white', fontWeight:600 },
  errBox:     { background:'rgba(255,60,110,0.1)', border:'1px solid rgba(255,60,110,0.3)', borderRadius:'10px', padding:'11px 14px', color:'#ff3c6e', fontSize:'0.82rem', marginBottom:'12px' },
  btnReset:   { background:'none', border:'1px solid #2a2a38', color:'#6b6b82', padding:'12px 18px', borderRadius:'12px', fontFamily:"'DM Sans',sans-serif", fontSize:'0.88rem', cursor:'pointer' },
  btnGen:     { padding:'14px', background:'linear-gradient(135deg,#ff3c6e,#ff8c42)', border:'none', borderRadius:'12px', color:'white', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'0.95rem', cursor:'pointer' },
  outCard:    { background:'#13131c', border:'1px solid #2a2a38', borderRadius:'20px', padding:'28px', minHeight:'500px', display:'flex', flexDirection:'column', position:'sticky', top:'80px' },
  spinner:    { width:'44px', height:'44px', border:'3px solid #2a2a38', borderTopColor:'#ff3c6e', borderRadius:'50%', animation:'spin 0.8s linear infinite' },
  scriptItem: { background:'#18181f', border:'1px solid #2a2a38', borderRadius:'14px', padding:'16px', animation:'slideIn 0.3s ease' },
  scriptNum:  { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'0.7rem', color:'#ff3c6e', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  copyBtn:    { background:'none', border:'1px solid #2a2a38', color:'#6b6b82', padding:'3px 10px', borderRadius:'6px', fontSize:'0.7rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" },
  scriptText: { fontSize:'0.88rem', lineHeight:1.65, color:'#d0d0e0' },
  btnCopyAll: { background:'rgba(78,240,180,0.1)', border:'1px solid rgba(78,240,180,0.3)', color:'#4ef0b4', padding:'6px 14px', borderRadius:'8px', fontFamily:"'DM Sans',sans-serif", fontSize:'0.78rem', fontWeight:500, cursor:'pointer' },
}
