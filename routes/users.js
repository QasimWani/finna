var express = require("express"),
    // methodOverride   = require("method-override"),
    router  = express.Router(),
    Post = require("../models/posts"),
    User = require("../models/user"),
    ip = require("public-ip"),
    geoip = require('geoip-lite'),
    Personality = require("../models/personality"),
    middleware = require("../middleware"),
    Event      = require("../models/events"),
    Startup    = require("../models/startups"),
    EventComment      = require("../models/eventcomments"),
    Comment      = require("../models/comments"),
    _          = require('underscore');
    require('babel-polyfill');

router.get("/", middleware.isLoggedIn, function(req, res){
    User.find({}, function(err, allUsers){
    console.log(allUsers);
      if(err || !allUsers)
      {
         req.flash("error", "Couldn't load Users... Try again");
         res.redirect("back");
      }
      else
      {
        (async () => {
            var a = (await ip.v4());
            var address = (await geoip.lookup(a));
            console.log(address.city);
            console.log("All party houses displayed onto the website");
            res.render("users/index", {users : allUsers, address : address.city});
          })();
         
      }
      
   });
});

router.get("/:username",  middleware.isLoggedIn, function(req, res){
    User.find({'username' : req.params.username}, function(err, foundId){
        var userId = req.params.username;
       console.log("This is the USER ID: >>> " + userId);
       console.log('****************');
       console.log(foundId[0]);
       if(err || !foundId[0]){
          console.log("Something went wrong while handling id");
          res.render("partials/errorPage");
        //   console.log(err.message);
       }
       else
       {
            console.log(foundId.username);
            Post.find({}).exec(function(err, foundUser){
                if(!err)
                {
                    Event.find({"author.username": userId}, function(err, userEvents){
                        if(err)
                        {
                            console.log("THERE IS AN ERROR WHILE TRYING TO LOAD EVENTS OF A USER IN HIS/HER PROFILE", err.message);
                            res.redirect("back");
                        }
                        else
                        {
                            Startup.find({"author.username": userId}, function(err, userStartups){
                                if(err)
                                {
                                    console.log("THERE IS AN ERROR WHILE TRYING TO LOAD !!! STARTUPS !!! OF A USER IN HIS/HER PROFILE", err.message);
                                    res.redirect("back");
                                }
                                else
                                {
                                   console.log("This is post infomation about a particular user from user.js" + foundUser);
                                   res.render("users/show", {startup : userStartups, event: userEvents, user : foundId, post : foundUser});     
                                }
                            });
                        }
                    });
                   
                    
                }
                else
                {
                    console.log("Error in trying to get posts of a user from user.js");
                    res.redirect("/users");
                }
            });
       }
    });
});
router.get("/:username/settings", middleware.checkUserOwnership, function(req, res){
if(req.params.username === req.user.username)
    {
        User.find({'username' : req.params.username}, function(err, foundId){
       console.log(req.params.username);
       console.log('****************');
       if(err){
          console.log("Something went wrong while handling id");
       }
       else
       {
            console.log("User taken to edit Post page");
            console.log(foundId);
            res.render("users/edit", {user : foundId});
       }
    });    
    }
    else
    {
        res.render("partials/errorPage");
    }
});

// customizing a users profile
router.put("/:username/settings", middleware.checkUserOwnership, function(req, res){

   User.findOneAndUpdate({'username':req.params.username}, req.body.user, function(err, customizedUser){
      if(err || !customizedUser){
          res.redirect("/users");
      }  else {
    var sex = "";
    if(req.body.user.sex)
    {
        sex = req.body.user.sex;
    }
    else
    {
        sex = customizedUser.sex;
    }
console.log(sex,"<> This is the sex <>");
console.log(customizedUser.sex,"<> This is the SECOND sex <>");
         Post.updateMany({"author.username": req.params.username},{"author.profilePicture":req.body.user.profilePicture, "author.sex":sex}, function(err, postUpdateProfilePicture){
            if(err)
            {
                console.log("Something went wrong",err.message);
                res.redirect("back");
            }
            else
            {
           Comment.updateMany({"author.username":req.params.username},{"author.profilePicture": req.body.user.profilePicture, "author.sex":sex}, function(err, commentUpdateProfilePicture){
               if(!err)
               {
                 
                 EventComment.updateMany({"author.username":req.params.username},{"author.profilePicture": req.body.user.profilePicture, "author.sex":sex}, function(err, commentUpdateProfilePicture){
                       if(!err)
                       {
                         
                         Event.updateMany({"author.username":req.params.username},{"author.profilePicture": req.body.user.profilePicture, "author.sex":sex}, function(err, commentUpdateProfilePicture){
                               if(!err)
                               {
                                    console.log("Profile Picture on all posts has been updated successfully", postUpdateProfilePicture);
                                    console.log("Successfully edited --> @" + req.params.username +"'s Profile");
                                    res.redirect("/users/" + req.params.username);
                               }
                           });  
                       }
                   });  
               }
           });  
        }
        
     });

      }
   });
});

