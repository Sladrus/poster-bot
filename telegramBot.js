const TelegramBot = require('node-telegram-bot-api');
const Command = require('telegram-command-handler');
require('dotenv').config();

class TelegramBotApp {
  constructor() {
    this.botToken = process.env.BOT_TOKEN;
    this.bot = new TelegramBot(this.botToken, { polling: true });
  }

  start() {
    this.registerEvent('new_chat_members', this.bot);
    this.registerEvent('callback_query', this.bot);
    this.registerEvent('message', this.bot);
    this.registerCommand('start');
    this.registerCommand('push');

    console.log(`Telegram Bot started`);
  }

  registerEvent(name, bot) {
    const path = './events/' + name;
    const callback = require(path);

    bot.on(name, async (message) => {
      await callback(bot, message);
    });
  }

  registerCommand(name) {
    const commandName = new Command(this.bot, name);
    const path = './commands/' + name;

    // Динамически загружаем модуль с обработчиком команды
    const callback = require(path);

    // Регистрируем обработчик команды с указанным именем и командой
    commandName.on('receive', async (msg, args) => {
      // Вызываем метод обработчика команды, передав ему объект сообщения и аргументы команды
      await callback(this.bot, msg, args);
    });
  }
}

module.exports = TelegramBotApp;
