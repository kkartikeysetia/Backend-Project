const express = require("express");
const {
  handleGenerateShortURL,
  handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateShortURL);

// third route // GET /URL/analytics/:id - Returns the clicks for the provided short id.

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;

/* How do users interact with it? (Routes/Endpoints)
Think from the user’s perspective:

User submits a long URL ➝ needs a POST route (/url)
User clicks a short URL ➝ needs a GET route (/:shortId)
User wants analytics ➝ needs a GET route (/url/analytics/:shortId)

Ask:
📌 “What route? What method? What data is needed?”
This is how your routes are born.
*/
