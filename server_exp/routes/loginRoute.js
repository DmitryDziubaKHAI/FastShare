// routes/loginRoute.js
const express   = require('express');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const router    = express.Router();
const userRepo  = require('../repositories/UserRepository');

const JWT_SECRET = 'secret-key';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepo.getUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Wrong e-mail or password' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)  return res.status(400).json({ message: 'Wrong e-mail or password' });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge  : 24 * 60 * 60 * 1e3
    });

    res.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Internal error' });
  }
});

module.exports = router;
