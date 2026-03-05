const router = require('express').Router();
const { Checkout, Asset, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const checkouts = await Checkout.findAll({
      where,
      include: [
        { model: Asset, attributes: ['id','asset_tag','name'] },
        { model: User, as: 'checkedOutTo', attributes: ['id','name'] }
      ],
      order: [['checkout_date','DESC']]
    });
    res.json(checkouts);
  } catch (err) { next(err); }
});

router.post('/', authorize('admin','manager','user'), async (req, res, next) => {
  try {
    req.body.user_id = req.user.id;
    const checkout = await Checkout.create(req.body);
    await Asset.update({ status: 'checked_out' }, { where: { id: req.body.asset_id } });
    res.status(201).json(checkout);
  } catch (err) { next(err); }
});

// POST /api/checkouts/:id/checkin
router.post('/:id/checkin', authorize('admin','manager','user'), async (req, res, next) => {
  try {
    const checkout = await Checkout.findByPk(req.params.id);
    if (!checkout) return res.status(404).json({ error: 'Checkout not found' });
    await checkout.update({ status: 'returned', return_date: new Date(), condition_in: req.body.condition_in || 'good' });
    await Asset.update({ status: 'active' }, { where: { id: checkout.asset_id } });
    res.json(checkout);
  } catch (err) { next(err); }
});

module.exports = router;
