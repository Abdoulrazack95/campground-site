
var express       = require("express"),
    User          = require("../models/user"),
    LocalStrategy = require("passport-local"),
    passport      = require("passport"),
    router        = express.Router();

passport.use(new LocalStrategy(User.authenticate()));
//=====================
//AUTHENTICATE ROUTERS
//=====================

//SHOW regiter form

router.get("/register", (req, res) => {
    res.render("campgrounds/register");
})

router.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            res.render("campgrounds/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to CampYeah " + user.username);
            res.redirect("/campgrounds");
        })
    })
});

//LOGIN routerRS
router.get("/login", function (req, res) {
    res.render("campgrounds/login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {
});

//Log out routers
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


//Authentication configuration done

module.exports = router;