const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');

const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  const username = String(req.body?.username || '').trim();
  const email    = String(req.body?.email || '').trim();
  const password = String(req.body?.password || '').trim();

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = await userRepository.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10); // 🔐 хешування
    const newUser = await userRepository.createUser({ username, email, passwordHash });

    req.session.userId = newUser.id;

    return res.status(201).json({
      message: 'Registration successful',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
