var express = require("express");
var router  = express.Router({mergeParams: true});
var Startup = require("../models/startups");
var Comment = require("../models/startupcomments");
var middleware = require("../middleware");



//Posting a Comment to a Campground
router.post("/",middleware.isLoggedIn, function(req, res){
   Startup.findById(req.params.id, function(err, startup) {
      if(err || !startup)
      {
         req.flash("error", "Invalid id selected. Please try again without manually entering the id in the url");
         console.log("Unable to load Comment by particular ID");
         return res.redirect("back");
      }
      else
      {
        console.log("THIS IS COMMENT TEXT",req.body.comment.text);
         var text = req.body.comment.text,
             time = req.body.comment.time,
             nameOfStartup = req.body.comment.postTitle;
  var author = {
      id : req.user._id,
      username : req.user.username,
      firstName : req.user.firstName,
      lastName  : req.user.lastName,
      email : req.user.email,
      profilePicture : req.user.profilePicture,
      sex            : req.user.sex
  };
   var newlyCreatedComment = {nameOfStartup: nameOfStartup, text:text,time:time,author:author};
   console.log("The USER WHO POSTED THIS Post IS : " + author.username);
   console.log("The ID OF THIS POST IS : " + author.id);
   console.log("The DATE OF THE CREATION OF THE USER : " + author.date);
   Comment.create(newlyCreatedComment, function(err, comment){  
            if(err || !comment)
            {
               req.flash("error", "Unable to add a comment. Please try again later... The comment may have been deleted or the URL might have been inserted manually!");
               console.log("Unable to add a comment");
               res.redirect("back");
            }
            else
            {
               console.log("THIS IS THE USERNAME: "+ comment.author.username);
               startup.comments.push(comment);
               startup.save();
               console.log("A new COMMENT was added SUCCESSFULLY!!!");
              req.flash("info", "Successfully added new comment");
               res.redirect("/startups/"+ startup._id);
            }
         });
      }
   });
});


//Editing a comment
router.get("/:comment_id/edit", middleware.checkStartupCommentOwnership,function(req, res){
    Startup.findById(req.params.id, function(err, foundEvent) {
        if(err || !foundEvent) {
            req.flash("error", "No posts with the ID you entered found");
            return res.redirect("/startups/"+req.params.id);
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("/startups/"+req.params.id);
            } else {
                res.render("startupComments/edit", {event_id: req.params.id, comment: foundComment});
            }
        });
    });
});
    
//this is going to update a comment
router.put("/:comment_id",middleware.checkStartupCommentOwnership,function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err || !updatedComment){
          res.redirect("back");
      }  else {
          res.redirect("/startups/" + req.params.id);
      }
   });
});
//deleting a comment
router.delete("/:comment_id",middleware.checkStartupCommentOwnership, function(req, res){
  Startup.findById(req.params.id, function(err, startup) {
    if(err || !startup)
    {
      console.log("SOMETHING WENT WRONG", err.message);
      res.redirect("back");
    }
    else
    {
    
         Comment.findByIdAndRemove(req.params.comment_id, function(err){
           if(err){
               console.log("Oops. Something went wrong while deleting a comment...");
               res.redirect("back");
           } else {
              req.flash("info", " Successfully deleted your Comment!");
               console.log("A COMMENT with an ID : " + req.params.comment_id + " was deleted");
               startup.comments.pop(req.params.comment_id);
               startup.save();
               res.redirect("/startups/"+ req.params.id);
           }
       }); 
        
    }
        
    });
});


router.get("*", middleware.bogusURL, function(req, res){
});  

module.exports = router;