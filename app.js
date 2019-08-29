var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    session                 = require("express-session"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    Campground              = require("./models/campground"),
    seedDB                  = require("./seeds"),
    User                    = require("./models/user"),
    Comment                 = require("./models/comment");

mongoose.connect('mongodb://localhost:27017/campyeah', { useNewUrlParser: true });

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: "I am clever and I know it",
    resave: false,
    saveUninitialized: false
}))
seedDB();

//PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


//Read the sesion and collecte the data in order to encode and to decode.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.redirect("/campgrounds");
})

app.get("/campgrounds", function(req,res){
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allcampgrounds});
        }
    })
})

app.post("/campgrounds", function(req, res){
    var name            = req.body.name;
    var image           = req.body.image;
    var description     = req.body.description;
    var newCampground   = {name: name, image: image, description: description};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
})

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new")
})

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//-----------------
//COMMENTS Routers
//-----------------

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campgroundFound){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campgroundFound: campgroundFound});
            
        }
    })
})

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})


//=====================
//AUTHENTICATE ROUTERS
//=====================

//SHOW regiter form

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
       })
    })
})

//LOGIN ROUTERS
app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
}), function (req, res) {      
})

//Log out Routes
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
})

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login")
// }

app.listen(process.env.PORT || 3000, function(){
    console.log("Server has started");
});