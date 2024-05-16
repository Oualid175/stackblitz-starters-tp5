const express = require('express');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/generate', (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  qrcode.toDataURL(secret.otpauth_url, (err, data) => {
    if (err) throw err;
    res.json({ secret: secret.base32, qrcode: data });
  });
});
app.post('/verify', (req, res) => {
  const { token, secret } = req.body;
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
  });
  res.json({ verified });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
