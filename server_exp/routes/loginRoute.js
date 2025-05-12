const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');

router.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim();
  const password = String(req.body?.password || '').trim();

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.userId = user.id;

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
