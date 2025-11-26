const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// FEED
router.get('/feed', authRequired, async (req, res) => {
  const result = await db.query(
    `SELECT p.id, p.content, p.media_url, p.created_at,
            u.username
     FROM posts p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`
  );
  res.json(result.rows);
});

// CREATE POST
router.post('/', authRequired, async (req, res) => {
  const { content, media_url } = req.body;

  const result = await db.query(
    `INSERT INTO posts (user_id, content, media_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [req.user.id, content, media_url]
  );

  res.status(201).json(result.rows[0]);
});

module.exports = router;
