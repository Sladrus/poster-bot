const userService = require('../service/user-service');

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

async function acceptMessage(bot, query) {
  console.log(query);
  const id = query.data.split('_')[1];
  const username = query.data.split('_')[2];
  const chat = chats[Number(query.data.split('_')[3])];
  const message = query.message?.text.split(':', 2)[1];
  const type = query.message?.text.split(':', 2)[0].includes('ПОКУПКА')
    ? '#куплю'
    : '#продам';
  try {
    await bot.answerCallbackQuery(query.id, 'Объявление опубликовано');
    await bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      { chat_id: query.message.chat.id, message_id: query.message.message_id }
    );
    await bot.sendMessage(
      chat.id,
      `${type}${message}\n\nКонтакт: @${username}`
    );
    await bot.sendMessage(
      id,
      `Ваше объявление опубликовано в чате ${chat.link}`
    );
    const currentTime = Date.now();
    console.log(currentTime);
    await userService.update(id, currentTime);
  } catch (e) {
    console.log(e);
  }
}

async function dismissMessage(bot, query) {
  const id = query.data.split('_')[1];
  const message = query.message;
  try {
    await bot.answerCallbackQuery(query.id, 'Объявление отклонено');
    await bot.deleteMessage(message.chat.id, message.message_id);
    await bot.sendMessage(
      id,
      `Ваше Объявление нарушает одно из правил публикации. Внимательнее изучите правила и напишите объявление в соответствие с ними.`
    );
  } catch (e) {
    console.log(e);
  }
}

async function banMessage(bot, query) {
  const id = query.data.split('_')[1];

  const message = query.message;
  try {
    await bot.answerCallbackQuery(query.id, 'Пользователь заблокирован');
    await bot.deleteMessage(message.chat.id, message.message_id);
    await bot.sendMessage(
      id,
      `Ваш аккаунт заблокирован за повторное нарушение правил публикации`
    );
    await userService.ban(id);
  } catch (e) {
    console.log(e);
  }
}

async function chooseChat(bot, query) {
  const type = query.data === 'buyMessage' ? 'buy' : 'sell';
  const message = query.message;
  const inline_keyboard = [
    [
      {
        text: 'Обмен денег в Кипре 🇨🇾 — карты, крипта, наличные',
        callback_data: 'chat_0_' + type,
      },
    ],
    [
      {
        text: 'Обмен валюты / Крипта / РФ и Европа',
        callback_data: 'chat_1_' + type,
      },
    ],
    [
      {
        text: 'Обмен Дубай / AED / USD / RUB / Крипта USDT / Валюта',
        callback_data: 'chat_2_' + type,
      },
    ],
  ];
  try {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(message.chat.id, 'Выберите чат для публикации:', {
      reply_markup: {
        inline_keyboard,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMessage(bot, query) {
  const chat = query.data.split('_')[1];
  const type =
    query.data.split('_')[2] == 'buy' ? '🟢 ПОКУПКА 🟢' : '🔴 ПРОДАЖА 🔴';
  const text =
    query.data.split('_')[2] == 'buy'
      ? 'Напишите ваше объявление в формате:\n\nКуплю (сумма и валюта) по (курс и способ расчёта) (локация)\n\nПример:\n<b>Куплю 10000$ по 81 руб на карту тинькофф, Стамбул</b>'
      : 'Напишите ваше объявление в формате:\n\nПродам (сумма и валюта) по (курс и способ расчёта) (локация)\n\nПример:\n<b>Продам 10000$ по 81 руб наличными, Стамбул</b>';
  const msg = query.message;
  await bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
  const onMessage = async (message) => {
    async function checkMessage(data) {
      const userId = 408390308;
      await bot.sendMessage(
        userId,
        `${type}\n\nПолучено новое объявление от @${message.from.username}:\n\n${message.text}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✅ Разрешить',
                  callback_data: `acceptMessage_${message.chat.id}_${message.from.username}_${chat}`,
                },
                {
                  text: '❌ Отклонить',
                  callback_data: `dismissMessage_${message.chat.id}`,
                },
                {
                  text: '🚫 Заблокировать',
                  callback_data: `banMessage_${message.chat.id}`,
                },
              ],
            ],
          },
        }
      );
    }
    if (message.chat.id != msg.chat.id) return;
    console.log(message);
    await checkMessage(query.data);

    await bot.sendMessage(
      message.chat.id,
      `Ваше объявление отправлено на модерацию. После проверки оно будет опубликовано`
    );
    await bot.removeListener('message', onMessage);
  };
  await bot.on('message', onMessage);
}

module.exports = async function callbackEvent(bot, query, match) {
  try {
    await bot.answerCallbackQuery(query.id);
  } catch (e) {
    console.log(e);
  }
  if (query.data.includes('acceptMessage')) {
    return await acceptMessage(bot, query);
  }
  if (query.data.includes('dismissMessage')) {
    return await dismissMessage(bot, query);
  }
  if (query.data.includes('banMessage')) {
    return await banMessage(bot, query);
  }
  if (!query.message.chat.username) {
    return await bot.sendMessage(
      query.message.chat.id,
      `У вас отсутствует юзернейм. Чтобы разместить объявление, добавьте его в настройках профиля и попробуйте еще раз..`
    );
  }
  const userId = query.message.chat.id;
  const user = await userService.findOrCreate(query.message);
  const currentTime = Date.now();

  if (user?.lastMessage) {
    console.log(currentTime, user.lastMessage);
    // Если да, то проверяем, прошло ли уже 24 часа с момента последнего сообщения
    const timeDiff = currentTime - user?.lastMessage;
    if (timeDiff < 86400000) {
      // 1000 мс * 60 с * 60 мин * 24 часа = 86400000 мс
      return await bot.sendMessage(
        userId,
        'Вы уже отправили сообщение в течение последних 24 часов. Попробуйте еще раз позже.'
      );
    }
  }
  if (user?.isBanned) {
    return await bot.sendMessage(
      query.message.chat.id,
      `Ваш аккаунт заблокирован за повторное нарушение правил публикации`
    );
  }
  if (query.data == 'buyMessage' || query.data == 'sellMessage') {
    return await chooseChat(bot, query);
  }
  if (query.data.includes('chat')) {
    return await getMessage(bot, query);
  }
};
