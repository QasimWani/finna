var express = require("express"),
    methodOverride   = require("method-override"),
    router  = express.Router(),
    Post = require("../models/posts"),
    User = require("../models/user"),
    Event = require("../models/events"),
    multer = require("multer"),
    middleware = require("../middleware");
const upload = multer({'dest':'uploads/'});
//Post get request
router.get("/", middleware.isLoggedIn, function(req, res){
     Post.find({}).sort({created:-1}).exec(function(err, allPosts){
      if(err || !allPosts)
      {
         req.flash("error", "Couldn't load the posts... Try again");
         res.redirect("back");
      }
      else
      {
          console.log(req.user.username);
         Event.find({"author.username": req.user.username}, function(err, userEvents){
             if(err)
             {
                 console.log("Something went wrong!", err.message);
             }
             else
             {
                
                console.log("All Post displayed onto the website");
                res.render("posts/index", {posts : allPosts, event : userEvents}); 
             }
         });
         
         
      }
      
   });
});
router.use(methodOverride("_method"));
//Post post request
router.post("/", middleware.isLoggedIn, function(req, res){
   var title = req.body.title,
   image = req.body.image,
   video = req.body.video,
   dateCreated = req.body.dateCreated,
   description = req.body.description,
   date = req.body.date;
  var author = {
      id : req.user._id,
      username : req.user.username,
      firstName : req.user.firstName,
      lastName  : req.user.lastName,
      email : req.user.email,
      profilePicture : req.user.profilePicture,
      sex            : req.user.sex
  };
   var newPost = {title : title, image : image, video : video, description : description, date : date, dateCreated : dateCreated, author:author};
   console.log("The USER WHO POSTED THIS Post IS : " + author.username);
   console.log("The ID OF THIS POST IS : " + author.id);
   console.log("The DATE OF THE CREATION OF THE USER : " + author.date);
   Post.create(newPost, function(err, Post){
      if(err || !Post)
      {
         console.log("Something went wrong!");
         console.log(err);
         res.redirect("back");
      }
      else
      {
         console.log("A new Post was added to the database");
         console.log(Post);
         req.flash("success", "Successfully added " + Post.title);
         res.redirect("/feed");
      }
   });
   console.log("Add Post page request was made");
   
});


//Detailed page review SHOW ROUTE
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundId){
       if(err || !foundId){
          req.flash("error", "Invalid URL.");
          res.redirect("/feed");
       }
       else
       {
          User.findById(foundId.author.id, function(err, userDeatils) {
             if(err || !userDeatils)
             {
                 console.log("Something went wrong!");
                 res.redirect("/feed");
             }
             else
             {
                
                Post.find({}).exec(function(err, allPosts){
                if(err || !allPosts)
                  {
                     req.flash("error", "Couldn't load the posts... Try again");
                     res.redirect("back");
                  }
                  else
                  {
                    // console.log(allPosts.length);
                     var postUsers = 0, postArray = [];
                     var currentEmail = foundId.author.email;
                    for(var i = 0; i < allPosts.length; i++)
                    {
                        if(currentEmail === allPosts[i].author.email)
                        {
                          postUsers = allPosts[i].author.email;
                          postArray.push(postUsers);
                          console.log(postUsers + " has posted : " + postArray.length);   
                        }
                    }
                    console.log(postArray.length);
                    res.render("posts/show", {post:foundId, user: userDeatils, count: postArray.length});
                  }
               });
             }
          });
       }
    });
});

//Edit a PostHouse route
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res) {
    Post.findById(req.params.id, function(err, foundId){
       if(err || !foundId){
          console.log("Something went wrong while handling id");
       }
       else
       {
             console.log("User taken to edit Post page");
             
            res.render("posts/edit", {post : foundId});
       }
    });
});
//this is going to update the Post house
router.put("/:id", middleware.checkPostOwnership, function(req, res){
   Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedBlog){
      if(err){
          res.redirect("/feed");
      }  else {
         req.flash("info","Successfully edited " + req.body.post.title);
        console.log(req.body.post.title + " was edited!");
         res.redirect("/feed/" + req.params.id);
      }
   });
});
//deleting a Post
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log("Oops. Something went wrong while deleting a Post house...");
           res.redirect("/feed");
       } else {
          req.flash("info", "Successfully deleted your Post!");
           console.log("A Post house was deleted");
           res.redirect("/feed");
       }
   });
});

router.get("*", middleware.bogusURL, function(req, res){
});  

module.exports = router;