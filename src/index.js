// Design a URL shortener service that takes in a valid URL and returns a shortened URL, redirecting the user to the previously provided URL.
// Also, keep track of total visits/clicks on the URL.
// Routes
// POST /URL - Generates a new short URL and returns the shortened URL in the format example.com/random-id.
// GET /:id - Redirects the user to the original URL
// GET /URL/analytics/:id - Returns the clicks for the provided short id.

const express = require("express"); // STEP 1
const URLRoute = require("./routes/url.js"); // STPE 2

const { connectToMongoDB } = require("./connect.js"); // STEP 3
const URL = require("./models/url.js"); // becoz of step 6 yeh apne controllers mai kara tha

const path = require("path"); // STEP 8

const staticRoute = require("./routes/staticRouter.js"); // STEP 11

const app = express(); // STEP 1
const PORT = 8001;

// FORM DATA KO PASS KRNE KAI LIYE EK OR MIDDLEWARE CHAHIYE
app.use(express.urlencoded({ extended: false })); // STEP 13

// use middlware(express.json) : jo incoming body ko pass kar sakey // STEP 5
app.use(express.json());

app.use("/url", URLRoute); // STEP 2 // POST /url here!
app.use("/", staticRoute); // STEP 12 make static route page

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

// STEP 6 (GET ROUTE) // firstly we will fetch from Database, usko increment krna & uske baad user ko redirect krna hai
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId; // jo shortid merko user ne dii hai

  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        // push use kiya becoz array hai
        visitHistory: {
          Timestamp: Date.now(),
        },
      },
    },
    { new: true } // to return the updated document
  );
  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.redirect(entry.redirectURL);
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

app.set("views", path.resolve("./views")); // STEP 9 mera viewengine ejs hai & files sari yaha padhi h

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

// database : prblms aye gyi (try, catch mai wrap ) (database sai baat kar time lgta h : ASYNCH AWAIT )

// require("dotenv").config({ path: "./env" });
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import connectDB from "./db/index.js";

// take file in db folder wha code likha kar impoert

// dotenv.config({
//   path: "./.env",
// });

// connectDB();

/*
import express from "express"
const app=express()   // express app : reprsents server 
// IIFE :  runs immediately after being defined
// you can use await to pause and wait for things to finish (like connecting to a database) without needing to create a new function somewhere else.
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); // connect kai liye string (environment variables for security.)
    //database jab connected to app LISTENRES MILTE H
    // Eg: ERRORR EVNENT LISNER
    app.on("error", (error)=>{    // express mai error
        console.log("ERROR: ", error);
        throw error
        
    })
    // IF the database connection is successful, the server starts listening on the specified port
    app.listen(process.env.PORT, ()=>{
        console.log(`App is listenig on port ${process.env.PORT}`);
        
    })

  } catch (error) {
    console.log("ERROR: ", error);
    throw err;
  }
})();
*/
