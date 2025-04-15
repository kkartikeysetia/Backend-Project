// 1. Imports
// 2. App initialization
// 3. Middleware definitions
// 4. Route definitions
// 5. DB connection
// 6. Start server (only after DB is connected)

// Imports
const express = require("express"); // STEP 1 Express helps create web servers and handle routes easily.After loading you can use express() to initialize your app
const path = require("path"); // STEP 8

// Routes
// Whatever you export in routes/url.js is used here with .use("/url", ...)
const URLRoute = require("./routes/url.js"); // STPE 2 : Brings in the URL-related routes like /url, /analytics/:id.(get post), This avoids cluttering the main file.
const staticRoute = require("./routes/staticRouter.js"); // STEP 11

//  DB Connection
const { connectToMongoDB } = require("./connect.js"); // STEP 3 : Imports a function that connects to your MongoDB database.
// Why: Your app needs DB access before storing or fetching any data. How: This function uses Mongoose to connect using a MongoDB URI.

// Optional: only if needed in this file
const URL = require("./models/url.js"); // becoz of step 6 yeh apne controllers mai kara tha

const app = express(); // STEP 1
const PORT = 8001; // STEP 1

// Middlewares
// FORM DATA KO Parse KRNE KAI LIYE this MIDDLEWARE CHAHIYE
app.use(express.urlencoded({ extended: false })); //  Makes req.body usable for form submissions. // STEP 13

// use middlware(express.json) : jo incoming body ko parse karne kai liye : parses them into JS objects. // STEP 5
app.use(express.json()); // Without it, req.body for JSON POST requests won’t work Because when we send JSON via POST (like in Postman), backend won’t understand it without this

//  Use Routes
app.use("/url", URLRoute); // STEP 2  All /url related requests go to url.js router ,  All logic about URL shortening stays in one place.
app.use("/", staticRoute); // STEP 12 make static route page : Handle root (homepage) route, To display the form and URL analytics on a browser.

// Connect to DB and Start Server
connectToMongoDB("mongodb://localhost:27017/short-url").then(
  () => console.log("mongo db connected") // STEP  4 ( / database ka naam )
);

/*
OUTPUT I GOT (POST REQUEST PER)

test> show dbs
admin       40.00 KiB
app-1      108.00 KiB
config      72.00 KiB
local       80.00 KiB
short-url   12.00 KiB
test> use short-url
switched to db short-url
short-url> show collections
urls
short-url> db.urls.find({})
[
  {
    _id: ObjectId('67fa2ecad70d949df895a9d7'),
    shortId: 'oIY7R9k4u',
    redirectURL: 'https://piyushgarg.dev',
    visitHistory: [],
    __v: 0
  }
]

*/

// So when someone goes to localhost:8001/oIY7R9k4u, they get redirected to ORIGINAL URL
// STEP 6 (GET ROUTE) Handles the actual redirection logic for short URLs.
// firstly we will fetch from Database, usko increment krna & uske baad user ko redirect krna hai
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId; // jo shortid merko user ne dii hai : Gets shortId from req.params

  const entry = await URL.findOneAndUpdate(
    {
      shortId, // Finds matching URL in DB.
    },
    {
      $push: {
        // push use kiya becoz array hai
        visitHistory: {
          Timestamp: Date.now(), // Increments the visitHistory with timestamp.
        },
      },
    },
    { new: true } // to return the updated document
  );
  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.redirect(entry.redirectURL); // Redirects the user to the original long URL.
});

// ALSO POSTMAN PER YEH TYPE KIYA :http://localhost:8001/oIY7R9k4u   // short id got after psot rquest // after paste in chrome i got same website
/* OUTPUT  I GOT AFTER (GET REQUEST)
short-url> db.urls.find({})
[
  {
    _id: ObjectId('67fa2ecad70d949df895a9d7'),
    shortId: 'oIY7R9k4u',
    redirectURL: 'https://piyushgarg.dev',
    visitHistory: [ { _id: ObjectId('67fa32af3b46b229af4e9ed8') } ],
    __v: 0
  }
]
  */

// NOW ROUTE 3 TURN in other file

/********* HTML RENDER : SERVER SIDE REDNERING **/
// app.get("/test", async (req, res) => {        STEP 7
//   // its not posible ki hmara sara html css yaha render karey , navbar bhi , styling bhi
//   const findurl = await URL.find({});
//   return res.end(`
//   <html>
//   <head></head>

//  <body>
// <ol>
// ${findurl.map((url) => `<li> ${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}  </li>`).join("")}
// </ol>
//  </body>
//   </html>

//   `);
// });
// EITHER U WRITE FULL HTML HERE OR WE HAVE ENGINES FOR THAT (EJS, PUG, HANDLEBARS) for server side rendering

// SERVER SIDE RENDERING
app.set("view engine", "ejs"); // STEP 7 mene express ko bta diya mene view engine use krna h server side rendering kai liye
// Sets EJS as the view engine for SSR

app.set("views", path.resolve("./views")); // STEP 9 mera viewengine ejs hai & files sari yaha padhi h
// tells Express where your .ejs templates are stored. : Why: Without this, Express won’t know where to look for views

// STEP 10 (EJS SERVER SIDE RENDERING)
app.get("/test", async (req, res) => {
  const allurl = await URL.find({});
  return res.render("home", {
    urls: allurl, // we can render anything here name, age etc NOW TO SHOW THIS ON FRONTEND go to home.ejs
  });
});

app.listen(PORT, () => console.log(`Server Started:${PORT}`));
// HOME.EJS : agar id nhi hai form chlage render homepage post req / url per : backend mai gya handlecreatenewuser : render homepage + id
// abh id mil gyi dubaara home.ejs pe aye : abhbid kai sath broswer per dikhegye

// render all urls to frontend: make static route mai url find nd next line

// NOW MAKE TABLE : URL per kitne bari clicks huye
