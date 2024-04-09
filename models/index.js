'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const Admin = require('./admin');
const Patient = require('./patient');
const Biometric = require('./biometric');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Admin = Admin;
db.Patient = Patient;
db.Biometric = Biometric;

Admin.init(sequelize);
Patient.init(sequelize);
Biometric.init(sequelize);

Admin.associate(db);
Patient.associate(db);
Biometric.associate(db);


module.exports = db;
