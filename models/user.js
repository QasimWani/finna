var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    username : String,
    password : String,
    email    : String,
    sex      : String,
    googleId : String,
    
    university : String,
    collegeMajor : String,
    birthday  : String,
    profilePicture : String, //profile image
    coverPhoto : String, //cover photo of an individual
    biography : String, //Short bio
    classOf : String, //Class of ???
    created : {type: Date, default: Date.now},
    posts : [
         {
           type : mongoose.Schema.Types.ObjectId,
           ref : "Post"
         }
   ]
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);