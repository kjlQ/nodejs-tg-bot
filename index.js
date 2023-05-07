const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const option = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "1", callback_data: 1 },
        { text: "2", callback_data: 2 },
        { text: "3", callback_data: 3 },
      ],
    ],
  }),
};

const retryOption = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "Yes", callback_data: "accepted" }]],
  }),
};

const startRound = (chatId) => {
  const randInt = Math.ceil(Math.random() * 3);
  chats[chatId] = randInt;
  return bot.sendMessage(chatId, "Take guess which number i've generated", option);
};

bot.setMyCommands([
  {
    command: "/info",
    description: "Show your info",
  },
  {
    command: "/game",
    description: "Guess the number",
  },
]);

(() => {
  bot.on("message", async (msg) => {
    const { first_name, username } = msg.from;
    const chatId = msg.chat.id;
    const text = msg.text;
    switch (text) {
      case "/start":
        await bot.sendSticker(
          chatId,
          "https://tlgrm.eu/_/stickers/039/535/0395358a-70e2-437f-9459-4101b904ede5/4.webp"
        );

        return bot.sendMessage(chatId, `Hi , the bot is started`);
      case "/info":
        return bot.sendMessage(chatId, `Your name is ${first_name} , your username is @${username}`);
      case "/game":
        return startRound(chatId);
      default:
        return bot.sendMessage(chatId, "Command not found");
    }
  });
  bot.on("callback_query", async (msg) => {
    const chatId = msg.message.chat.id;
    const { data } = msg;
    switch (data) {
      case String(chats[chatId]):
        return bot.sendMessage(chatId, `Exactly, the randomly generated number was ${data}`);
      case "accepted":
        return startRound(chatId);
      default:
        return bot.sendMessage(
          chatId,
          `You choose ${data}, the answer is ${chats[chatId]} .Want to play again ?`,
          retryOption
        );
    }
  });
})();
