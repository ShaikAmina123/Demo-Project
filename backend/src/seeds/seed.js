require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User, AssetGroup, Asset, License, WorkOrder, Checkout, Audit, Warranty, VendorContract } = require('../models');

async function seed() {
  console.log('🌱 Seeding database...');
  console.log('   DB:', process.env.DB_NAME, '@ ', process.env.DB_HOST + ':' + (process.env.DB_PORT || 3306));
  console.log('   User:', process.env.DB_USER);

  try {
    await sequelize.authenticate();
    console.log('   ✅ Connected to MySQL');
  } catch (err) {
    console.error('\n❌ Cannot connect to MySQL:', err.message);
    console.error('\n💡 Fix:');
    console.error('   1. Make sure MySQL is running:  sudo systemctl start mysql');
    console.error('   2. Check backend/.env — set DB_USER and DB_PASS correctly');
    console.error('   3. Create the database:  mysql -u root -p -e "CREATE DATABASE neochain_dev"');
    process.exit(1);
  }

  await sequelize.sync({ force: true });
  console.log('   ✅ Tables created');

  // ─── USERS ───
  const pw = await bcrypt.hash('admin123', 12);
  const users = await User.bulkCreate([
    { name:'John Doe',     email:'admin@globalneochain.com', password:pw, role:'admin',   dept:'IT',          status:'active', two_fa:true },
    { name:'Sarah Chen',   email:'sarah@globalneochain.com', password:pw, role:'admin',   dept:'Engineering', status:'active', two_fa:true },
    { name:'David Kim',    email:'david@globalneochain.com', password:pw, role:'manager', dept:'Sales',       status:'active' },
    { name:'Lisa Park',    email:'lisa@globalneochain.com',  password:pw, role:'manager', dept:'Operations',  status:'active' },
    { name:'Mike Torres',  email:'mike@globalneochain.com',  password:pw, role:'user',    dept:'Operations',  status:'active' },
    { name:'Amy Ross',     email:'amy@globalneochain.com',   password:pw, role:'user',    dept:'Marketing',   status:'active' },
    { name:'Emily Watson', email:'emily@globalneochain.com', password:pw, role:'user',    dept:'Finance',     status:'active' },
    { name:'James Liu',    email:'james@globalneochain.com', password:pw, role:'user',    dept:'Engineering', status:'active' },
    { name:'Tom Watts',    email:'tom@globalneochain.com',   password:pw, role:'user',    dept:'Facilities',  status:'active' },
    { name:'Priya Patel',  email:'priya@globalneochain.com', password:pw, role:'user',    dept:'Design',      status:'active' },
    { name:'Maria Garcia', email:'maria@globalneochain.com', password:pw, role:'viewer',  dept:'Legal',       status:'active' }
  ]);

  // ─── ASSET GROUPS ───
  const groups = await AssetGroup.bulkCreate([
    { name:'IT Equipment',         icon:'fa-laptop',         color:'#4F6BED' },
    { name:'Facilities',           icon:'fa-building',       color:'#00B8A9' },
    { name:'Fleet & Vehicles',     icon:'fa-truck',          color:'#F7931E' },
    { name:'Contracts & Licenses', icon:'fa-file-contract',  color:'#8B5CF6' },
    { name:'Inventory',            icon:'fa-boxes-stacked',  color:'#EF4444' }
  ]);
  const [gIT, gFac, gFleet, gContracts, gInv] = groups;

  // ─── ASSETS — IT Equipment: Laptops & Desktops ───
  const assets = await Asset.bulkCreate([
    { asset_tag:'GN-00482', name:'MacBook Pro 16" M3 Max',    serial:'C02FV3K7MD6R', make:'Apple',     model:'MacBook Pro 16"',   category:'Laptop',  subcategory:'assets', status:'active',      condition_val:'excellent', location:'HQ — Floor 3',    department:'Engineering', purchase_date:'2026-01-15', purchase_cost:3499, warranty_exp:'2029-01-15', vendor:'Apple Inc.',        po_number:'PO-2026-0142', invoice:'INV-AP-88421', notes:'96GB RAM. AppleCare+.', group_id:gIT.id, assigned_to:users[1].id, salvage_value:500, useful_life_months:36 },
    { asset_tag:'GN-00475', name:'ThinkPad X1 Carbon Gen 11', serial:'PF3KXNW2',     make:'Lenovo',    model:'ThinkPad X1 Carbon',category:'Laptop',  subcategory:'assets', status:'checked_out', condition_val:'good',      location:'Remote',          department:'Sales',       purchase_date:'2025-11-20', purchase_cost:1849, warranty_exp:'2028-11-20', vendor:'Lenovo Direct',     po_number:'PO-2025-0891', invoice:'INV-LN-44230', notes:'Includes docking station.', group_id:gIT.id, assigned_to:users[2].id, salvage_value:300, useful_life_months:48 },
    { asset_tag:'GN-00470', name:'Dell OptiPlex 7090 Tower',  serial:'4ZPH9B3',      make:'Dell',      model:'OptiPlex 7090',     category:'Desktop', subcategory:'assets', status:'maintenance', condition_val:'fair',      location:'HQ — Floor 1',    department:'Accounting',  purchase_date:'2024-09-10', purchase_cost:1299, warranty_exp:'2027-09-10', vendor:'Dell Technologies', po_number:'PO-2024-0556', invoice:'INV-DL-22109', notes:'SSD replacement scheduled.', group_id:gIT.id, salvage_value:200, useful_life_months:60 },
    { asset_tag:'GN-00465', name:'HP EliteBook 840 G10',      serial:'5CG348P2KJ',   make:'HP',        model:'EliteBook 840 G10', category:'Laptop',  subcategory:'assets', status:'retired',     condition_val:'poor',      location:'Warehouse B',     department:'HR',          purchase_date:'2023-03-05', purchase_cost:1599, warranty_exp:'2026-03-05', vendor:'HP Direct',         po_number:'PO-2023-0201', invoice:'INV-HP-11054', notes:'Battery swollen. E-waste.', group_id:gIT.id, salvage_value:50, useful_life_months:48 },
    { asset_tag:'GN-00460', name:'Microsoft Surface Pro 10',  serial:'019283746501',  make:'Microsoft', model:'Surface Pro 10',    category:'Laptop',  subcategory:'assets', status:'active',      condition_val:'excellent', location:'Branch — NYC',     department:'Marketing',   purchase_date:'2025-08-12', purchase_cost:2199, warranty_exp:'2028-08-12', vendor:'Microsoft Store',   po_number:'PO-2025-0678', invoice:'INV-MS-33521', notes:'Includes Pen and Type Cover.', group_id:gIT.id, assigned_to:users[5].id, salvage_value:400, useful_life_months:48 },
    { asset_tag:'GN-00455', name:'Dell Latitude 5540',        serial:'7GHJ2M3',      make:'Dell',      model:'Latitude 5540',     category:'Laptop',  subcategory:'assets', status:'active',      condition_val:'good',      location:'HQ — Floor 2',    department:'Finance',     purchase_date:'2025-07-01', purchase_cost:1149, warranty_exp:'2028-07-01', vendor:'Dell Technologies', po_number:'PO-2025-0510', invoice:'INV-DL-28876', notes:'Encrypted drive.', group_id:gIT.id, assigned_to:users[6].id, salvage_value:200, useful_life_months:48 },
    { asset_tag:'GN-00450', name:'MacBook Air 15" M3',        serial:'C02GT4R8ML7T',  make:'Apple',     model:'MacBook Air 15"',   category:'Laptop',  subcategory:'assets', status:'checked_out', condition_val:'excellent', location:'Remote',          department:'Design',      purchase_date:'2025-06-15', purchase_cost:1699, warranty_exp:'2028-06-15', vendor:'Apple Inc.',        po_number:'PO-2025-0455', invoice:'INV-AP-77320', notes:'Adobe CC installed.', group_id:gIT.id, assigned_to:users[9].id, salvage_value:350, useful_life_months:48 },
    { asset_tag:'GN-00445', name:'HP Z4 G5 Workstation',      serial:'MXL4120QP8',    make:'HP',        model:'Z4 G5',             category:'Desktop', subcategory:'assets', status:'active',      condition_val:'excellent', location:'HQ — Floor 3',    department:'Engineering', purchase_date:'2025-05-20', purchase_cost:4299, warranty_exp:'2028-05-20', vendor:'HP Direct',         po_number:'PO-2025-0388', invoice:'INV-HP-18892', notes:'64GB RAM, RTX 4090.', group_id:gIT.id, assigned_to:users[7].id, salvage_value:600, useful_life_months:60 },
    { asset_tag:'GN-00440', name:'Lenovo IdeaCentre AIO 5i',  serial:'MP2B84K9',      make:'Lenovo',    model:'IdeaCentre AIO 5i', category:'Desktop', subcategory:'assets', status:'available',   condition_val:'good',      location:'Warehouse A',     department:'Unassigned',  purchase_date:'2025-04-03', purchase_cost:899,  warranty_exp:'2028-04-03', vendor:'CDW Corp',          po_number:'PO-2025-0299', invoice:'INV-LN-39005', notes:'New in box.', group_id:gIT.id, salvage_value:150, useful_life_months:60 },
    { asset_tag:'GN-00435', name:'Dell XPS 15 9530',          serial:'CN0HPX39',      make:'Dell',      model:'XPS 15 9530',       category:'Laptop',  subcategory:'assets', status:'active',      condition_val:'good',      location:'Branch — Chicago', department:'Legal',       purchase_date:'2025-03-18', purchase_cost:2349, warranty_exp:'2028-03-18', vendor:'Dell Technologies', po_number:'PO-2025-0215', invoice:'INV-DL-25510', notes:'Encryption + DLP.', group_id:gIT.id, assigned_to:users[10].id, salvage_value:350, useful_life_months:48 },

    // Monitors
    { asset_tag:'GN-01001', name:'Dell UltraSharp U2723QE 27"', serial:'CN0MN27QE001', make:'Dell',    model:'U2723QE',     category:'Monitor',  subcategory:'monitors', status:'active', condition_val:'excellent', location:'HQ — Floor 3',   department:'Engineering', purchase_date:'2026-01-20', purchase_cost:619,  warranty_exp:'2029-01-20', vendor:'Dell Technologies', po_number:'PO-2026-0150', group_id:gIT.id, assigned_to:users[1].id, useful_life_months:60 },
    { asset_tag:'GN-01002', name:'LG 34WN80C-B 34" Ultrawide', serial:'LG34WN80C00234',make:'LG',      model:'34WN80C-B',   category:'Monitor',  subcategory:'monitors', status:'active', condition_val:'excellent', location:'HQ — Floor 2',   department:'Design',      purchase_date:'2025-12-01', purchase_cost:499,  warranty_exp:'2028-12-01', vendor:'B&H Photo',         po_number:'PO-2025-0920', group_id:gIT.id, useful_life_months:60 },
    { asset_tag:'GN-01003', name:'Apple Pro Display XDR',       serial:'DMPXDR001298',  make:'Apple',   model:'Pro Display XDR',category:'Monitor', subcategory:'monitors', status:'active', condition_val:'excellent', location:'HQ — Floor 3',   department:'Engineering', purchase_date:'2025-05-25', purchase_cost:4999, warranty_exp:'2028-05-25', vendor:'Apple Inc.',        po_number:'PO-2025-0395', group_id:gIT.id, assigned_to:users[7].id, salvage_value:800, useful_life_months:72 },
    { asset_tag:'GN-01004', name:'Samsung Odyssey G9 49"',      serial:'SAM49G9X00412', make:'Samsung', model:'Odyssey G9',  category:'Monitor',  subcategory:'monitors', status:'active', condition_val:'good',      location:'Branch — NYC',   department:'Marketing',   purchase_date:'2025-10-05', purchase_cost:1099, warranty_exp:'2028-10-05', vendor:'Samsung Direct',    po_number:'PO-2025-0810', group_id:gIT.id, useful_life_months:60 },
    { asset_tag:'GN-01005', name:'Logitech MX Master 3S (x25)', serial:'BATCH-LGT-MX3S-25', make:'Logitech', model:'MX Master 3S', category:'Peripheral', subcategory:'monitors', status:'active', condition_val:'excellent', location:'HQ — All Floors', department:'Shared', purchase_date:'2026-02-01', purchase_cost:2475, vendor:'CDW Corp', po_number:'PO-2026-0088', group_id:gIT.id, useful_life_months:36 },
    { asset_tag:'GN-01006', name:'Dell P2422H 24" (x20)',       serial:'BATCH-DL-P24-20', make:'Dell',  model:'P2422H',      category:'Monitor',  subcategory:'monitors', status:'active', condition_val:'good',      location:'HQ — Floors 1-3',department:'Multiple',    purchase_date:'2024-08-15', purchase_cost:4580, warranty_exp:'2027-08-15', vendor:'Dell Technologies', po_number:'PO-2024-0620', group_id:gIT.id, useful_life_months:60 },

    // Network
    { asset_tag:'GN-00479', name:'Cisco Catalyst 9300-48P',     serial:'FOC2345X12K',  make:'Cisco',   model:'Catalyst 9300-48P', category:'Network Switch', subcategory:'network', status:'maintenance', condition_val:'good', location:'Server Room A', department:'IT Infra', purchase_date:'2023-06-01', purchase_cost:8450, warranty_exp:'2026-06-01', vendor:'Cisco Systems', po_number:'PO-2023-0412', group_id:gIT.id, useful_life_months:84 },
    { asset_tag:'GN-01010', name:'Ubiquiti UniFi AP U6 Pro (x12)',serial:'BATCH-UBI-U6P-12',make:'Ubiquiti',model:'UniFi U6 Pro',category:'Wireless AP', subcategory:'network', status:'active', condition_val:'excellent', location:'HQ — All Floors', department:'IT Infra', purchase_date:'2025-03-10', purchase_cost:2340, warranty_exp:'2028-03-10', vendor:'Ubiquiti Direct', po_number:'PO-2025-0230', group_id:gIT.id, useful_life_months:60 },
    { asset_tag:'GN-01011', name:'Palo Alto PA-450 Firewall',   serial:'PA450SN009821', make:'Palo Alto',model:'PA-450',      category:'Firewall', subcategory:'network', status:'active', condition_val:'excellent', location:'Server Room A', department:'IT Infra', purchase_date:'2025-01-15', purchase_cost:3995, warranty_exp:'2028-01-15', vendor:'Palo Alto Networks', po_number:'PO-2025-0055', group_id:gIT.id, useful_life_months:60 },
    { asset_tag:'GN-01012', name:'Aruba 2930F 24G Switch',      serial:'TW8K2JX034',   make:'Aruba',   model:'2930F-24G',   category:'Network Switch', subcategory:'network', status:'active', condition_val:'good', location:'Branch — NYC', department:'IT Infra', purchase_date:'2024-09-01', purchase_cost:1850, warranty_exp:'2027-09-01', vendor:'HPE/Aruba', po_number:'PO-2024-0710', group_id:gIT.id, useful_life_months:84 },
    { asset_tag:'GN-01013', name:'Netgear ProSAFE XS708E',      serial:'NGR708E00234',  make:'Netgear', model:'XS708E',      category:'Network Switch', subcategory:'network', status:'active', condition_val:'good', location:'Server Room A', department:'IT Infra', purchase_date:'2024-02-20', purchase_cost:649,  warranty_exp:'2027-02-20', vendor:'CDW Corp', po_number:'PO-2024-0120', group_id:gIT.id, useful_life_months:60 },

    // Printers
    { asset_tag:'GN-00477', name:'HP LaserJet Pro M404dn',      serial:'CNBKJ98021',   make:'HP',     model:'LaserJet Pro M404dn',category:'Laser Printer', subcategory:'printers', status:'active', condition_val:'good', location:'HQ — Floor 2', department:'Shared', purchase_date:'2024-10-15', purchase_cost:349, warranty_exp:'2026-10-15', vendor:'Staples', po_number:'PO-2024-0780', group_id:gIT.id, useful_life_months:60 },
    { asset_tag:'GN-01020', name:'Canon imageRUNNER C3530i',    serial:'CAN3530i00087', make:'Canon',  model:'imageRUNNER C3530i',category:'MFP Copier', subcategory:'printers', status:'active', condition_val:'good', location:'HQ — Floor 1', department:'Shared', purchase_date:'2024-07-01', purchase_cost:4200, warranty_exp:'2027-07-01', vendor:'Canon USA', po_number:'PO-2024-0510', group_id:gIT.id, useful_life_months:60 },
    { asset_tag:'GN-01021', name:'Epson WorkForce WF-7840',     serial:'EPSN7840X0012', make:'Epson',  model:'WF-7840',     category:'Inkjet Printer', subcategory:'printers', status:'active', condition_val:'good', location:'Branch — NYC', department:'Marketing', purchase_date:'2025-05-15', purchase_cost:349, warranty_exp:'2027-05-15', vendor:'Staples', po_number:'PO-2025-0410', group_id:gIT.id, useful_life_months:48 },
    { asset_tag:'GN-01022', name:'Brother MFC-L8900CDW',        serial:'BROT8900CDW009',make:'Brother',model:'MFC-L8900CDW',category:'Color Laser MFP', subcategory:'printers', status:'maintenance', condition_val:'fair', location:'HQ — Floor 3', department:'Engineering', purchase_date:'2023-11-01', purchase_cost:549, warranty_exp:'2026-11-01', vendor:'Brother Direct', po_number:'PO-2023-0810', group_id:gIT.id, useful_life_months:60 },
    { asset_tag:'GN-01023', name:'Fujitsu ScanSnap iX1600 (x3)',serial:'BATCH-FJ-IX16-3',make:'Fujitsu',model:'ScanSnap iX1600',category:'Scanner', subcategory:'printers', status:'active', condition_val:'excellent', location:'HQ — Floors 1-3', department:'Multiple', purchase_date:'2025-04-01', purchase_cost:1167, warranty_exp:'2027-04-01', vendor:'CDW Corp', po_number:'PO-2025-0280', group_id:gIT.id, useful_life_months:48 },

    // Vehicles
    { asset_tag:'GN-00480', name:'Toyota Hilux 2025',           serial:'JTFHX02P405012345', make:'Toyota', model:'Hilux 2025', category:'Pickup Truck', subcategory:'vehicles', status:'checked_out', condition_val:'good', location:'Field — Austin', department:'Operations', purchase_date:'2025-12-05', purchase_cost:42500, warranty_exp:'2028-12-05', vendor:'Toyota Dealer', po_number:'PO-2025-0945', group_id:gFleet.id, assigned_to:users[4].id, salvage_value:12000, useful_life_months:84 },
    { asset_tag:'GN-02001', name:'Ford F-150 XLT 2024',         serial:'1FTFW1E88NFA12345', make:'Ford',   model:'F-150 XLT',  category:'Pickup Truck', subcategory:'vehicles', status:'active', condition_val:'good', location:'HQ — Parking', department:'Operations', purchase_date:'2024-03-15', purchase_cost:48900, warranty_exp:'2027-03-15', vendor:'Ford Dealer', po_number:'PO-2024-0200', group_id:gFleet.id, salvage_value:15000, useful_life_months:84 },
    { asset_tag:'GN-02002', name:'Chevrolet Express 2500 Van',  serial:'1GCGG25K091234567', make:'Chevrolet',model:'Express 2500',category:'Cargo Van', subcategory:'vehicles', status:'active', condition_val:'fair', location:'Warehouse A', department:'Logistics', purchase_date:'2024-01-10', purchase_cost:39800, warranty_exp:'2027-01-10', vendor:'Chevy Dealer', po_number:'PO-2024-0025', group_id:gFleet.id, salvage_value:10000, useful_life_months:84 },
    { asset_tag:'GN-02003', name:'Tesla Model 3 Long Range',    serial:'5YJ3E1EA1NF123456', make:'Tesla',  model:'Model 3 LR', category:'Sedan', subcategory:'vehicles', status:'active', condition_val:'excellent', location:'HQ — Parking', department:'Sales', purchase_date:'2025-06-01', purchase_cost:46990, warranty_exp:'2029-06-01', vendor:'Tesla Direct', po_number:'PO-2025-0440', group_id:gFleet.id, assigned_to:users[2].id, salvage_value:18000, useful_life_months:72 },
    { asset_tag:'GN-02004', name:'Toyota 8FGCU25 Forklift #7',  serial:'8FGCU25-70234',     make:'Toyota', model:'8FGCU25',    category:'Forklift', subcategory:'vehicles', status:'active', condition_val:'fair', location:'Warehouse A', department:'Logistics', purchase_date:'2022-08-01', purchase_cost:32000, warranty_exp:'2025-08-01', vendor:'Toyota Material', po_number:'PO-2022-0055', group_id:gFleet.id, salvage_value:8000, useful_life_months:120 },
    { asset_tag:'GN-02005', name:'John Deere Gator XUV835M',    serial:'1M0835MJPN100234',  make:'John Deere',model:'Gator XUV835M',category:'Utility Vehicle', subcategory:'vehicles', status:'available', condition_val:'good', location:'Warehouse Yard', department:'Facilities', purchase_date:'2023-04-20', purchase_cost:22500, warranty_exp:'2026-04-20', vendor:'John Deere', po_number:'PO-2023-0310', group_id:gFleet.id, salvage_value:6000, useful_life_months:96 },

    // Heavy Equipment
    { asset_tag:'GN-02010', name:'CAT 320F Excavator',          serial:'CAT0320F00789',   make:'Caterpillar',model:'320F L',     category:'Excavator', subcategory:'heavy-eq', status:'active', condition_val:'good', location:'Construction Site B', department:'Operations', purchase_date:'2023-04-01', purchase_cost:185000, warranty_exp:'2026-04-01', vendor:'Caterpillar Dealer', po_number:'PO-2023-0290', group_id:gFleet.id, salvage_value:45000, useful_life_months:120 },
    { asset_tag:'GN-02011', name:'Bobcat S770 Skid-Steer',      serial:'BOB770SN00456',   make:'Bobcat',    model:'S770',        category:'Skid-Steer', subcategory:'heavy-eq', status:'active', condition_val:'fair', location:'Warehouse Yard', department:'Facilities', purchase_date:'2022-07-15', purchase_cost:62000, warranty_exp:'2025-07-15', vendor:'Bobcat Dealer', po_number:'PO-2022-0062', group_id:gFleet.id, salvage_value:15000, useful_life_months:96 },
    { asset_tag:'GN-02012', name:'Genie GS-2632 Scissor Lift',  serial:'GEN2632SN00123',  make:'Genie',     model:'GS-2632',     category:'Scissor Lift', subcategory:'heavy-eq', status:'available', condition_val:'excellent', location:'Warehouse A', department:'Facilities', purchase_date:'2024-09-01', purchase_cost:28500, warranty_exp:'2027-09-01', vendor:'Genie/Terex', po_number:'PO-2024-0690', group_id:gFleet.id, salvage_value:8000, useful_life_months:120 },
    { asset_tag:'GN-02013', name:'JLG 450AJ Boom Lift',         serial:'JLG450AJ00234',   make:'JLG',       model:'450AJ',       category:'Boom Lift', subcategory:'heavy-eq', status:'maintenance', condition_val:'fair', location:'Warehouse Yard', department:'Facilities', purchase_date:'2023-03-10', purchase_cost:78000, warranty_exp:'2026-03-10', vendor:'JLG Industries', po_number:'PO-2023-0195', group_id:gFleet.id, salvage_value:20000, useful_life_months:120 },
    { asset_tag:'GN-02014', name:'Komatsu WA270-8 Wheel Loader',serial:'KOM270SN00567',   make:'Komatsu',   model:'WA270-8',     category:'Wheel Loader', subcategory:'heavy-eq', status:'active', condition_val:'good', location:'Construction Site A', department:'Operations', purchase_date:'2023-11-20', purchase_cost:145000, warranty_exp:'2026-11-20', vendor:'Komatsu Dealer', po_number:'PO-2023-0870', group_id:gFleet.id, salvage_value:40000, useful_life_months:120 },

    // HVAC & Facilities
    { asset_tag:'GN-03001', name:'Carrier 50XC Rooftop Unit B',    serial:'CAR50XC-B00112',  make:'Carrier',  model:'50XC 15-Ton', category:'HVAC Unit', subcategory:'hvac', status:'active', condition_val:'good', location:'HQ — Rooftop', department:'Facilities', purchase_date:'2020-03-01', purchase_cost:28500, warranty_exp:'2025-03-01', vendor:'Carrier HVAC', po_number:'PO-2020-0040', group_id:gFac.id, salvage_value:3000, useful_life_months:180 },
    { asset_tag:'GN-03002', name:'Trane XR15 Heat Pump',           serial:'TRN-XR15-00089',  make:'Trane',    model:'XR15 5-Ton',  category:'Heat Pump', subcategory:'hvac', status:'active', condition_val:'good', location:'Branch — NYC', department:'Facilities', purchase_date:'2021-09-15', purchase_cost:8200, warranty_exp:'2031-09-15', vendor:'Trane Supply', po_number:'PO-2021-0095', group_id:gFac.id, salvage_value:800, useful_life_months:180 },
    { asset_tag:'GN-03003', name:'Daikin VRV IV Heat Recovery',    serial:'DKN-VRV4-00045',  make:'Daikin',   model:'VRV IV',      category:'VRF System', subcategory:'hvac', status:'active', condition_val:'excellent', location:'HQ — Floor 3', department:'Facilities', purchase_date:'2022-01-10', purchase_cost:45000, warranty_exp:'2027-01-10', vendor:'Daikin Applied', po_number:'PO-2022-0008', group_id:gFac.id, salvage_value:5000, useful_life_months:180 },
    { asset_tag:'GN-03004', name:'Honeywell T6 Smart Thermostat (x8)', serial:'BATCH-HON-T6-8', make:'Honeywell', model:'T6 Pro WiFi', category:'Thermostat', subcategory:'hvac', status:'active', condition_val:'excellent', location:'HQ — All Floors', department:'Facilities', purchase_date:'2024-11-01', purchase_cost:1360, warranty_exp:'2029-11-01', vendor:'Grainger', po_number:'PO-2024-0850', group_id:gFac.id, useful_life_months:84 },
    { asset_tag:'GN-00320', name:'Caterpillar C15 Generator #4',   serial:'CAT0C15A00004',   make:'Caterpillar',model:'C15 500kW', category:'Generator', subcategory:'hvac', status:'active', condition_val:'good', location:'HQ — Utility Yard', department:'Facilities', purchase_date:'2022-01-01', purchase_cost:85000, warranty_exp:'2027-01-01', vendor:'Caterpillar Dealer', po_number:'PO-2022-0012', group_id:gFac.id, salvage_value:15000, useful_life_months:120 },

    // Furniture
    { asset_tag:'GN-04001', name:'Herman Miller Aeron Chair (x50)',     serial:'BATCH-HM-AERON-50', make:'Herman Miller', model:'Aeron Size B', category:'Office Chair', subcategory:'furniture', status:'active', condition_val:'good', location:'HQ — All Floors', department:'All', purchase_date:'2022-06-01', purchase_cost:67500, warranty_exp:'2034-06-01', vendor:'Herman Miller', po_number:'PO-2022-0042', group_id:gFac.id, salvage_value:5000, useful_life_months:144 },
    { asset_tag:'GN-04002', name:'Steelcase Ology Sit-Stand Desk (x30)', serial:'BATCH-SC-OLOG-30', make:'Steelcase', model:'Ology 60x30', category:'Standing Desk', subcategory:'furniture', status:'active', condition_val:'excellent', location:'HQ — Floor 3', department:'Engineering', purchase_date:'2024-01-15', purchase_cost:37500, warranty_exp:'2036-01-15', vendor:'Steelcase', po_number:'PO-2024-0060', group_id:gFac.id, salvage_value:3000, useful_life_months:144 },
    { asset_tag:'GN-04003', name:'Conference Table — Boardroom',        serial:'EXEC-TBL-001',      make:'Knoll',         model:'Florence 10ft', category:'Conference Table', subcategory:'furniture', status:'active', condition_val:'good', location:'HQ — Floor 3 Boardroom', department:'Executive', purchase_date:'2020-03-01', purchase_cost:8500, vendor:'Knoll', po_number:'PO-2020-0030', group_id:gFac.id, salvage_value:1000, useful_life_months:180 },
    { asset_tag:'GN-04004', name:'IKEA KALLAX Shelf Unit (x10)',        serial:'BATCH-IK-KALLX-10', make:'IKEA',          model:'KALLAX 4x4',    category:'Shelving', subcategory:'furniture', status:'active', condition_val:'good', location:'Warehouse A', department:'Supply Chain', purchase_date:'2023-05-10', purchase_cost:890, vendor:'IKEA', po_number:'PO-2023-0350', group_id:gFac.id, useful_life_months:120 },
    { asset_tag:'GN-04005', name:'Haworth Compose Workstations (x20)',  serial:'BATCH-HW-COMP-20',  make:'Haworth',       model:'Compose Panel 6x6', category:'Cubicle', subcategory:'furniture', status:'active', condition_val:'fair', location:'HQ — Floor 1', department:'Multiple', purchase_date:'2020-03-01', purchase_cost:48000, warranty_exp:'2030-03-01', vendor:'Haworth', po_number:'PO-2020-0035', group_id:gFac.id, salvage_value:5000, useful_life_months:120 },

    // Consumables
    { asset_tag:'GN-05001', name:'Nitrile Gloves Case (x100 boxes)',  serial:'CONS-NIT-100',    make:'Kimberly-Clark', model:'Purple Nitrile M', category:'PPE', subcategory:'consumables', status:'active', location:'Warehouse A — Bin C4', department:'Supply Chain', purchase_date:'2026-02-01', purchase_cost:890, vendor:'Grainger', po_number:'PO-2026-0078', group_id:gInv.id, useful_life_months:12 },
    { asset_tag:'GN-05002', name:'HP 26A Toner Cartridge (x12)',      serial:'CONS-HP26A-12',   make:'HP', model:'CF226A', category:'Toner', subcategory:'consumables', status:'active', location:'Warehouse A — Bin A1', department:'Supply Chain', purchase_date:'2026-01-15', purchase_cost:1080, vendor:'Staples', po_number:'PO-2026-0050', group_id:gInv.id, useful_life_months:12 },
    { asset_tag:'GN-05003', name:'AA Batteries Duracell (x200)',      serial:'CONS-BATT-AA200', make:'Duracell', model:'Coppertop AA', category:'Battery', subcategory:'consumables', status:'active', location:'Warehouse A — Bin B2', department:'Supply Chain', purchase_date:'2025-12-10', purchase_cost:96, vendor:'Amazon Business', po_number:'PO-2025-0935', group_id:gInv.id, useful_life_months:24 },
    { asset_tag:'GN-05004', name:'Cleaning Supplies Kit (x20)',       serial:'CONS-CLEAN-20',   make:'3M', model:'Commercial Kit', category:'Cleaning Supply', subcategory:'consumables', status:'active', location:'Warehouse A — Bin D1', department:'Facilities', purchase_date:'2026-01-05', purchase_cost:480, vendor:'Grainger', po_number:'PO-2026-0015', group_id:gInv.id, useful_life_months:12 },
    { asset_tag:'GN-05005', name:'Paper A4 80gsm (x50 reams)',       serial:'CONS-PAPER-50',   make:'HP', model:'Office Ultra White', category:'Paper', subcategory:'consumables', status:'active', location:'Warehouse A — Bin A3', department:'Supply Chain', purchase_date:'2026-02-05', purchase_cost:225, vendor:'Staples', po_number:'PO-2026-0092', group_id:gInv.id, useful_life_months:24 },

    // Spare Parts
    { asset_tag:'GN-06001', name:'Dell OptiPlex SSD 512GB (x10)',  serial:'SPARE-DL-SSD-10', make:'Dell', model:'M.2 NVMe 512GB', category:'Storage', subcategory:'spares', status:'active', condition_val:'excellent', location:'Warehouse A — Shelf S1', department:'IT', purchase_date:'2025-11-01', purchase_cost:890, warranty_exp:'2028-11-01', vendor:'Dell Technologies', po_number:'PO-2025-0880', group_id:gInv.id, useful_life_months:60 },
    { asset_tag:'GN-06002', name:'Cisco SFP+ 10G Module (x8)',    serial:'SPARE-CS-SFP-8',  make:'Cisco', model:'SFP-10G-SR', category:'Network Module', subcategory:'spares', status:'active', condition_val:'excellent', location:'Server Room A — Rack 3', department:'IT Infra', purchase_date:'2025-09-15', purchase_cost:1520, warranty_exp:'2028-09-15', vendor:'Cisco Systems', po_number:'PO-2025-0730', group_id:gInv.id, useful_life_months:84 },
    { asset_tag:'GN-06003', name:'APC UPS Battery RBC140 (x2)',   serial:'SPARE-APC-RBC-2', make:'APC', model:'APCRBC140', category:'UPS Battery', subcategory:'spares', status:'active', condition_val:'excellent', location:'Server Room A', department:'IT Infra', purchase_date:'2025-12-20', purchase_cost:1600, warranty_exp:'2027-12-20', vendor:'APC/Schneider', po_number:'PO-2025-0950', group_id:gInv.id, useful_life_months:36 },
    { asset_tag:'GN-06004', name:'HP Fuser Kit (x3)',              serial:'SPARE-HP-FUSE-3', make:'HP', model:'RM1-8395 Fuser', category:'Printer Part', subcategory:'spares', status:'active', location:'Warehouse A — Shelf S2', department:'IT', purchase_date:'2025-10-01', purchase_cost:387, vendor:'HP Direct', po_number:'PO-2025-0805', group_id:gInv.id, useful_life_months:36 },
    { asset_tag:'GN-06005', name:'HVAC Air Filter 20x25x4 (x20)', serial:'SPARE-MERV13-20', make:'Honeywell', model:'MERV-13 20x25x4', category:'Air Filter', subcategory:'spares', status:'active', location:'Warehouse A — Shelf M1', department:'Facilities', purchase_date:'2026-01-10', purchase_cost:340, vendor:'Grainger', po_number:'PO-2026-0030', group_id:gInv.id, useful_life_months:12 }
  ]);

  // ─── LICENSES ───
  await License.bulkCreate([
    { name:'Microsoft Office 365 E3',  vendor:'Microsoft',   seats:250, assigned:238, cost:90000,  expiry:'2026-03-01', status:'active' },
    { name:'Adobe Creative Cloud',     vendor:'Adobe Inc.',  seats:50,  assigned:47,  cost:44990,  expiry:'2026-12-31', status:'active' },
    { name:'Salesforce CRM Enterprise',vendor:'Salesforce',  seats:100, assigned:89,  cost:180000, expiry:'2026-04-30', status:'active' },
    { name:'Slack Business+',          vendor:'Slack/Salesforce', seats:200, assigned:187, cost:25200, expiry:'2026-06-15', status:'active' },
    { name:'Jira Service Management',  vendor:'Atlassian',   seats:75,  assigned:68,  cost:18750,  expiry:'2026-02-28', status:'expiring' },
    { name:'AutoCAD LT',              vendor:'Autodesk',     seats:15,  assigned:12,  cost:6300,   expiry:'2026-08-01', status:'active' }
  ]);

  // ─── WORK ORDERS ───
  await WorkOrder.bulkCreate([
    { wo_number:'WO-1084', title:'HVAC Filter Replacement — Rooftop B', type:'preventive', priority:'medium', status:'open', due_date:'2026-02-28', estimated_cost:340, assigned_to:users[8].id, created_by:users[0].id, asset_id:assets.find(a=>a.asset_tag==='GN-03001')?.id },
    { wo_number:'WO-1085', title:'Forklift Hydraulic Line Repair',      type:'corrective', priority:'high',   status:'in_progress', due_date:'2026-02-22', estimated_cost:1200, assigned_to:users[8].id, created_by:users[3].id, asset_id:assets.find(a=>a.asset_tag==='GN-02004')?.id },
    { wo_number:'WO-1086', title:'Generator Annual Service',            type:'preventive', priority:'medium', status:'open', due_date:'2026-03-01', estimated_cost:2500, assigned_to:users[8].id, created_by:users[0].id, asset_id:assets.find(a=>a.asset_tag==='GN-00320')?.id },
    { wo_number:'WO-1087', title:'Boom Lift Engine Oil Leak',           type:'emergency',  priority:'urgent', status:'open', due_date:'2026-02-21', estimated_cost:3500, assigned_to:users[8].id, created_by:users[3].id, asset_id:assets.find(a=>a.asset_tag==='GN-02013')?.id },
    { wo_number:'WO-1088', title:'UPS Battery Scheduled Replacement',   type:'replacement',priority:'medium', status:'open', due_date:'2026-03-01', estimated_cost:1600, assigned_to:users[7].id, created_by:users[0].id },
    { wo_number:'WO-1089', title:'Fire Alarm Panel Annual Inspection',  type:'inspection', priority:'high',   status:'open', due_date:'2026-03-15', estimated_cost:800, assigned_to:users[8].id, created_by:users[0].id },
    { wo_number:'WO-1083', title:'Printer Drum Replacement',            type:'corrective', priority:'low',    status:'completed', due_date:'2026-02-10', actual_cost:129, completed_at:'2026-02-09', assigned_to:users[7].id, created_by:users[0].id, asset_id:assets.find(a=>a.asset_tag==='GN-01022')?.id }
  ]);

  // ─── CHECKOUTS ───
  await Checkout.bulkCreate([
    { asset_id:assets.find(a=>a.asset_tag==='GN-00475')?.id, checked_out_to:users[2].id, user_id:users[0].id, checkout_date:'2026-01-10', due_date:'2026-04-10', location:'Remote — Sales', condition_out:'Good', status:'active' },
    { asset_id:assets.find(a=>a.asset_tag==='GN-00450')?.id, checked_out_to:users[9].id, user_id:users[0].id, checkout_date:'2026-01-05', due_date:'2026-03-05', location:'Remote — Design', condition_out:'Excellent', status:'active' },
    { asset_id:assets.find(a=>a.asset_tag==='GN-00480')?.id, checked_out_to:users[4].id, user_id:users[3].id, checkout_date:'2025-12-10', due_date:'2026-03-10', location:'Field — Austin', condition_out:'Good', status:'active' },
    { asset_id:assets.find(a=>a.asset_tag==='GN-01004')?.id, checked_out_to:users[5].id, user_id:users[0].id, checkout_date:'2026-01-15', due_date:'2026-02-15', location:'Event Setup', condition_out:'Good', status:'overdue' },
    { asset_id:assets.find(a=>a.asset_tag==='GN-01021')?.id, checked_out_to:users[5].id, user_id:users[0].id, checkout_date:'2026-01-20', due_date:'2026-02-10', location:'Off-site Event', condition_out:'Good', status:'overdue' }
  ]);

  // ─── AUDITS ───
  await Audit.bulkCreate([
    { name:'Q4 2025 Full Inventory', type:'full', status:'completed', start_date:'2025-10-01', end_date:'2025-10-15', assets_counted:12400, accuracy:99.2, group_id:gIT.id, assigned_to:users[1].id },
    { name:'NYC Branch Spot Check', type:'spot_check', status:'completed', start_date:'2025-11-10', end_date:'2025-11-10', assets_counted:180, accuracy:97.8, assigned_to:users[5].id },
    { name:'Fleet Compliance Audit', type:'compliance', status:'in_progress', start_date:'2026-02-01', end_date:'2026-02-28', assets_counted:8, accuracy:100, group_id:gFleet.id, assigned_to:users[3].id },
    { name:'Q1 2026 Cycle Count — IT', type:'cycle_count', status:'scheduled', start_date:'2026-03-01', end_date:'2026-03-15', group_id:gIT.id, assigned_to:users[1].id },
    { name:'Warehouse A Full Count', type:'full', status:'scheduled', start_date:'2026-03-10', end_date:'2026-03-20', group_id:gInv.id, assigned_to:users[4].id }
  ]);

  // ─── WARRANTIES ───
  await Warranty.bulkCreate([
    { name:'Dell ProSupport Plus — All Desktops', vendor:'Dell Technologies', type:'Hardware Warranty', start_date:'2024-01-01', end_date:'2027-01-01', cost:12400, status:'active', notes:'Covers 28 Dell desktops and laptops.' },
    { name:'AppleCare+ for Business — MacBooks', vendor:'Apple Inc.', type:'Hardware Warranty', start_date:'2025-06-15', end_date:'2028-06-15', cost:5880, status:'active' },
    { name:'Cisco SmartNet — Network Equipment', vendor:'Cisco Systems', type:'Hardware + Software', start_date:'2023-06-01', end_date:'2026-06-01', cost:6200, status:'expiring', notes:'RENEWAL NEEDED.' },
    { name:'Toyota Fleet Warranty Extension', vendor:'Toyota Dealer', type:'Vehicle Warranty', start_date:'2025-12-05', end_date:'2030-12-05', cost:3200, status:'active' },
    { name:'Caterpillar CSA — Generator', vendor:'Caterpillar Dealer', type:'Equipment Warranty', start_date:'2022-01-01', end_date:'2027-01-01', cost:8500, status:'active' },
    { name:'Herman Miller 12-Year Warranty', vendor:'Herman Miller', type:'Furniture Warranty', start_date:'2022-06-01', end_date:'2034-06-01', cost:0, status:'active' },
    { name:'APC Extended Warranty — UPS', vendor:'APC/Schneider', type:'Equipment Warranty', start_date:'2024-05-01', end_date:'2027-05-01', cost:2800, status:'active' }
  ]);

  // ─── VENDOR CONTRACTS ───
  await VendorContract.bulkCreate([
    { name:'Managed IT Services — Acme IT', vendor:'Acme IT Solutions', type:'Service Contract', start_date:'2025-01-01', end_date:'2026-12-31', cost:96000, status:'active', managed_by:users[0].id },
    { name:'Janitorial Services — CleanCo', vendor:'CleanCo Services', type:'Service Contract', start_date:'2025-07-01', end_date:'2026-06-30', cost:42000, status:'active' },
    { name:'Fire Alarm Monitoring — SafeGuard', vendor:'SafeGuard Fire Co.', type:'Service Contract', start_date:'2026-01-01', end_date:'2026-12-31', cost:4800, status:'active' },
    { name:'Internet — AT&T Business Fiber', vendor:'AT&T', type:'Telecom Contract', start_date:'2025-03-01', end_date:'2028-02-28', cost:18000, status:'active' },
    { name:'Elevator Maintenance — Otis', vendor:'Otis Elevator', type:'Service Contract', start_date:'2024-01-01', end_date:'2026-12-31', cost:14400, status:'active' }
  ]);

  console.log('✅ Seed complete!');
  console.log(`   ${users.length} users | ${assets.length} assets | 6 licenses | 7 work orders | 5 checkouts | 5 audits | 7 warranties | 5 contracts`);
  console.log('\n   Login: admin@globalneochain.com / admin123');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
