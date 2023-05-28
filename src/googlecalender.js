const { google } = require('googleapis');
const express =  require("express")

const app = express();

const PORT = process.env.NODE_ENV || 8000;

// Create a new Google Calendar client
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  ) 

const scopes = [
    "https://www.googleapis.com/auth/calender"
]

app.get ("google", (req, res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type : "offline",
        scope : scopes
    })
    res.redirect(url);
})

app.get("/google/redirect", (req,res)=>{
    res.send("it's working")
})

app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT);
})