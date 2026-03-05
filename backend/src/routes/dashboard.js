const router = require('express').Router();
const { Asset, License, WorkOrder, Checkout, Audit, User, sequelize } = require('../models');
const { authenticate } = require('../middleware/auth');
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const [totalAssets, activeAssets, maintenanceAssets, checkedOutAssets, totalValue,
           totalLicenses, openWOs, overdueCheckouts, activeAudits, totalUsers] = await Promise.all([
      Asset.count(),
      Asset.count({ where: { status: 'active' } }),
      Asset.count({ where: { status: 'maintenance' } }),
      Asset.count({ where: { status: 'checked_out' } }),
      Asset.sum('purchase_cost') || 0,
      License.count(),
      WorkOrder.count({ where: { status: ['open','in_progress'] } }),
      Checkout.count({ where: { status: 'overdue' } }),
      Audit.count({ where: { status: ['scheduled','in_progress'] } }),
      User.count({ where: { status: 'active' } })
    ]);

    const recentAssets = await Asset.findAll({ order: [['created_at','DESC']], limit: 5, attributes: ['id','asset_tag','name','status','created_at'] });
    const recentWOs = await WorkOrder.findAll({ order: [['created_at','DESC']], limit: 5, attributes: ['id','wo_number','title','status','priority','created_at'] });

    const assetsByGroup = await Asset.findAll({
      attributes: ['subcategory', [sequelize.fn('COUNT','*'), 'count']],
      group: ['subcategory'],
      raw: true
    });

    res.json({
      stats: { totalAssets, activeAssets, maintenanceAssets, checkedOutAssets, totalValue, totalLicenses, openWOs, overdueCheckouts, activeAudits, totalUsers },
      recentAssets,
      recentWOs,
      assetsByGroup
    });
  } catch (err) { next(err); }
});

module.exports = router;
