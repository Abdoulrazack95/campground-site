var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    methodOverride      = require("method-override"),
    User                = require("./models/user"),
    session             = require("express-session"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    seedDB              = require("./seeds"),
    User                = require("./models/user");


var campgroundRouter    = require("./routes/campgrounds"),
    commentsRouter      = require("./routes/comments"),
    autheRouter         = require("./routes/index"); 
    
mongoose.connect('mongodb://localhost:27017/campyeah', { useNewUrlParser: true });

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: "I am clever and I know it",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // SEED DATABASE

//PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error   = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(autheRouter);
app.use(campgroundRouter);
app.use(commentsRouter);
passport.use(new LocalStrategy(User.authenticate()));


//Read the sesion and collecte the data in order to encode and to decode.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.listen(process.env.PORT || 3000, function(){
    console.log("Server has started");
});