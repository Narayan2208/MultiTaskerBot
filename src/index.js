const TelegramBot = require("node-telegram-bot-api");
const googleTranslate = require("google-translate");
const axios = require("axios");
const quotes = require("./quotes");
const schedule = require("node-schedule");
const notifier = require("node-notifier");
require("dotenv").config();

// Telegram Bot token
const telegramToken = process.env.TELEGRAM_TOKEN;

// Create a new Telegram Bot instance
const bot = new TelegramBot(telegramToken, { polling: true });

bot.onText(/\/start/, (message) => {
  const wikiRandomApiUrl2 =
    "https://en.wikipedia.org/api/rest_v1/page/random/summary";
  bot.sendMessage(
    message.chat.id,
    `Welcome ${message.from.first_name} 😊 to our MultiTaskerBot 🤖!

    Get random articles, search results, quotes, quiz answers, weather updates, reminders, and worldwide news. Enjoy a seamless experience with our bot. Happy multitasking! 🌟  \n\n Here some command to START and STOP this Bot 🤖! \n /start -> to start the Bot \n /stop -> for stop the Bot. \n\n Developed by - Narayan Dutta`
  );
  bot.sendMessage(message.chat.id, ` \n\n Here is list of commands you can explore \n /search india,  \n /git enter your git username here,  \n /weather enter city name \n /quote \n /quiz \n /newstopic \n /newscategory \n /reminder take a break at 3:00 \n /play OOPS`);
  bot.sendMessage(message.chat.id, `Here is some random result for you 🔴`);
  postRandomWikiArticle2(wikiRandomApiUrl2, message.chat.id);
});

