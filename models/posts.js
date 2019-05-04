var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
   title : String,
   image : String,
   video : String,
   description : String,
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
   },
   comments : [
         {
           type : mongoose.Schema.Types.ObjectId,
           ref : "Comment"
         }
   ]
});
module.exports = mongoose.model("Posts", postSchema);