router.get("/:username/link", middleware.isLoggedIn, function(req, res) {
User.find({'username' : req.params.username}, function(err, foundId) {
if(err || req.params.username !== req.user.username)
{
    // console.log(err.message);
    console.log(foundId);
    console.log("User being a dumbass and manually changing the url");
    req.flash("warning","Note: For reasons concerning privacy, you can only view your own LINK");
    res.redirect("/users/"+req.user.username+"/link");
}
else
{
Personality.find({}).exec(function(err, personality){
if(!err)
    {
var flag = 0;
personality.forEach(function(hasFinished)
    {
       console.log(hasFinished);
console.log('this value should be 0 at this point',flag);
       if(hasFinished.user.username === req.user.username)
       {
           flag = 1;
       }
    });
    console.log('this value should have moved from 0 to 1',flag);

if(flag === 1)
{
//my algorithm
var compatibilityArr = [];
var allButMePersonalities = [];
var allButMeNames = [];
var myPersonality,
    compatiblePeople = [],
    countmein = 0;
//OFFICIAL ALGORITHM
for(let a = 0; a < personality.length; a++) {
                if(req.user.username !== personality[a].user.username)
                    {
                        allButMePersonalities.push(Object.values(personality[a].answers).slice(1, 10));
                        allButMeNames.push(personality[a].user.username);
                    }
                    else
                    {
                     myPersonality = [personality[a].answers.first, personality[a].answers.second, personality[a].answers.third, personality[a].answers.fourth, personality[a].answers.fifth, personality[a].answers.sixth, personality[a].answers.seventh, personality[a].answers.eight, personality[a].answers.ninth, personality[a].answers.tenth];
                        console.log(myPersonality, personality[a].user.username, a);   
                    }
                }
                console.log(allButMePersonalities);
                console.log(allButMeNames);
                console.log("********************");
                console.log(myPersonality);
            for(let i = 0; i < allButMePersonalities.length; i++)
                {
                for(let j = 0; j < myPersonality.length; j++)
                    {
                    if(allButMePersonalities[i][j] == myPersonality[j])
                        {
                            countmein++;
                        }
                    }
                    compatibilityArr.push(countmein);
                    countmein = 0;
                }
                console.log(compatibilityArr);
            for(let k = 0; k < compatibilityArr.length; k++)
                {
                if(compatibilityArr[k]/10 >= 0.5)
                    {
                        console.log(allButMeNames[k]);
                        compatiblePeople.push(allButMeNames[k]);
                    }
                }
                User.find({}, function (err, allUsers) {
                if(err)
                    {
                       console.log("USERS.JS LOADING DATA TO FRONTEND CONNECTIONS.EJS file <<error>>", err);
                    }
                    else
                    {
                        console.log(compatiblePeople, 'is compatiable');
                        var intemediateUsers = [];
                        allUsers.forEach(function(allUsers){
                            console.log(allUsers.username, 'one user');
                            intemediateUsers.push(allUsers.username);
                        });
                        var intersection = _.intersection(intemediateUsers, compatiblePeople);
                        console.log(intersection, 'is the intersection');
                        User.find({'username': intersection}, function(err, linkedUsers) {
                            if(err)
                            {
                                console.log("SOMETHING WENT WRONG!!");
                            }
                            else
                            {
                                console.log("IT WORKS");
                                console.log(linkedUsers);
                                console.log("MIT");
                                return res.render("users/findConnections", {linkedUsers : linkedUsers});
                            }
                        });
                    }
                });
    flag = 0;

} 
else
{
    return res.render("users/connections");
}
            
}
        else
        {
            console.log("ALGORTHM BASIC ERROR!!!");
            res.redirect("back");
        }
    });
}
});
});

router.post("/:username/link", middleware.isLoggedIn, function(req, res){
    console.log("THIS IS REQ.BODY.PERSONALITY -->" + JSON.stringify(req.body.personality));
    // console.log("CHECK IF USER FINISHED THE TEST for time being -->" + JSON.stringify(typeof req.body.personality.first));
      User.find({'username' : req.params.username}, function(err, userTest) {
        if(err)
        {
            req.flash("error", "Something went wrong while trying to create a personality!");
            console.log("Something went wrong while trying to create a personality");
            res.redirect("/users/"+ req.params.username);
        }
        else
        {
            if(err)
            {
               req.flash("error", "Unable to create your personality");
               console.log("Error creating personality" + err);
               res.redirect("back");
            }
            else
            {
            var userTested = {
              username : req.user.username,
              hasCompleted : true,
              personalUserID   : req.user._id
            };
            var fullPersonality = {answers : req.body.personality, user: userTested};
            var userPersona = (Object.assign({}, fullPersonality));
            Personality.create(userPersona, function(err, personality) {
                if(err)
                {
                    console.log("BIG ERROR! --:>>>", err);
                    req.flash("error", "Creating personality error!");
                    res.redirect("back");
                }
                else
                {
                     console.log(personality);
            //   comment.author.id = req.user._id;
            //   comment.author.username = req.user.username;
            //   console.log("THIS IS THE USERNAME: "+ comment.author.username);
            // whoFinished = req.user.username;
               personality.save();
            //   post.comments.push(comment);
            //   userTest.save();
            //   console.log("A new COMMENT was added SUCCESSFULLY!!!");
            console.log("This is the personality of a user: " + personality);
            
            // whoFinished.push(req.user.username);
              req.flash("info", "Successfully created your personna!");
              
               res.redirect("/users/"+ userTest.username + "/link");
                }
           
         });
        }
    }  
});
});



// Test
//Post post request
router.post("/:id", middleware.isLoggedIn, function(req, res){
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
      sex            : req.user.sex,
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
         res.redirect("/users/"+req.user.username);
      }
   });
   console.log("Add Post page request was made");
   
});



//this is going to update the Post house
router.put("/:username", middleware.isLoggedIn, function(req, res){
var bio = req.body.biography;
var user = req.user.username;
   User.findOneAndUpdate({'username': req.params.username}, {'biography':bio}, function(err, updatedBio){
      if(err){
          res.redirect("/feed");
      }  else {
        console.log(updatedBio, "updated BIO");
         res.redirect("/users/"+user);
      }
   });
});

router.get("*", middleware.bogusURL, function(req, res){
});  
module.exports = router;