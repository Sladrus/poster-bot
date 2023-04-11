const { sequelize } = require('./db');
const TelegramBotApp = require('./telegramBot');
const express = require('express');

const start = async () => {
  try {
    await sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch((error) => {
        console.error('Unable to connect to the database: ', error);
      });
    await sequelize.sync({ force: false, alter: true });
    const botApp = new TelegramBotApp();
    botApp.start();
  } catch (e) {
    console.log(e);
  }
};

start();
