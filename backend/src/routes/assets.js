const router = require('express').Router();
const { Op } = require('sequelize');
const { Asset, AssetGroup, User, ActivityLog } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// GET /api/assets
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, status, category, subcategory, department, group_id, sort = 'updated_at', order = 'DESC' } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { asset_tag: { [Op.like]: `%${search}%` } },
        { serial: { [Op.like]: `%${search}%` } },
        { make: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;
    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (department) where.department = department;
    if (group_id) where.group_id = group_id;

    const { rows, count } = await Asset.findAndCountAll({
      where,
      include: [
        { model: AssetGroup, attributes: ['id','name','icon','color'] },
        { model: User, as: 'assignedUser', attributes: ['id','name','email'] }
      ],
      order: [[sort, order]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    res.json({ data: rows, pagination: { page: +page, limit: +limit, total: count, pages: Math.ceil(count / +limit) } });
  } catch (err) { next(err); }
});

// GET /api/assets/stats
router.get('/stats', async (req, res, next) => {
  try {
    const total = await Asset.count();
    const active = await Asset.count({ where: { status: 'active' } });
    const maintenance = await Asset.count({ where: { status: 'maintenance' } });
    const checkedOut = await Asset.count({ where: { status: 'checked_out' } });
    const retired = await Asset.count({ where: { status: 'retired' } });
    const available = await Asset.count({ where: { status: 'available' } });
    const totalValue = await Asset.sum('purchase_cost') || 0;
    res.json({ total, active, maintenance, checkedOut, retired, available, totalValue });
  } catch (err) { next(err); }
});

// GET /api/assets/:id
router.get('/:id', async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [{ model: AssetGroup }, { model: User, as: 'assignedUser' }]
    });
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (err) { next(err); }
});

// POST /api/assets
router.post('/', authorize('admin','manager'), async (req, res, next) => {
  try {
    const asset = await Asset.create(req.body);
    await ActivityLog.create({ action: 'create', entity: 'asset', entity_id: asset.id, user_id: req.user.id, details: { name: asset.name } });
    res.status(201).json(asset);
  } catch (err) { next(err); }
});

// PUT /api/assets/:id
router.put('/:id', authorize('admin','manager'), async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    await asset.update(req.body);
    await ActivityLog.create({ action: 'update', entity: 'asset', entity_id: asset.id, user_id: req.user.id, details: req.body });
    res.json(asset);
  } catch (err) { next(err); }
});

// DELETE /api/assets/:id
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    await asset.destroy();
    await ActivityLog.create({ action: 'delete', entity: 'asset', entity_id: asset.id, user_id: req.user.id });
    res.json({ message: 'Asset deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
