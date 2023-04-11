module.exports = async function newChatMemberEvent(bot, msg) {
  console.log(msg);
  await bot.deleteMessage(msg.chat.id, msg.message_id);
};
