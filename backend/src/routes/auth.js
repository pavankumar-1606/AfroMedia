const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { jwtSecret } = require('../config');

const router = express.Router();

function generateToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
}

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (exists.rows.length > 0)
      return res.status(409).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    return res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Signup error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const result = await db.query(
      `SELECT id, username, email, password_hash
       FROM users
       WHERE username = $1 OR email = $1`,
      [identifier]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id);
    return res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
});

// OAuth placeholders
router.get('/google/start', (req, res) => {
  res.status(501).json({ message: 'Google OAuth not implemented yet' });
});

router.get('/google/callback', (req, res) => {
  res.status(501).json({ message: 'Handle Google callback here' });
});

router.get('/facebook/start', (req, res) => {
  res.status(501).json({ message: 'Facebook OAuth not implemented yet' });
});

router.get('/facebook/callback', (req, res) => {
  res.status(501).json({ message: 'Handle Facebook callback here' });
});

module.exports = router;
