var express = require("express"),
    methodOverride   = require("method-override"),
    router  = express.Router(),
    // Post = require("../models/posts"),
    User = require("../models/user"),
    Event = require("../models/events"),
    Comment = require("../models/eventcomments"),
    request = require("request"),
    middleware = require("../middleware");

//Post get request
router.get("/", middleware.isLoggedIn, function(req, res){
    Event.find({}).sort({created:-1}).exec(function(err, allEvents){
      if(err || !allEvents)
      {
         req.flash("error", "Couldn't load the events... Try again");
         res.redirect("back");
      }
      else
      {
         console.log("All Events displayed onto the website");
         res.render("events/index", {events : allEvents});
      }
      
   });
});

router.use(methodOverride("_method"));
//Post post request
router.post("/", middleware.isLoggedIn, function(req, res){
var title = req.body.title,
   image = req.body.image,
   video = req.body.video,
   description = req.body.description,
   price    = req.body.price,
   location = req.body.location,
   dateCreated = req.body.dateCreated,
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
   var newEvent = {title:title, image: image, video: video, description: description, price: price, location: location, dateCreated: dateCreated, date:date, author:author};
   console.log("The USER WHO POSTED THIS EVENT IS : " + author.username);
   console.log("The ID OF THIS EVENT IS : " + author.id);
   console.log("The DATE OF THE CREATION OF THE USER : " + author.date);
   Event.create(newEvent, function(err, Event){
      if(err || !Event)
      {
         console.log("Something went wrong!");
         console.log(err);
         res.redirect("back");
      }
      else
      {
         console.log("A new Post was added to the database");
         console.log(Event);
         res.redirect("/events");
      }
   });
   console.log("Add EVENT P O S T page request was made");
   
});

//Detailed page review SHOW ROUTE
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id).populate("eventcomments").exec(function(err, foundId){
       if(err || !foundId){
          req.flash("error", "Invalid URL");
          res.redirect("/events");
          console.log("Something went wrong while handling id");
       }
       else
       {
          User.findById(foundId.author.id, function(err, userDeatils) {
             if(err || !userDeatils)
             {
                 console.log("Something went wrong!", "EVENTS.JS LINE ~ 85");
                 res.redirect("/events");
             }
             else
             {
               Event.find({}).exec(function(err, allEvents){
                if(err || !allEvents)
                  {
                     req.flash("error", "Couldn't load the posts... Try again");
                     res.redirect("back");
                  }
                  else
                  {
                     var postUsers = "", postArray = [];
                     var currentEmail = foundId.author.email;
                    for(var i = 0; i < allEvents.length; i++)
                    {
                        if(currentEmail === allEvents[i].author.email)
                        {
                          postUsers = allEvents[i].author.email;
                          postArray.push(postUsers);
                        }
                    }
                    console.log(postUsers + " has these many number of events : " + postArray.length);
                Comment.find({nameOfPost: foundId.title}, function(err, foundEventComments){
                    if(err)
                    {
                        console.log(err.message, " < YOU MORON! >");
                        res.redirect("back");
                    }
                    else
                    {
                        request("https://maps.googleapis.com/maps/api/geocode/json?address="+ foundId.location +"&key=AIzaSyAxam08NJlxj7oWHOF2X9T7wzQotesoQzE", (error, response, body) =>{
                        if(!error && response.statusCode === 200)
                        {
                            var addressData = JSON.parse(body);
                            var exists = 0;
                            console.log("THIS IS ADDRESS DATA", addressData);
                            if(addressData.status !== "ZERO_RESULTS")
                            {
                                exists = 1;
                                console.log("THIS IS GEOCODED ADRESS", addressData.results[0].geometry.viewport.northeast);
                                var formattedAddress = addressData.results[0].formatted_address;
                                var latitude = addressData.results[0].geometry.viewport.northeast.lat;
                                var longitude = addressData.results[0].geometry.viewport.northeast.lng;
                            }
                            
                        }
                        
                            console.log(foundEventComments," < DEBUG THE SHIT OUT OF THIS ONE NOWWW!!!!!!");
                            res.render("events/show", {exists: exists, formattedAddress: formattedAddress, latitude:latitude, longitude:longitude, event:foundId, comments:foundEventComments, user: userDeatils, count: postArray.length}); 
                    
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

//Edit a PostHouse route
router.get("/:id/edit",  middleware.checkEventOwnership, function(req, res) {
    Event.findById(req.params.id, function(err, foundId){
       if(err || !foundId){
          console.log("Something went wrong while handling id");
       }
       else
       {
             console.log("User taken to edit Post page");
             
            res.render("events/edit", {event : foundId});
       }
    });
});
//this is going to update the EVENT
router.put("/:id", middleware.checkEventOwnership, function(req, res){
   Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedEvent){
      if(err){
          req.flash("error", "Whoops! Even the best can mess up sometimes!");
          res.redirect("/events");
      }  else {
        console.log(req.body.event.title + " was edited!");
         res.redirect("/events/" + req.params.id);
      }
   });
});
//deleting a Post
router.delete("/:id",middleware.checkEventOwnership,function(req, res){
    Event.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log("Oops. Something went wrong while deleting an EVENT...");
           console.log(err.message);
           res.redirect("back");
       } else {
        //   req.flash("info", "Successfully deleted your Event!");
           console.log("An EVENT was deleted");
           res.redirect("/events");
       }
   });
});

router.get("*", middleware.bogusURL, function(req, res){
});


module.exports = router;