const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'production') app.use(helmet());
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/assets',        require('./routes/assets'));
app.use('/api/asset-groups',  require('./routes/assetGroups'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/work-orders', require('./routes/workOrders'));
app.use('/api/checkouts',   require('./routes/checkouts'));
app.use('/api/licenses',    require('./routes/licenses'));
app.use('/api/audits',      require('./routes/audits'));
app.use('/api/dashboard',   require('./routes/dashboard'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV, time: new Date() }));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../frontend/dist/index.html')));
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Models synchronized');
    app.listen(PORT, () => {
      console.log(`\n🚀 Global Neochain API running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    console.error('\n💡 Make sure MySQL is running and database exists:');
    console.error('   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS neochain_dev"');
    process.exit(1);
  }
}
start();
module.exports = app;
