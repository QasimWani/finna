var express = require("express"),
    methodOverride   = require("method-override"),
    router  = express.Router(),
    // Post = require("../models/posts"),
    User = require("../models/user"),
    Event = require("../models/events"),
    Startup = require("../models/startups"),
    multer = require("multer"),
    middleware = require("../middleware");
const upload = multer({'dest':'uploads/'});
//Post get request
// router.post("/startups/new", middleware.isLoggedIn, function(req, res){
//      Startup.find({}).sort({created:-1}).exec(function(err, allPosts){
//       if(err || !allPosts)
//       {
//          req.flash("error", "Couldn't load the posts... Try again");
//          res.redirect("back");
//       }
//       else
//       {
//           console.log(req.user.username);
//          Event.find({"author.username": req.user.username}, function(err, userEvents){
//              if(err)
//              {
//                  console.log("Something went wrong!", err.message);
//              }
//              else
//              {
                
//                 console.log("All Post displayed onto the website");
//                 res.render("posts/index", {posts : allPosts, event : userEvents}); 
//              }
//          });
         
         
//       }
      
//    });
// });
router.use(methodOverride("_method"));
//Post post request
router.post("/new", middleware.isLoggedIn, function(req, res){
   
    var startup = {
    title : req.body.startup_name,
    website : req.body.startup_website,
    keys : req.body.startup_keys,
    image : req.body.startup_image,
    video : req.body.startup_video,
    description : req.body.startup_description,
    mission : req.body.startup_mission,
    location : req.body.startup_location,
    industry : req.body.startup_industry,
   } 
   
   
  var author = {
      id : req.user._id,
      username : req.user.username,
      firstName : req.user.firstName,
      lastName  : req.user.lastName,
      email : req.user.email,
      profilePicture : req.user.profilePicture,
      sex            : req.user.sex
  };
   var newStartup = {startup:startup, author:author};
   console.log("The USER WHO POSTED THIS STARTUP IS : " + author.username);
   console.log("The ID OF THIS STARTUP IS : " + author.id);
   console.log("The DATE OF THE CREATION OF THE USER : " + author.date);
   Startup.create(newStartup, function(err, Startup){
      if(err || !Startup)
      {
         console.log("Something went wrong!");
         console.log(err);
         res.redirect("back");
      }
      else
      {
         console.log("A new Post was added to the database");
         console.log(Startup);
         req.flash("success", "Congratulations on adding " + Startup.startup.title + " to your list of startup. Can't wait to see what happens next!");
         res.redirect("/users/"+ req.user.username);
      }
   });
   console.log("Add Startup page request was made");
   
});


//Detailed page review SHOW ROUTE
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    Startup.findById(req.params.id).populate("comments").exec(function(err, foundId){
       if(err || !foundId){
          req.flash("error", "Invalid URL.");
          res.redirect("back");
       }
       else
       {
          User.findById(foundId.author.id, function(err, userDeatils) {
             if(err || !userDeatils)
             {
                 console.log("Something went wrong!");
                 res.redirect("back");
             }
             else
             {
                
                Startup.find({}).exec(function(err, allPosts){
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
                    res.render("startups/show", {post:foundId, user: userDeatils, count: postArray.length});
                  }
               });
             }
          });
       }
    });
});

// //Edit a PostHouse route
// router.get("/:id/edit", middleware.checkPostOwnership, function(req, res) {
//     Post.findById(req.params.id, function(err, foundId){
//        if(err || !foundId){
//           console.log("Something went wrong while handling id");
//        }
//        else
//        {
//              console.log("User taken to edit Post page");
             
//             res.render("posts/edit", {post : foundId});
//        }
//     });
// });
// //this is going to update the Post house
// router.put("/:id", middleware.checkPostOwnership, function(req, res){
//    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedBlog){
//       if(err){
//           res.redirect("/feed");
//       }  else {
//          req.flash("info","Successfully edited " + req.body.post.title);
//         console.log(req.body.post.title + " was edited!");
//          res.redirect("/feed/" + req.params.id);
//       }
//    });
// });
// //deleting a Post
// router.delete("/:id", middleware.checkPostOwnership, function(req, res){
//     Post.findByIdAndRemove(req.params.id, function(err){
//        if(err){
//            console.log("Oops. Something went wrong while deleting a Post house...");
//            res.redirect("/feed");
//        } else {
//           req.flash("info", "Successfully deleted your Post!");
//            console.log("A Post house was deleted");
//            res.redirect("/feed");
//        }
//    });
// });

// router.get("*", middleware.bogusURL, function(req, res){
// });  

module.exports = router;