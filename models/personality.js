var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var PersonalitySchema = new mongoose.Schema({
      user : { username: String, personalUserID : String, hasCompleted : false },
      answers : 
      { 
         first: String,
         second: String,
         third: String,
         fourth: String,
         fifth: String,
         sixth: String,
         seventh : String,
         eight : String,
         ninth : String,
         tenth : String
      } 
});
PersonalitySchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Personality", PersonalitySchema);