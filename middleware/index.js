var Post = require("../models/posts");
var Comment = require("../models/comments");
var User = require("../models/user");
var Event = require("../models/events");
var Startup = require("../models/startups");
var StartupComment = require("../models/startupcomments");
var EventComment = require("../models/eventcomments");
//middleware
var middlewareObj = {};

//middleware for checking whether a user has the right to edit or delete a HOUSE
middlewareObj.checkPostOwnership = function(req, res, next){
 Post.findById(req.params.id, function(err, foundPost){
     if(err || !foundPost)
     {
       req.flash("error", "Post not found");
        return res.redirect("/feed");  
     }
     else if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
           if(err || !foundPost){
               req.flash("error", "Post not found");
               return res.redirect("/feed");
           }  else {
               // does user own the campground?
            if(foundPost.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("/feed/"+req.params.id);
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/");
    }
 })};

//middleware for checking if the same user can edit his/her account
middlewareObj.checkUserOwnership = function(req, res, next){
 User.find({username: req.params.username}, function(err, foundUser){
     if(err || !foundUser)
     {
       req.flash("error", "User not found");
        return res.redirect("back");  
     }
     else if(req.isAuthenticated()){
        User.find({username: req.params.username}, function(err, foundUser){
           if(err || !foundUser){
               req.flash("error", "User not found... Try again later!");
               return res.redirect("/users");
           }  else {
               // does user own the campground?
               console.log(foundUser.username,req.user.username);
            if(foundUser[0].username == (req.user.username)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("/users/"+req.params.username);
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/");
    }
 })};

//middleware for checking whether a user has the right to edit or delete a comment
middlewareObj.checkCommentOwnership = function(req, res, next){
Post.findById(req.params.id, function(err, foundPost){
     if(err || !foundPost)
     {
       req.flash("error", "Post not found");
       res.render("partials/errorPage");  
     }
else if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err || !foundComment || !foundPost){
          req.flash("error", "Couldn't find the ID from the Database");
           res.redirect("/feed/"+req.params.id);
       }  else {
        if(foundComment.author.id.equals(req.user._id)) {
            next();
        } else {
            req.flash("error", "You don't have the permission to do that.");
            res.redirect("/feed/"+ req.params.id);
        }
       }
    });
} 
else 
    {
        req.flash("warning", "You need to be logged in first!");
        res.redirect("/");
    }
})};
//middleware for checking whether a user has the right to edit or delete an E V E N T
middlewareObj.checkEventOwnership = function(req, res, next){
 Event.findById(req.params.id, function(err, foundEvent){
     if(err || !foundEvent)
     {
       req.flash("error", "EVENT not found");
        return res.redirect("/event");  
     }
     else if(req.isAuthenticated()){
        Event.findById(req.params.id, function(err, foundEvent){
           if(err || !foundEvent){
               req.flash("error", "Event not found");
               return res.redirect("/events");
           }  else {
               // does user own the campground?
            if(foundEvent.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("/events/"+req.params.id);
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/");
    }
 })};

//middleware for checking ownership of the startup
//middleware for checking whether a user has the right to edit or delete a HOUSE
middlewareObj.checkStartupOwnership = function(req, res, next){
    Startup.findById(req.params.id, function(err, foundStartup){
        if(err || !foundStartup)
        {
          req.flash("error", "Startup not found");
           return res.redirect("/startups");  
        }
        else if(req.isAuthenticated()){
           Startup.findById(req.params.id, function(err, foundStartup){
              if(err || !foundStartup){
                  req.flash("error", "Startup not found");
                  return res.redirect("/startups");
              }  else {
                  // does user own the campground?
               if(foundStartup.author.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("/startups/"+req.params.id);
               }
              }
           });
       } else {
           req.flash("error", "You need to be logged in to do that");
           res.redirect("/");
       }
})};   

//middleware for checking whether a user has the right to edit or delete a comment
//CHECKING FOR PERMISSIONS FOR editing or deleting a comment from the events page!
middlewareObj.checkEventCommentOwnership = function(req, res, next){
    Event.findById(req.params.id, function(err, foundPost){
         if(err || !foundPost)
         {
           req.flash("error", "Post not found");
           res.render("partials/errorPage");  
         }
    else if(req.isAuthenticated()){
        EventComment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment || !foundPost){
              req.flash("error", "Couldn't find the ID from the Database");
               res.redirect("/events/"+req.params.id);
           }  else {
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have the permission to do that.");
                res.redirect("/events/"+ req.params.id);
            }
           }
        });
    } 
    else 
        {
            req.flash("warning", "You need to be logged in first!");
            res.redirect("/");
        }
    })};

    

//middleware for checking whether a user has the right to edit or delete a comment
middlewareObj.checkStartupCommentOwnership = function(req, res, next){
    Startup.findById(req.params.id, function(err, foundPost){
         if(err || !foundPost)
         {
           req.flash("error", "Post not found");
           res.render("partials/errorPage");  
         }
    else if(req.isAuthenticated()){
        StartupComment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment || !foundPost){
              req.flash("error", "Couldn't find the ID from the Database");
               res.redirect("/startups/"+req.params.id);
           }  else {
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have the permission to do that.");
                res.redirect("/startups/"+ req.params.id);
            }
           }
        });
    } 
    else 
        {
            req.flash("warning", "You need to be logged in first!");
            res.redirect("/");
        }
    })};
    





 middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated() || req.user)
    {
        return next();
    }
    req.flash("error", "Please log in first to Continue...");
    res.redirect("/");
};

middlewareObj.isAlreadyLoggedIn = function(req, res, next){
    if(req.isAuthenticated())
    {
        res.redirect("/feed");
    }
    else
    {
        next();
    }
};
middlewareObj.bogusURL = function(req, res, next){
    res.render("partials/errorPage");
    next();
};

module.exports = middlewareObj;