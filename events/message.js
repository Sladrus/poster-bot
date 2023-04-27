function isCommand(text) {
  const commands = ['/start', '/push'];
  return commands.includes(text) ? text : null;
}

module.exports = async function messageEvent(bot, msg, match) {
  console.log(msg);
  // await bot.sendMessage(msg.chat.id, 'Received your message');
};
