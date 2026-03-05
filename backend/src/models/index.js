const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// ─── USER ───
const User = sequelize.define('User', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:       { type: DataTypes.STRING(100), allowNull: false },
  email:      { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password:   { type: DataTypes.STRING(255), allowNull: false },
  role:       { type: DataTypes.ENUM('admin','manager','user','viewer'), defaultValue: 'user' },
  dept:       { type: DataTypes.STRING(100) },
  phone:      { type: DataTypes.STRING(20) },
  avatar:     { type: DataTypes.STRING(500) },
  two_fa:     { type: DataTypes.BOOLEAN, defaultValue: false },
  status:     { type: DataTypes.ENUM('active','inactive','suspended'), defaultValue: 'active' },
  last_login: { type: DataTypes.DATE }
});

// ─── ASSET GROUP ───
const AssetGroup = sequelize.define('AssetGroup', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:        { type: DataTypes.STRING(100), allowNull: false },
  icon:        { type: DataTypes.STRING(50) },
  description: { type: DataTypes.TEXT },
  color:       { type: DataTypes.STRING(7) }
});

// ─── ASSET ───
const Asset = sequelize.define('Asset', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  asset_tag:     { type: DataTypes.STRING(20), allowNull: false, unique: true },
  name:          { type: DataTypes.STRING(255), allowNull: false },
  serial:        { type: DataTypes.STRING(100) },
  make:          { type: DataTypes.STRING(100) },
  model:         { type: DataTypes.STRING(100) },
  category:      { type: DataTypes.STRING(100) },
  subcategory:   { type: DataTypes.STRING(100) },
  status:        { type: DataTypes.ENUM('active','maintenance','retired','checked_out','available','disposed'), defaultValue: 'active' },
  condition_val: { type: DataTypes.ENUM('excellent','good','fair','poor'), defaultValue: 'good' },
  location:      { type: DataTypes.STRING(200) },
  department:    { type: DataTypes.STRING(100) },
  purchase_date: { type: DataTypes.DATEONLY },
  purchase_cost: { type: DataTypes.DECIMAL(12,2) },
  salvage_value: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
  useful_life_months: { type: DataTypes.INTEGER },
  warranty_exp:  { type: DataTypes.DATEONLY },
  vendor:        { type: DataTypes.STRING(200) },
  po_number:     { type: DataTypes.STRING(50) },
  invoice:       { type: DataTypes.STRING(50) },
  notes:         { type: DataTypes.TEXT },
  custom_fields: { type: DataTypes.JSON }
});

// ─── LICENSE ───
const License = sequelize.define('License', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:        { type: DataTypes.STRING(255), allowNull: false },
  vendor:      { type: DataTypes.STRING(200) },
  seats:       { type: DataTypes.INTEGER, defaultValue: 1 },
  assigned:    { type: DataTypes.INTEGER, defaultValue: 0 },
  cost:        { type: DataTypes.DECIMAL(12,2) },
  expiry:      { type: DataTypes.DATEONLY },
  status:      { type: DataTypes.ENUM('active','expiring','expired','cancelled'), defaultValue: 'active' },
  license_key: { type: DataTypes.TEXT },
  notes:       { type: DataTypes.TEXT }
});

// ─── WORK ORDER ───
const WorkOrder = sequelize.define('WorkOrder', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  wo_number:      { type: DataTypes.STRING(20), allowNull: false, unique: true },
  title:          { type: DataTypes.STRING(255), allowNull: false },
  description:    { type: DataTypes.TEXT },
  type:           { type: DataTypes.ENUM('preventive','corrective','emergency','inspection','replacement') },
  priority:       { type: DataTypes.ENUM('low','medium','high','urgent'), defaultValue: 'medium' },
  status:         { type: DataTypes.ENUM('open','in_progress','on_hold','completed','cancelled'), defaultValue: 'open' },
  due_date:       { type: DataTypes.DATEONLY },
  completed_at:   { type: DataTypes.DATE },
  estimated_cost: { type: DataTypes.DECIMAL(12,2) },
  actual_cost:    { type: DataTypes.DECIMAL(12,2) },
  parts_needed:   { type: DataTypes.TEXT },
  notes:          { type: DataTypes.TEXT }
});

