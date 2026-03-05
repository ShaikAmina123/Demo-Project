const router = require('express').Router();
const { Op } = require('sequelize');
const { WorkOrder, Asset, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { status, type, priority, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (search) where[Op.or] = [{ title: { [Op.like]: `%${search}%` } }, { wo_number: { [Op.like]: `%${search}%` } }];
    const orders = await WorkOrder.findAll({
      where,
      include: [
        { model: Asset, attributes: ['id','asset_tag','name'] },
        { model: User, as: 'assignee', attributes: ['id','name'] }
      ],
      order: [['created_at','DESC']]
    });
    res.json(orders);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const wo = await WorkOrder.findByPk(req.params.id, {
      include: [{ model: Asset }, { model: User, as: 'assignee' }, { model: User, as: 'creator' }]
    });
    if (!wo) return res.status(404).json({ error: 'Work order not found' });
    res.json(wo);
  } catch (err) { next(err); }
});

router.post('/', authorize('admin','manager','user'), async (req, res, next) => {
  try {
    const count = await WorkOrder.count();
    req.body.wo_number = 'WO-' + String(1001 + count).padStart(4, '0');
    req.body.created_by = req.user.id;
    const wo = await WorkOrder.create(req.body);
    res.status(201).json(wo);
  } catch (err) { next(err); }
});

router.put('/:id', authorize('admin','manager','user'), async (req, res, next) => {
  try {
    const wo = await WorkOrder.findByPk(req.params.id);
    if (!wo) return res.status(404).json({ error: 'Work order not found' });
    if (req.body.status === 'completed') req.body.completed_at = new Date();
    await wo.update(req.body);
    res.json(wo);
  } catch (err) { next(err); }
});

router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const wo = await WorkOrder.findByPk(req.params.id);
    if (!wo) return res.status(404).json({ error: 'Not found' });
    await wo.destroy();
    res.json({ message: 'Work order deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
