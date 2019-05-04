var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
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
module.exports = mongoose.model("Comment", commentSchema);