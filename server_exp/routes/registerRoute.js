// routes/registerRoute.js
const express   = require('express');
const bcrypt    = require('bcryptjs');
const router    = express.Router();
const userRepo  = require('../repositories/UserRepository');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const gmailRe = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRe.test(email))
    return res.status(400).json({ message: 'Email must be @gmail.com' });

  if (password.length < 5)
    return res.status(400).json({ message: 'Password length ≥ 5' });

  try {
    if (await userRepo.getUserByEmail(email))
      return res.status(400).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = await userRepo.createUser(username, email, hash);
    res.status(201).json({ message: 'User registered', user });
  } catch (e) {
    console.error('Registration error:', e);
    res.status(500).json({ message: 'Internal error' });
  }
});

module.exports = router;
