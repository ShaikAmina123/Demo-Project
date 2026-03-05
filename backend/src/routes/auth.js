const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('[AUTH] Login attempt:', email);

    if (!email || !password) {
      console.log('[AUTH] Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('[AUTH] User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials — user not found. Did you run: npm run seed?' });
    }

    console.log('[AUTH] User found:', user.email, 'status:', user.status);
    const valid = await bcrypt.compare(password, user.password);
    console.log('[AUTH] Password valid:', valid);

    if (!valid) return res.status(401).json({ error: 'Invalid credentials — wrong password' });
    if (user.status !== 'active') return res.status(403).json({ error: 'Account is ' + user.status });

    await user.update({ last_login: new Date() });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    console.log('[AUTH] Login success:', user.email);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, dept: user.dept, avatar: user.avatar }
    });
  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    next(err);
  }
});

// POST /api/auth/register (admin only in production)
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, dept } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, password required' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role: role || 'user', dept });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/password
router.put('/password', authenticate, async (req, res, next) => {
  try {
    const { current, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    const valid = await bcrypt.compare(current, user.password);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) { next(err); }
});

module.exports = router;
