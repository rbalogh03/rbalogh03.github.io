const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { name, email, message, package } = req.body;

  if (!name || !email || !message || !package) {
    return res.status(400).json({ error: 'Minden mező kötelező.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'conilex.qa@gmail.com',
      subject: `Conilex kapcsolat – ${package}`,
      text: message,
      html: `<p><strong>Név:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Csomag:</strong> ${package}</p>
             <p><strong>Üzenet:</strong><br>${message}</p>`
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hiba történt az email küldésekor.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Szerver elindult: http://localhost:${PORT}`);
});
