// used shortid concept : for short url (it takes no. of characters & give url of that length ) npm i shortid
const shortid = require("shortid");
const URL = require("../models/url");

// Handles POST request to shorten a URL. , We want to take a long URL and give a short, unique ID.
async function handleGenerateShortURL(req, res) {
  const body = req.body; // user body mai pass krega original url STEP 3 (What is the input from the user? You're getting what the user submitted (the long URL).)

  if (!body.url) return res.status(400).json({ error: "valid url required" }); // Validates if user sent a URL (What do I want to give back? Because if they didn’t send any URL, you can’t do anything!)

  const shortID = shortid(); // now DB mai insert krna hai STEP 1 // Uses shortid to generate a unique 7-9 character ID.

  // (What should I do with the input before that? ou're making a unique short code like "a1b2c3d" to use in your link., You’re saving the mapping into the database so later you can look up what original URL belongs to this short ID.)

  // new url create krna then uski properties  STEP 2 // It saves { shortId, redirectURL, visitHistory } in MongoDB
  await URL.create({
    shortId: shortID,
    redirectURL: body.url, // this user will give you  STEP 4
    visitHistory: [],
  });

  //   return res.json({ id: shortID }); // STEP 5

  // SERVERS SIDE REDNERING : DONT SEND JSON STEP 13 (Now you’re showing the user their shortened URL (localhost:8001/<shortID>))
  return res.render("home", {
    id: shortID, // abh iss id ko frontend pe show krskte h (HOEM.EJS : locala : jo backned sai data aa rha vo locals mai h )
  });
}

/* REDIRECT KA LOGIC 
How do I handle a redirect?
User hits: localhost:3000/x7yz12

You:

Look up x7yz12 in the DB
Find the original URL
Log the timestamp
Redirect user

This is the core of your redirect logic.
*/

/*
 How to track analytics?
Every time someone clicks:

Push a { timestamp: Date.now() } to the visitHistory array in DB.

Then when someone calls /url/analytics/:shortId, you just return that array.
*/

// Returns click analytics for a short link.
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortid; // short id sai DB mai query kiya & uske baad jo bhi iski viist hostory usko send krdia
  const result = await URL.findOne({ shortId }); // Extracts shortId from the URL.. Finds the corresponding DB entry.
  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  return res.json({
    totalClicks: result.visitHistory.length, // Count and return total number of clicks (based on visitHistory.length)
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateShortURL,
  handleGetAnalytics,
};

/*
What do I want to happen?”

You want:
A person sends a long URL (e.g., YouTube link).
Your system should store it, create a shorter name for it.
When someone visits that shorter name, it should redirect to the original long URL.
(Optional) Track how many people clicked it.

Let’s break it into natural actions:
A user sends you this: any url of any website 

"I need to check if they gave me a URL"
→ 🤖 Logic: if (!body.url) return error

"I need to give it a unique short name"
→ 🤖 Logic: Use a library (shortid) or random 7-char string.

"I’ll save that mapping: short name => long URL"
→ 🤖 Logic: Save it in MongoDB with fields like { shortId, redirectURL }

"Now I show the user their short URL"
→ 🤖 Logic: Render home page again with the short URL in it.

Real Action	                          Backend Thinking
Did the user enter something?	    if (!body.url)
Create a code name for the URL     	const shortId = shortid.generate()
Save this mapping somewhere	        ShortURL.create({ shortId, redirectURL })
Show the user their new short URL	res.render('home', { id: shortId })

## You’re just: checking  generating  saving   responding

##  How to Train This Thinking?
Start with these 4 questions for any project:

What is the input from the user?
→ e.g., A URL they type in.

What do I want to give back?
→ e.g., A short link like /abc123

What should I do with the input before that?
→ e.g., Check it's valid, generate short code, save in DB.

What should I remember/store?
→ e.g., Save { shortId, originalURL } in DB

*/
