require('dotenv').config();
const { fstat } = require('fs-extra');
const fs = require('fs');
const path = require('path');
var __dirname = path.resolve(path.join(__dirname, 'models'));
const Sequelize = require('sequelize');

const sequelize = new Sequelize('posts_db', 'root', 'root', {
  host: process.env.DB_URL,
  dialect: 'mysql',
});

const db = {};

fs.readdirSync(__dirname).forEach((file) => {
  const model = require(path.join(__dirname, file))(
    sequelize,
    Sequelize.DataTypes
  );
  db[model.name] = model;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
