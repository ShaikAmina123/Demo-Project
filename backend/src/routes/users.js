const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { search, role, status, dept } = req.query;
    const where = {};
    if (search) where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }];
    if (role) where.role = role;
    if (status) where.status = status;
    if (dept) where.dept = dept;
    const users = await User.findAll({ where, attributes: { exclude: ['password'] }, order: [['name','ASC']] });
    res.json(users);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const { name, email, password, role, dept, phone } = req.body;
    const hashed = await bcrypt.hash(password || 'Welcome123!', 12);
    const user = await User.create({ name, email, password: hashed, role, dept, phone });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) { next(err); }
});

router.put('/:id', authorize('admin','manager'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...rest } = req.body;
    if (password) rest.password = await bcrypt.hash(password, 12);
    await user.update(rest);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) { next(err); }
});

router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
