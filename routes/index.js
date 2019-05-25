var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    GoogleStrategy    = require("passport-google-oauth20").Strategy,
    middleware = require("../middleware");

//Authentication Routes

passport.use(new GoogleStrategy({
    callbackURL : process.env.DB_callback+'auth/google/redirect',
    clientID : '630471424686-p1lot6h8f6jtp30esi04kb88jgngu4em.apps.googleusercontent.com',
    clientSecret : 'ByS0yOz8ZO5vBXD6BgfU3A3p',
    proxy        : true
}, (accessToken, refreshToken,profile,done)=>{
    console.log("This is full profile : -->"+JSON.stringify(profile));
    User.findOne({googleId : profile.id}).then((currentUser) =>{
      
       if(currentUser)
       {
          console.log("This is the current user " + currentUser);
          done(null, currentUser);
       }
       else
       {
           new User({
       googleId : profile.id,
       email    : profile.emails[0].value,
       username : profile.emails[0].value.split("@")[0],
       firstName : profile.name.givenName,
       lastName : profile.name.familyName,
       birthday : profile.birthday,
       sex : profile.gender,
       biography : "",
       profilePicture : profile.photos[0].value,
    }).save().then((newUser)=>{
      console.log("New user created from google verification!");
      done(null, newUser);
    });
       }
    });
    
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});


//Google Authentication middleware setup
router.get("/", middleware.isAlreadyLoggedIn, function(req, res) {
   res.render("partials/landing"); 
});

router.get('/auth/google',
  passport.authenticate('google'),
  function(req, res){
    // The request will be redirected to Google for authentication, so
    // this function will not be called.
  });

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email','https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/user.birthday.read','https://www.googleapis.com/auth/user.addresses.read']}));
router.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/'}),
   (req, res) => {
      res.redirect('/feed');
   });

router.post("/", function(req, res){
    var username = req.body.username,
        password = req.body.password,
        firstName = req.body.firstName,
        lastName = req.body.lastName,
        dateCreated = req.body.dateCreated,
        sex         = req.body.sex,
        birthday    = req.body.birthday,
        biography  = req.body.biography,
        email    = req.body.email;
    User.countDocuments({"email" :email}, function(err, count){
       if(err){
          console.log("Something went wrong while handling id");
          return res.redirect("/"); 
       }
       else if(count >= 1)
       {
             console.log("Email already exists");
             req.flash("error","Email already exists. Sign up with a new one or login with the previously registered email");
             return res.redirect("/"); 
       }
       else
       {
          User.register(new User({firstName:firstName, lastName: lastName, username: username, email:email, sex: sex, birthday : birthday, biography:biography, dateCreated : dateCreated}), password, function(err, user){
            if(err){
                console.log(err);
                req.flash("error", err.message);
                return res.redirect('/');
            }
             passport.authenticate("local")(req, res, function(){
                req.logout();
                req.flash("warning", "Login with your newly created account to continue");
                res.redirect("/");
        });
      });
    }
  });
});
router.post("/login", passport.authenticate("local", {
      successRedirect : "/feed",
      failureRedirect : "/",
      failureFlash : "Invalid local Username and/or password",
      successFlash : "Welcome Back"
   }), function(req, res) {
       console.log("A user just logged in!");
});
//LogOut route
router.get("/logout", middleware.isLoggedIn, function(req, res) {
    req.logout();
    // req.flash("success", "Successfully logged you out");
    res.redirect("/");
});

router.get("*", middleware.bogusURL, function(req, res){
});  
module.exports = router;