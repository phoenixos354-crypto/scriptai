# ScriptAI — Generator Script Video Affiliate

## Setup & Deploy ke Vercel

### 1. Install dependencies
```bash
npm install
```

### 2. Setup env lokal
```bash
cp .env.example .env.local
# Edit .env.local dengan API key dan daftar user kamu
```

### 3. Jalankan lokal
```bash
npm run dev
# Buka http://localhost:3000
```

---

## Deploy ke Vercel

### Step 1 — Push ke GitHub
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/username/scriptai.git
git push -u origin main
```

### Step 2 — Import di Vercel
1. Buka vercel.com → New Project → Import dari GitHub
2. Pilih repo scriptai

### Step 3 — Tambah Environment Variables
Di Vercel dashboard → Settings → Environment Variables, tambahkan:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` |
| `ALLOWED_USERS` | `email1:kode1,email2:kode2` |

### Step 4 — Deploy
Klik Deploy. Selesai! 🚀

---

## Cara Tambah / Edit User

Edit nilai `ALLOWED_USERS` di Vercel Environment Variables:

```
budi@gmail.com:BUDI2025,siti@gmail.com:SITI456,kakak@gmail.com:KAKAK789
```

Format: `email:kode` dipisah koma. Tidak perlu spasi.

Setelah edit env variable di Vercel → **Redeploy** project agar perubahan aktif.

---

## Struktur Project

```
scriptai/
├── pages/
│   ├── _app.js          # Root app
│   ├── index.js         # Auth gate
│   └── api/
│       ├── auth.js      # Validasi login
│       └── generate.js  # Generate script via Claude API
├── components/
│   ├── LoginPage.js     # Halaman login
│   └── AppPage.js       # Halaman utama generator
├── styles/
│   └── globals.css
├── .env.example
└── package.json
```
