module.exports = async function pushCommand(bot, msg, args) {
  console.log(msg);
  if (msg.chat.id === 408390308 || msg.chat.id === 1274681231) {
    const chats = [
      {
        link: 'https://t.me/hawalarussia',
        name: 'Обмен денег в Кипре 🇨🇾 — карты, крипта, наличные',
        id: -1001640835957,
      },
      {
        link: 'https://t.me/+ynjVgAYGN4RmYjIy',
        name: 'Обмен валюты / Крипта / РФ и Европа',
        id: -1001720069478,
      },
      {
        link: 'https://t.me/+QBlHiEO5pUY2OTli',
        name: 'Обмен Дубай / AED / USD / RUB / Крипта USDT / Валюта ',
        id: -1001649865487,
      },
    ];
    const message = `❕Правила публикации объявлений❕\nЧтобы исключить спам, все объявления проходят модерацию и публикуются через @postingsmanager_bot\nЧтобы опубликовать своё объявление вам необходимо:\n1) Активировать бота\n2) Ознакомиться с правилами\n3) Отправить объявление на проверку\nПосле модерации объявление публикуется с указанием ваших контактов`;
    for (const chat of chats) {
      try {
        await bot.sendMessage(chat.id, message);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
