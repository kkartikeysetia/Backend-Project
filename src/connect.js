// MONGOOSE CONNECTION

const moongoose = require("mongoose");

async function connectToMongoDB(url) {
  return moongoose.connect(url);
}

module.exports = {
  connectToMongoDB,
};
