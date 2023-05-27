

const TelegramBot = require("node-telegram-bot-api");

const axios = require("axios");
const quotes = require("./quotes");
const request = require('request');
require("dotenv").config();

// Telegram Bot token
const telegramToken = process.env.TELEGRAM_TOKEN;
const apiKey = "YU7ZY9F+R2dRKuWTDcfjuA==8kZa5sQjr2TuSy0A"
// Create a new Telegram Bot instance
const bot = new TelegramBot(telegramToken, { polling: true });

bot.onText(/\/start/, (message) => {
  const wikiRandomApiUrl2 = "https://en.wikipedia.org/api/rest_v1/page/random/summary";
  bot.sendMessage(
    message.chat.id,
    `Welcome ${message.from.first_name} 😊 to WiKi Bot 🤖! We're thrilled to have you here. Our bot specializes in fetching Wikipedia articles to provide you with instant knowledge on various topics. Just send a search query or a specific topic, and we'll fetch the relevant article for you. Feel free to explore and expand your knowledge with us. If you have any questions or need assistance, don't hesitate to ask. Enjoy exploring the world of information!  \n\n Here some command to use this Bot 🤖! \n /start -> to start the Bot \n /stop -> for stop the Bot  \n\n Type anything but in one word ! it will give you the results. \n Like : /search india,  \n /git enter your git username here,  \n /weather enter city name`
  );
  bot.sendMessage(message.chat.id, `Here is some random result for you 🔴`);
  postRandomWikiArticle2(wikiRandomApiUrl2, message.chat.id);
});

bot.onText(/\/stop|\/deactivate/, (message) => {
  bot.sendMessage(
    message.chat.id,
    `Thank you for using WiKi Bot 🤖! \n\n 
    We hope you found our Wikipedia articles informative and useful. If you have any more queries in the future, feel free to reach out. To stop receiving articles or deactivate the bot, simply type '/stop' or '/deactivate'. We appreciate your support and hope to see you again soon!`
  );
});

bot.onText(/\/git (.+)/, (message, match) => {
  const username = match[1];
  const giturl = `https://api.github.com/users/${username}`;
  bot.sendMessage(message.chat.id, `Here is your full details of git profile`);
  gitUserDetails(giturl, message.chat.id);
});

bot.onText(/\/search (.+)/, (message, match) => {
  const searchKeyword = match[1];
  const wikiRandomApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchKeyword}`;
  bot.sendMessage(message.chat.id, `Here is your full details of your git profile`);
  postRandomWikiArticle(wikiRandomApiUrl, message.chat.id);
});

bot.onText(/\/weather (.+)/, (message, match) => {
  // console.log(message, "message");
  console.log(match, "match");
  const city = match[1];
  // console.log(city, "city");
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=c6e72197c01ce15e98847f552349c7e7&q=${city}&units=metric`;
  bot.sendMessage(message.chat.id, `Weather Forecast ☁️🤖`);
  weatherReport(weatherUrl, message.chat.id);
});


bot.onText(/\/quote/, (message) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  // console.log(message);
  bot.sendMessage( message.chat.id, `Here is your random quote ${message.from.first_name} 😊` );
  bot.sendMessage(message.chat.id, randomQuote);
});

async function postRandomWikiArticle(wikiRandomApiUrl, id) {
  try {
    const response = await axios.get(wikiRandomApiUrl);
    const article = response.data;
    const { title, extract, thumbnail } = article;
    bot.sendMessage(id, `*${title}*\n\n${extract}`, {
      parse_mode: "Markdown",
    });
    bot.sendPhoto(id, thumbnail?.source, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error fetching random Wikipedia article:", error);
  }
}

async function postRandomWikiArticle2(wikiRandomApiUrl2, id) {
  try {
    const response = await axios.get(wikiRandomApiUrl2);
    const article = response.data;
    const { title, extract, thumbnail } = article;
    bot.sendMessage(id, `*${title}*\n\n${extract}`, {
      parse_mode: "Markdown",
    });
    bot.sendPhoto(id, thumbnail?.source, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error fetching random Wikipedia article:", error);
  }
}

async function gitUserDetails(giturl, id) {
  try {
    const response = await axios.get(giturl);
    const allUserData = response.data;
    const { login, name, bio, location, followers, following, public_repos, avatar_url, html_url } = allUserData;

    bot.sendMessage(id, `*Username*: ${login}\n*Name*: ${name}\n*Bio*: ${bio == null ? "There is no bio" : bio}\n*Location*: ${location}\n*Followers*: ${followers}\n*Following*: ${following}\n*Public Repos*: ${public_repos}`, {
      parse_mode: "Markdown",
    });
    bot.sendMessage(id, `Visit your profile from here : 😊 \n*gitHub url* : ${html_url}`, {
      parse_mode: "Markdown",
    });
    
    bot.sendPhoto(id, avatar_url, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error fetching GitHub user details:", error);
  }
}

async function weatherReport(weatherUrl, id) {
  try {
    const response = await axios.get(weatherUrl);
    const allData = response.data;
    const { weather , name, main, wind, sys} = allData;
    console.log(allData, "weather");
    bot.sendMessage(id, `You want to know about *${name}, ${sys.country} * weather ☁️ , here is the mini weather report of *${name}* . \n*Type*: ${weather[0].main} \n*Description* : ${weather[0].description} \n*Temperature* : ${main.temp}°C\n*Feels like* : ${main.feels_like}°C\n*Min temperature* : ${main.temp_min}°C\n*Max temperature* : ${main.temp_max}°C\n*Max temperature* : ${main.humidity}%\n*Wind* : ${wind.speed}km/h`, {
      parse_mode: "Markdown",
    });
  
  } catch (error) {
    console.error("Error fetching GitHub user details:", error);
  }
}

// YU7ZY9F+R2dRKuWTDcfjuA==8kZa5sQjr2TuSy0A