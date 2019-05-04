var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
   title : String,
   image : String,
   video : String,
   description : String,
   price    : Number,
   date     : String,
   location : String,
   
   
   status : {
      currentUser: String,
      goingstatus: String
      },
   
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
           ref : "eventcomment"
         }
   ]
});
module.exports = mongoose.model("Event", eventSchema);