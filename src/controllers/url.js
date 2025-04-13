// used nanoid concept : for short url (it takes no. of characters & give url of that length ) npm i shortid
const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateShortURL(req, res) {
  const body = req.body; // user body mai pass krega original url STEP 3

  if (!body.url) return res.status(400).json({ error: "valid url required" });

  const shortID = shortid(); // now DB mai insert krna hai STEP 1

  await URL.create({
    // new url create krna then uski properties  STEP 2
    shortId: shortID,
    redirectURL: body.url, // this user will give you  STEP 4
    visitHistory: [],
  });
  //   return res.json({ id: shortID }); // STEP 5

  // SERVERS SIDE REDNERING : DONT SEND JSON STEP 13
  return res.render("home", {
    id: shortID, // abh iss id ko frontend pe show krskte h (HOEM.EJS : locala : jo backned sai data aa rha vo locals mai h )
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortid; // short id sai DB mai query kiya & uske baad jo bhi iski viist hostory usko send krdia
  const result = await URL.findOne({ shortId });
  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateShortURL,
  handleGetAnalytics,
};
