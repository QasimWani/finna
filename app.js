const express = require("express"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      app     = express(),
      flash   = require("connect-flash"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride    = require("method-override"),
      cookieSession     = require("cookie-session"),
      dotenv        = require("dotenv"),
      User    = require("./models/user");


      dotenv.config();

// const Nexmo = require('nexmo');
// const nexmo = new Nexmo({
//   apiKey: '4bae7a89',
//   apiSecret: 'tklSKztg8pF6dv3H'
// });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(methodOverride("_method"));
app.use(cookieSession({
    maxAge : 24*3600*1000,
    keys   : ['rememberthenameqasimwanicuzhemakesai']
}));
//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(require("express-session")({
   secret : "brain computer interface!",
   resave : false,
   saveUninitialized : false
}));


// app.use(passport.initialize());
// app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//using flash for messages and better user interface
app.use(flash());  
passport.serializeUser((user, done) =>{
  done(null, user.id);  
});
passport.deserializeUser((id, done) =>{
  User.findById(id).then((user)=>
  {
    done(null, user);  
  }); 
});
mongoose.connect("mongodb://"+ process.env.DB_mong +"/finna",{ useNewUrlParser: true });
// mongoose.connect("mongodb://qasim:InfinitumA1!@ds151486.mlab.com:51486/finna",{ useNewUrlParser: true });

//mongodb://qasim:InfinitumA1!@ds151486.mlab.com:51486/finna
//requiring the routes
var commentRoutes    = require("./routes/comments"),
    postRoutes = require("./routes/posts"),
    userRoutes      = require("./routes/users"),
    middleware     = require("./middleware"),
    indexRoutes      = require("./routes/index"),
    eventCommentRoutes  = require("./routes/eventcomments"),
    eventRoutes      = require("./routes/events");
    startupRoutes    = require("./routes/startups");
    


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    res.locals.info = req.flash("info");
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use("/feed/:id/comments", commentRoutes);
app.use("/events/:id/comments", eventCommentRoutes);
app.use("/feed", postRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/startups", startupRoutes);

app.use("/", indexRoutes);

app.get("/", function(req, res){
    res.render("partials/landing");
});

// Invalid route and Listening to a port
app.get("*", middleware.bogusURL, function(req, res){
}); 


app.listen(process.env.PORT || 4000, process.env.IP, function(){
// const from = '12018770079'
// const to = '15409985673',
// const text = 'A text message sent using the Nexmo SMS API'

// nexmo.message.sendSms(from, to, text, (err, responseData) => {
//     if (err) {
//         console.log(err);
//     } else {
//         if(responseData.messages[0]['status'] === "0") {
//             console.log("Message sent successfully.");
//         } else {
//             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//         }
//     }
// })
    console.log("So far, you've written only 3,733 lines of code. Need to step it up!");
    console.log("Server has started!");
});