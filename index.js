const TelegramApi = require("node-telegram-bot-api");

const token = "6113366027:AAFA_ROgDaqbRgXerIps3CJGDleGessN8Pg";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const gameOption = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "1", callback_data: 1 },
        { text: "2", callback_data: 2 },
      ],
    ],
  }),
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
    if (text === "/start") {
      return bot.sendMessage(chatId, `Hey, how can i help you ?`);
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Your name is ${first_name} , your username is ${username}`);
    }
    if (text === "/game") {
      const randInt = Math.ceil(Math.random() * 2);
      chats[chatId] = randInt;
      return bot.sendMessage(chatId, "Guess the number" + randInt, gameOption);
    }
    return bot.sendMessage(chatId, "Command not found");
  });
  bot.on("callback_query", async (msg) => {
    console.log(msg);
    const chatId = msg.message.chat.id;
    const { data } = msg;
    return bot.sendMessage(chatId, `You typed on ${data} , ${chats[chatId]}`);
  });
})();
