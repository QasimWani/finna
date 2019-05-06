var mongoose = require("mongoose");

var startupSchema = new mongoose.Schema({
   startup : {
    title : String, //name of the startup
    image : String, //cover photo of the startup
    video : String, // trailer of the startup (if possible)
    mission : String, //short description of the startup stating Mission and etc...
    location : String, //location of the startup
    industry : String, //name of their industry
    keys: String, //key ingredients of startup
    website : String, //website of startup
   },
   // MORE Stuff to be added later...
   created : {type: Date, default: Date.now}, 
   author : {
      id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      username : String,
      firstName : String,
      lastName : String,
      profilePicture : String,
      email : String,
      sex   : String
   }
});
module.exports = mongoose.model("Startups", startupSchema);