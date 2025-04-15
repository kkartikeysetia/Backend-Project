/*How to model this in my brain as data?
Ask:

“What do I need to store?”
“How does the data look?”

short url 
orginal 
logs each click
*/

const moongoose = require("mongoose");

const urlSchema = new moongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true, // becoz i dont want 2 peopel have same short url
  },

  redirectURL: {
    // original url :  The actual long URL user submitted.
    type: String,
    required: true,
  },

  visitHistory: [
    {
      // total clicks ; time kitne bhje click hua  // Arrys of objects  // An array of timestamps representing visits.
      timestamp: { type: Number },
    },
    { timestamps: true }, // Every time someone hits /:shortId, a timestamp is added here.
  ], // koi entry kitne bhje click huyi
});

const URL = moongoose.model("url", urlSchema);

module.exports = URL;
// You're getting an object like this: if i used { }

/* 1. User enters long URL ➝ POST /url ➝ Controller creates shortId ➝ Saves in DB
2. Server renders page with new short URL.
3. User visits /:shortId ➝ Controller finds long URL ➝ Pushes timestamp ➝ Redirects.
4. User visits /url/analytics/:id ➝ Controller returns visit data.
*/
