const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;
router.get('/test', (req, res) => {
    res.send('Auth route works!');
  });