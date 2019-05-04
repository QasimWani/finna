var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");
var Comment = require("../models/comments");
var middleware = require("../middleware");



//Posting a Comment to a Campground
router.post("/", function(req, res){
   Post.findById(req.params.id, function(err, post) {
      if(err || !post)
      {
         req.flash("error", "Invalid id selected. Please try again without manually entering the id in the url");
         console.log("Unable to load Comment by particular ID");
         return res.redirect("back");
      }
      else
      {
         Comment.create(req.body.comment, function(err, comment) {
            if(err || !comment)
            {
               req.flash("error", "Unable to add a comment. Please try again later... The comment may have been deleted or the URL might have been inserted manually!");
               console.log("Unable to add a comment");
               res.redirect("back");
            }
            else
            {
               comment.author.id = req.user._id;
            //   comment.associatedPost = 
               comment.author.profilePicture = req.user.profilePicture;
               comment.author.firstName = req.user.firstName;
               comment.author.lastName = req.user.lastName;
               comment.author.username = req.user.username;
               comment.author.sex = req.user.sex;
               console.log("THIS IS THE USERNAME: "+ comment.author.username);
               comment.save();
               post.comments.push(comment);
               post.save();
               console.log("A new COMMENT was added SUCCESSFULLY!!!");
              req.flash("info", "Successfully added new comment");
               res.redirect("/feed/"+ post._id);
            }
         });
      }
   });
});


//Editing a comment
router.get("/:comment_id/edit", function(req, res){
    Post.findById(req.params.id, function(err, foundPost) {
        if(err || !foundPost) {
            req.flash("error", "No posts with the ID you entered MANUALLY found. How did I know? ... Magic!");
            return res.redirect("/feed/"+req.params.id);
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("/feed/"+req.params.id);
            } else {
                res.render("comments/edit", {post_id: req.params.id, comment: foundComment});
            }
        });
    });
});
    
//this is going to update a comment
router.put("/:comment_id",function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err || !updatedComment){
          res.redirect("back");
      }  else {
          req.flash("success", " Successfully edited your Comment!");
          res.redirect("/feed/" + req.params.id);
      }
   });
});
//deleting a comment
router.delete("/:comment_id", function(req, res){
Post.findById(req.params.id, function(err, post) {
if(err || !post)
{
  console.log("SOMETHING WENT WRONG", err.message);
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
           post.comments.pop(req.params.comment_id);
           post.save();
           res.redirect("/feed/"+ req.params.id);
       }
   }); 
    
}
    
});
});


router.get("*", middleware.bogusURL, function(req, res){
});  

module.exports = router;