// ─── CHECKOUT ───
const Checkout = sequelize.define('Checkout', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  checkout_date:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  due_date:       { type: DataTypes.DATEONLY },
  return_date:    { type: DataTypes.DATE },
  location:       { type: DataTypes.STRING(200) },
  condition_out:  { type: DataTypes.STRING(50) },
  condition_in:   { type: DataTypes.STRING(50) },
  status:         { type: DataTypes.ENUM('active','overdue','returned'), defaultValue: 'active' },
  notes:          { type: DataTypes.TEXT }
});

// ─── AUDIT ───
const Audit = sequelize.define('Audit', {
  id:              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:            { type: DataTypes.STRING(255), allowNull: false },
  type:            { type: DataTypes.ENUM('full','spot_check','cycle_count','compliance') },
  status:          { type: DataTypes.ENUM('scheduled','in_progress','completed','cancelled'), defaultValue: 'scheduled' },
  start_date:      { type: DataTypes.DATEONLY },
  end_date:        { type: DataTypes.DATEONLY },
  assets_counted:  { type: DataTypes.INTEGER, defaultValue: 0 },
  accuracy:        { type: DataTypes.DECIMAL(5,2) },
  findings:        { type: DataTypes.TEXT },
  notes:           { type: DataTypes.TEXT }
});

// ─── WARRANTY ───
const Warranty = sequelize.define('Warranty', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:       { type: DataTypes.STRING(255), allowNull: false },
  vendor:     { type: DataTypes.STRING(200) },
  type:       { type: DataTypes.STRING(100) },
  start_date: { type: DataTypes.DATEONLY },
  end_date:   { type: DataTypes.DATEONLY },
  cost:       { type: DataTypes.DECIMAL(12,2) },
  status:     { type: DataTypes.ENUM('active','expiring','expired'), defaultValue: 'active' },
  terms:      { type: DataTypes.TEXT },
  notes:      { type: DataTypes.TEXT }
});

// ─── VENDOR CONTRACT ───
const VendorContract = sequelize.define('VendorContract', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:       { type: DataTypes.STRING(255), allowNull: false },
  vendor:     { type: DataTypes.STRING(200) },
  type:       { type: DataTypes.STRING(100) },
  start_date: { type: DataTypes.DATEONLY },
  end_date:   { type: DataTypes.DATEONLY },
  cost:       { type: DataTypes.DECIMAL(12,2) },
  status:     { type: DataTypes.ENUM('active','expiring','expired','cancelled'), defaultValue: 'active' },
  notes:      { type: DataTypes.TEXT }
});

// ─── ACTIVITY LOG ───
const ActivityLog = sequelize.define('ActivityLog', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  action:     { type: DataTypes.STRING(50), allowNull: false },
  entity:     { type: DataTypes.STRING(50) },
  entity_id:  { type: DataTypes.UUID },
  details:    { type: DataTypes.JSON },
  ip_address: { type: DataTypes.STRING(45) }
}, { updatedAt: false, paranoid: false });

// ─── RELATIONSHIPS ───
Asset.belongsTo(AssetGroup, { foreignKey: 'group_id' });
AssetGroup.hasMany(Asset, { foreignKey: 'group_id' });
Asset.belongsTo(User, { as: 'assignedUser', foreignKey: 'assigned_to' });

WorkOrder.belongsTo(Asset, { foreignKey: 'asset_id' });
WorkOrder.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to' });
WorkOrder.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });

Checkout.belongsTo(Asset, { foreignKey: 'asset_id' });
Checkout.belongsTo(User, { as: 'checkedOutBy', foreignKey: 'user_id' });
Checkout.belongsTo(User, { as: 'checkedOutTo', foreignKey: 'checked_out_to' });

Audit.belongsTo(AssetGroup, { foreignKey: 'group_id' });
Audit.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to' });

Warranty.belongsTo(Asset, { foreignKey: 'asset_id' });
VendorContract.belongsTo(User, { as: 'owner', foreignKey: 'managed_by' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize, User, AssetGroup, Asset, License,
  WorkOrder, Checkout, Audit, Warranty,
  VendorContract, ActivityLog
};
