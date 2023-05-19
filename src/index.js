const telegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
// Telegram Bot token
// const telegramToken = "6038591631:AAHicdMNLabrWcUK6AGrAAody68IBx61beU";
// const telegramToken = "6038591631:AAHicdMNLabrWcUK6AGrAAody68IBx61beU";
const telegramToken = process.env.TELEGRAM_TOKEN;



// Create a new Telegram Bot instance
const bot = new telegramBot(telegramToken, { polling: true });

bot.on("message", (message) => {
  const wikiRandomApiUrl2 = `https://en.wikipedia.org/api/rest_v1/page/random/summary`;
  const wikiRandomApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${message.text}`;
  console.log(message);
  
  if (message.text == "/start") {
    bot.sendMessage(
      message.chat.id,
      `Welcome ${message.from.first_name} 😊 to WiKi Bot 🤖! We're thrilled to have you here. Our bot specializes in fetching Wikipedia articles to provide you with instant knowledge on various topics. Just send a search query or a specific topic, and we'll fetch the relevant article for you. Feel free to explore and expand your knowledge with us. If you have any questions or need assistance, don't hesitate to ask. Enjoy exploring the world of information!  \n\n Here some command to use this Bot 🤖! \n '/start' -> to start the Bot \n '/stop' -> for stop the Bot  \n\n Type anything but in one word ! it will give you the results. \n Like : India, IPL etc.`
    );
    bot.sendMessage(message.chat.id, `Here is some random result for you 🔴`);
    
    postRandomWikiArticle2(wikiRandomApiUrl2,message.chat.id);
  } else if (message.text == "/stop" || message.text == "/deactivate") {
    bot.sendMessage(
      message.chat.id,
      `Thank you for using WiKi Bot 🤖! \n\n 
       We hope you found our Wikipedia articles informative and useful. If you have any more queries in the future, feel free to reach out. To stop receiving articles or deactivate the bot, simply type '/stop' or '/deactivate'. We appreciate your support and hope to see you again soon!`
    );
  }
//   else if(message.text == "/sourcecode"){
//     bot.sendMessage(message.chat.id, `See how i am build ${"https://github.com/Narayan2208"}`);
//   }

  postRandomWikiArticle(wikiRandomApiUrl, message.chat.id);
});


async function postRandomWikiArticle(wikiRandomApiUrl, id) {
  console.log(wikiRandomApiUrl, "wikiRandomApiUrl");
  try {
    const response = await axios.get(wikiRandomApiUrl);

    const article = response.data;

    
    const { title, extract, thumbnail } = article;

    
    bot.sendMessage(id, `*${title}*\n\n${extract}`, {
      parse_mode: "Markdown",
    });

    bot.sendPhoto(id, `${thumbnail.source}`, {
        parse_mode: "Markdown",
      });
  } catch (error) {
    console.error("Error fetching random Wikipedia article:");
  }
}

async function postRandomWikiArticle2(wikiRandomApiUrl2, id) {
  console.log(wikiRandomApiUrl2, "wikiRandomApiUrl");
  try {
    
    const response = await axios.get(wikiRandomApiUrl2);

    const article = response.data;
    

    const { title, extract, thumbnail } = article;

    
    bot.sendMessage(id, `*${title}*\n\n${extract}`, {
      parse_mode: "Markdown",
    });
    bot.sendPhoto(id, `${thumbnail.source}`, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error fetching random Wikipedia article:");
  }
}




