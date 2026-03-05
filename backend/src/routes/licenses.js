const router = require('express').Router();
const { License } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try { res.json(await License.findAll({ order: [['expiry','ASC']] })); } catch (err) { next(err); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const l = await License.findByPk(req.params.id);
    if (!l) return res.status(404).json({ error: 'Not found' });
    res.json(l);
  } catch (err) { next(err); }
});
router.post('/', authorize('admin','manager'), async (req, res, next) => {
  try { res.status(201).json(await License.create(req.body)); } catch (err) { next(err); }
});
router.put('/:id', authorize('admin','manager'), async (req, res, next) => {
  try {
    const l = await License.findByPk(req.params.id);
    if (!l) return res.status(404).json({ error: 'Not found' });
    await l.update(req.body);
    res.json(l);
  } catch (err) { next(err); }
});
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const l = await License.findByPk(req.params.id);
    if (!l) return res.status(404).json({ error: 'Not found' });
    await l.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});
module.exports = router;
