const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// CURRENT USER
router.get('/me', authRequired, async (req, res) => {
  const result = await db.query(
    'SELECT id, username, email FROM users WHERE id=$1',
    [req.user.id]
  );
  res.json(result.rows[0]);
});

// SUGGESTED USERS
router.get('/suggested', authRequired, async (req, res) => {
  const result = await db.query(
    `SELECT id, username
     FROM users
     WHERE id != $1
     ORDER BY created_at DESC
     LIMIT 10`,
    [req.user.id]
  );
  res.json(result.rows);
});

// USER PREVIEW
router.get('/:id/preview', authRequired, async (req, res) => {
  const userId = req.params.id;

  const user = await db.query(
    'SELECT id, username FROM users WHERE id=$1',
    [userId]
  );
  if (user.rows.length === 0)
    return res.status(404).json({ message: 'User not found' });

  const followers = await db.query(
    'SELECT COUNT(*)::int AS count FROM follows WHERE following_id=$1',
    [userId]
  );

  const following = await db.query(
    'SELECT COUNT(*)::int AS count FROM follows WHERE follower_id=$1',
    [userId]
  );

  res.json({
    user: user.rows[0],
    followers: followers.rows[0].count,
    following: following.rows[0].count,
  });
});

module.exports = router;