bot.onText(/\/stop|\/deactivate/, (message) => {
  bot.sendMessage(
    message.chat.id,
    `Thank you for using MultiTaskerBot 🤖! \n\n 
    We hope you found our bot informative and useful. If you have any more queries in the future, feel free to reach out. To stop receiving articles or deactivate the bot, simply type '/stop' or '/deactivate'. We appreciate your support and hope to see you again soon!`
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
  bot.sendMessage(
    message.chat.id,
    `Here is your full details of your git profile`
  );
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
  bot.sendMessage(
    message.chat.id,
    `Here is your random quote ${message.from.first_name} 😊`
  );
  bot.sendMessage(message.chat.id, randomQuote);
});

bot.on("message", (message) => {
  if (message.text == "/newstopic") {
   
    bot.sendMessage(
      message.chat.id,
      `Hey, ${message.from.first_name} 😊 please provide also country code and what news you want`
    );
    bot.sendMessage(
      message.chat.id,
      `Write in this format, -> /newstopic in modi\n it will give you all modi related news,\n Try Once`
    );
    bot.sendMessage(
      message.chat.id,
      `you can only search by 54 country's code,\n ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za`
    );
  } else if (message.text == "/newscategory") {
    bot.sendMessage(
      message.chat.id,
      `Hey, ${message.from.first_name} 😊 please provide also country code and category`
    );
    bot.sendMessage(
      message.chat.id,
      `Write in this format, -> /newscategory in sports \n it will give you all sports related news,\n Try Once`
    );
    bot.sendMessage(
      message.chat.id,
      `here is the list of category you can get, \n business, entertainment, general, health, science, sports, technology`
    );
  }else if(message.text == "/reminder"){
    bot.sendMessage(message.chat.id,`Hey, ${message.from.first_name}  please provide also reminder name and time in this format :  /reminder take a break at 3:00 \n it will send a notification.`);
  }else if(message.text == "/weather"){
    bot.sendMessage(message.chat.id,`Hey, ${message.from.first_name}  please provide city name also`);
  }else if(message.text == "/git"){
    bot.sendMessage(message.chat.id,`Hey, ${message.from.first_name}  please provide username name also`);
  }
});

bot.onText(/\/newstopic (.+)/, async (message, match) => {
  const countryName = match[1];

  const separatedWords = countryName.split(" ");
  console.log(separatedWords);
  console.log(match, "name");

  try {
    const newsAPIUrl = "https://newsapi.org/v2/top-headlines";
    const newsAPIKey = "9db1ffe15f26498eb15fd32fc07a57ae"; // Replace with your actual news API key

    const response = await axios.get(newsAPIUrl, {
      params: {
        country: separatedWords[0], // Replace with the desired country code
        // category : separatedWords[1],
        q: separatedWords[1],
        apiKey: newsAPIKey,
      },
    });

    const articles = response.data.articles;
    const maxMessageLength = 4096; // Telegram message character limit
    let messageChunks = [];

    articles.forEach((article) => {
      const headline = `*${article.title}*\n${article.description}\n${
        article.author == null ? "No author" : article.author
      }\n${article.url}`;
      if (headline.length <= maxMessageLength) {
        messageChunks.push(headline);
      }
    });

    if (messageChunks.length > 0) {
      bot.sendMessage(message.chat.id, "Here are the latest headlines:");
      messageChunks.forEach((chunk) => {
        bot.sendMessage(message.chat.id, chunk, { parse_mode: "Markdown" });
      });
    } else {
      bot.sendMessage(message.chat.id, "No headlines available.");
    }
  } catch (error) {
    console.error("Error fetching news headlines:", error);
  }
});

bot.onText(/\/newscategory (.+)/, async (message, match) => {
  const countryName = match[1];

  const separatedWords = countryName.split(" ");
  console.log(separatedWords);
  console.log(match, "name");

  try {
    const newsAPIUrl = "https://newsapi.org/v2/top-headlines";
    const newsAPIKey = "9db1ffe15f26498eb15fd32fc07a57ae"; // Replace with your actual news API key

    const response = await axios.get(newsAPIUrl, {
      params: {
        country: separatedWords[0], // Replace with the desired country code
        category: separatedWords[1],
        // q : separatedWords[1],
        apiKey: newsAPIKey,
      },
    });

    const articles = response.data.articles;
    const maxMessageLength = 4096; // Telegram message character limit
    let messageChunks = [];

    articles.forEach((article) => {
      const headline = `*${article.title}*\n${article.description}\n${article.url}`;
      if (headline.length <= maxMessageLength) {
        messageChunks.push(headline);
      }
    });

    if (messageChunks.length > 0) {
      bot.sendMessage(message.chat.id, "Here are the latest headlines:");
      messageChunks.forEach((chunk) => {
        bot.sendMessage(message.chat.id, chunk, { parse_mode: "Markdown" });
      });
    } else {
      bot.sendMessage(message.chat.id, "No headlines available.");
    }
  } catch (error) {
    console.error("Error fetching news headlines:", error);
  }
});




const questions = [
  {
    question: "What is the capital of France?",
    answer: "Paris",
  },
  {
    question: "What is the name of the current US president?",
    answer: "Joe Biden",
  },
  {
    question: "What is the chemical symbol for water?",
    answer: "H2O",
  },
];

bot.on("message", (message) => {
  if (message.text === "/quiz") {
    const question = questions[Math.floor(Math.random() * questions.length)];
    bot.sendMessage(message.chat.id, question.question);
    bot.on("message", (answer) => {
      if (answer.text === question.answer) {
        bot.sendMessage(message.chat.id, "Correct!");
      } else {
        bot.sendMessage(
          message.chat.id,
          "Incorrect! The answer was " + question.answer
        );
      }
      bot.removeListener("message", this);
    });
  }
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
    const {
      login,
      name,
      bio,
      location,
      followers,
      following,
      public_repos,
      avatar_url,
      html_url,
    } = allUserData;

    bot.sendMessage(
      id,
      `*Username*: ${login}\n*Name*: ${name}\n*Bio*: ${
        bio == null ? "There is no bio" : bio
      }\n*Location*: ${
        location == null ? "There is no location found" : location
      }\n*Followers*: ${followers}\n*Following*: ${following}\n*Public Repos*: ${public_repos}`,
      {
        parse_mode: "Markdown",
      }
    );
    bot.sendMessage(
      id,
      `Visit your profile from here : 😊 \n*gitHub url* : ${html_url}`,
      {
        parse_mode: "Markdown",
      }
    );

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
    const { weather, name, main, wind, sys } = allData;
    console.log(allData, "weather");
   await bot.sendMessage(
      id,
      `You want to know about *${name}, ${sys.country} * weather ☁️ , here is the mini weather report of *${name}* . \n*Type*: ${weather[0].main} \n*Description* : ${weather[0].description} \n*Temperature* : ${main.temp}°C\n*Feels like* : ${main.feels_like}°C\n*Min temperature* : ${main.temp_min}°C\n*Max temperature* : ${main.temp_max}°C\n*Max temperature* : ${main.humidity}%\n*Wind* : ${wind.speed}km/h`,
      {
        parse_mode: "Markdown",
      }
    );
    if(weather[0].main == "Clouds"){
      
      bot.sendDocument(id, "https://media.tenor.com/PLqmB_SmXQMAAAAM/clouds-sky.gif", {
        parse_mode: "Markdown",
      });
    }else if(weather[0].main == "Haze"){
      bot.sendDocument(id, "https://i.pinimg.com/originals/77/42/24/77422432ef2ee5f1ffbd8828b1bca3b9.gif", {
        parse_mode: "Markdown",
      });
      
    }else if(weather[0].main == "Clear"){
      bot.sendDocument(id, "https://media.tenor.com/reA9KS4hEqsAAAAd/dandelion-nature.gif", {
        parse_mode: "Markdown",
      });

    }
  } catch (error) {
    console.error("Error fetching GitHub user details:", error);
  }
}



// WITHOUT NOTIFICATION FEATURE
// bot.onText(/\/reminder (.+) at (.+)/, (message, match) => {
//   const chatId = message.chat.id;
//   const reminderText = match[1];
//   const reminderTime = match[2];

//   // Parse the reminder time (assuming format: HH:MM)
//   const [hours, minutes] = reminderTime.split(':').map(Number);

//   // Set up the reminder schedule
//   const reminderDate = new Date();
//   reminderDate.setHours(hours);
//   reminderDate.setMinutes(minutes);

//   // Create the reminder job
//   const reminderJob = schedule.scheduleJob(reminderDate, () => {
//     bot.sendMessage(chatId, `⏰ Reminder: ${reminderText}`);
//   });

//   bot.sendMessage(chatId, 'Reminder set successfully!');
// }); 

// 9db1ffe15f26498eb15fd32fc07a57ae
// const apiKey = "YU7ZY9F+R2dRKuWTDcfjuA==8kZa5sQjr2TuSy0A";

// Google Calendar credentials
// const credentials = {
//   client_email: process.env.GOOGLE_CLIENT_EMAIL,
//   private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
// };

// Create a new Google Calendar client
// const calendar = google.calendar({
//   version: 'v3',
//   auth: new google.auth.GoogleAuth({
//     credentials,
//     scopes: ['https://www.googleapis.com/auth/calendar'],
//   }),
// });

// // Listen for the /schedule command
// bot.onText(/\/schedule/, (message) => {
//   bot.sendMessage(message.chat.id, 'Please provide the event details in the following format:\n/schedule Event Title, Start Date, Start Time, End Date, End Time');
// });

// // Listen for the /schedule command with parameters
// bot.onText(/\/schedule (.+)/, async (message, match) => {
//   const chatId = message.chat.id;
//   const params = match[1].split(',').map((param) => param.trim());

//   if (params.length !== 5) {
//     bot.sendMessage(chatId, 'Invalid event details. Please provide the details in the correct format:\n/schedule Event Title, Start Date, Start Time, End Date, End Time');
//     return;
//   }

//   const [title, startDate, startTime, endDate, endTime] = params;

//   const event = {
//     summary: title,
//     start: {
//       dateTime: `${startDate}T${startTime}:00`,
//       // dateTime: `'2023-05-01T14:30:00'`,
//       timeZone: 'Asia/Kolkata', // Replace with your timezone
//     },
//     end: {
//       dateTime: `${endDate}T${endTime}:00`,
//       // dateTime: `${endDate}T${endTime}:00`,
//       timeZone: 'Asia/Kolkata', // Replace with your timezone
//     },
//   };

//   try {
//     // Insert the event into the Google Calendar
//     const response = await calendar.events.insert({
//       calendarId: 'primary',
//       resource: event,
//     });

//     bot.sendMessage(chatId, 'Event scheduled successfully!');
//     console.log('Event created:', response.data);
//   } catch (error) {
//     bot.sendMessage(chatId, 'An error occurred while scheduling the event. Please try again later.');
//     console.error('Error creating event:', error);
//   }
// });

// // Start the bot
// bot.onText(/\/start/, (message) => {
//   bot.sendMessage(
//     message.chat.id,
//     'Welcome to your Telegram Bot!\nYou can use the /schedule command to schedule events on Google Calendar.'
//   );
// });


// Replace with your YouTube Data API key
const youtubeApiKey = "AIzaSyCKMWv2vMiz480rFPEf7nu1J8hR7lfxb6I";

bot.onText(/\/play (.+)/, async (message, match) => {
  const chatId = message.chat.id;
  const musicName = match[1];

  try {
    // Search for videos based on the music name
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      musicName
    )}&key=${youtubeApiKey}&type=video`;
    const response = await axios.get(searchUrl);
    
    if (response.data.items.length === 0) {
      bot.sendMessage(chatId, 'No videos found for the given music name.');
      return;
    }

    // Retrieve the first video from the search results
    const videoId = response.data.items[0].id.videoId;

    // Create a link to the YouTube video
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    bot.sendMessage(chatId, `You can listen to the music here: ${videoUrl}`);
  } catch (error) {
    console.error('Error occurred while searching for music:', error);
    bot.sendMessage(chatId, 'An error occurred while searching for music.');
  }
});


// newbotapikey= 6127525408:AAGE7VRLeUTUi51Ypp0aPD5ONqjfwkS0C7I