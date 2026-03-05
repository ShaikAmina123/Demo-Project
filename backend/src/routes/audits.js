const router = require('express').Router();
const { Audit, AssetGroup, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    res.json(await Audit.findAll({
      include: [{ model: AssetGroup, attributes: ['id','name'] }, { model: User, as: 'assignee', attributes: ['id','name'] }],
      order: [['start_date','DESC']]
    }));
  } catch (err) { next(err); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const a = await Audit.findByPk(req.params.id, { include: [{ model: AssetGroup }, { model: User, as: 'assignee' }] });
    if (!a) return res.status(404).json({ error: 'Not found' });
    res.json(a);
  } catch (err) { next(err); }
});
router.post('/', authorize('admin','manager'), async (req, res, next) => {
  try {
    req.body.assigned_to = req.body.assigned_to || req.user.id;
    res.status(201).json(await Audit.create(req.body));
  } catch (err) { next(err); }
});
router.put('/:id', authorize('admin','manager'), async (req, res, next) => {
  try {
    const a = await Audit.findByPk(req.params.id);
    if (!a) return res.status(404).json({ error: 'Not found' });
    await a.update(req.body);
    res.json(a);
  } catch (err) { next(err); }
});
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const a = await Audit.findByPk(req.params.id);
    if (!a) return res.status(404).json({ error: 'Not found' });
    await a.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});
module.exports = router;
