var mongoose = require("mongoose");

var eventCommentSchema = new mongoose.Schema({
   nameOfPost : String,
   hasBeenEdited : false,
   text: String,
   time : String,
   author: 
   {
      id : {
         type : mongoose.Schema.Types.ObjectId,
         ref : "User"
      },
      username : String,
      firstName : String,
      lastName : String,
      profilePicture : String,
      sex: String
   }
   
});
module.exports = mongoose.model("EventComment", eventCommentSchema);