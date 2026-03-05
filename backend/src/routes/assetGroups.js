const router = require('express').Router();
const { AssetGroup, Asset } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { Op, fn, col, literal } = require('sequelize');

router.use(authenticate);

// GET /api/asset-groups — list all with asset counts
router.get('/', async (req, res, next) => {
  try {
    const groups = await AssetGroup.findAll({
      attributes: {
        include: [
          [fn('COUNT', col('Assets.id')), 'assetCount']
        ]
      },
      include: [{
        model: Asset,
        attributes: [],
        where: { status: { [Op.ne]: 'disposed' } },
        required: false
      }],
      group: ['AssetGroup.id'],
      order: [['name', 'ASC']]
    });
    res.json({ groups });
  } catch (err) { next(err); }
});

// GET /api/asset-groups/:id — single group with stats
router.get('/:id', async (req, res, next) => {
  try {
    const group = await AssetGroup.findByPk(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Get asset stats for this group
    const assets = await Asset.findAll({
      where: { group_id: req.params.id, status: { [Op.ne]: 'disposed' } }
    });

    const stats = {
      total: assets.length,
      active: assets.filter(a => a.status === 'active').length,
      maintenance: assets.filter(a => a.status === 'maintenance').length,
      checkedOut: assets.filter(a => a.status === 'checked_out').length,
      retired: assets.filter(a => a.status === 'retired').length,
      totalValue: assets.reduce((sum, a) => sum + (parseFloat(a.purchase_cost) || 0), 0)
    };

    res.json({ group, stats, assets });
  } catch (err) { next(err); }
});

// POST /api/asset-groups — create
router.post('/', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { name, icon, description, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Group name is required' });

    const existing = await AssetGroup.findOne({ where: { name } });
    if (existing) return res.status(409).json({ message: 'Group with this name already exists' });

    const group = await AssetGroup.create({ name, icon, description, color });
    res.status(201).json(group);
  } catch (err) { next(err); }
});

// PUT /api/asset-groups/:id — update
router.put('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const group = await AssetGroup.findByPk(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const { name, icon, description, color } = req.body;
    await group.update({ name, icon, description, color });
    res.json(group);
  } catch (err) { next(err); }
});

// DELETE /api/asset-groups/:id — delete (only if no assets)
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const group = await AssetGroup.findByPk(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const assetCount = await Asset.count({ where: { group_id: req.params.id } });
    if (assetCount > 0) {
      return res.status(400).json({ message: `Cannot delete group with ${assetCount} assets. Reassign them first.` });
    }

    await group.destroy();
    res.json({ message: 'Group deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
