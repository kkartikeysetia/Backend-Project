const moongoose = require("mongoose");

const urlSchema = new moongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true, // becoz i dont want 2 peopel have same short url
  },

  redirectURL: {
    // original url
    type: String,
    required: true,
  },

  visitHistory: [
    {
      // total clicks ; time kitne bhje click hua    // Arrys of objects
      timestamp: { type: Number },
    },
    { timestamps: true },
  ], // koi entry kitne bhje click huyi
});

const URL = moongoose.model("url", urlSchema);

module.exports = URL;
// You're getting an object like this: if i used { }
