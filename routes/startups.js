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

router.get("/", middleware.isLoggedIn, function(req, res){
   Startup.find({}, function(err, allStartups){
      if(err)
      {
         console.log(err.message);
         req.flash("error","Oops! Something went wrong! Try loading the page or coming back later...");
         res.redirect("back");
      }
      else
      {
         console.log("User taken to All Startups Page!");
         res.render("startups/index",{allStartups : allStartups});
      }
   });
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
router.get("/:id/edit", middleware.checkStartupOwnership, function(req, res) {
    Startup.findById(req.params.id, function(err, foundId){
       if(err || !foundId){
          console.log("Something went wrong while handling id");
       }
       else
       {
             console.log("User taken to edit Post page");
             
            res.render("startups/edit", {startup : foundId});
       }
    });
});
//this is going to update the Startup
router.put("/:id", middleware.checkStartupOwnership, function(req, res){
   console.log(req.body.startup.title);
   var startup = {startup:req.body.startup}
   console.log(req.params.id);
   Startup.findByIdAndUpdate(req.params.id, startup, function(err, updatedBlog){
      if(err){
          res.redirect("/startups");
      }  else {
         req.flash("info","Successfully edited " + req.body.startup.title);
         console.log(updatedBlog);
        console.log(req.body.startup.title + " was edited!");
         res.redirect("/startups/" + req.params.id);
      }
   });
});
//deleting a Startup
router.delete("/:id", middleware.checkStartupOwnership, function(req, res){
    Startup.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log("Oops. Something went wrong while deleting a Startup...");
           res.redirect("/startups");
       } else {
          req.flash("info", "Successfully deleted your Startup!");
           console.log("A STARTUP was deleted");
           res.redirect("/startups");
       }
   });
});

router.get("*", middleware.bogusURL, function(req, res){
});  

module.exports = router;