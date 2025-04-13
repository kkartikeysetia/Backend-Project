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
