// pages/api/auth.js
// Validates email + access code against ALLOWED_USERS env variable
// Format of ALLOWED_USERS: "email1:kode1,email2:kode2,email3:kode3"
// Example: "budi@gmail.com:BUDI123,siti@gmail.com:SITI456"

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email dan kode wajib diisi' });
  }

  const allowedUsers = process.env.ALLOWED_USERS || '';

  if (!allowedUsers) {
    return res.status(500).json({ error: 'Server belum dikonfigurasi. Hubungi admin.' });
  }

  // Parse "email1:kode1,email2:kode2" format
  const userMap = {};
  allowedUsers.split(',').forEach(entry => {
    const [e, k] = entry.trim().split(':');
    if (e && k) userMap[e.toLowerCase().trim()] = k.trim();
  });

  const inputEmail = email.toLowerCase().trim();
  const inputCode = code.trim();

  if (userMap[inputEmail] && userMap[inputEmail] === inputCode) {
    return res.status(200).json({ success: true, email: inputEmail });
  }

  return res.status(401).json({ error: 'Email atau kode akses tidak valid' });
}
