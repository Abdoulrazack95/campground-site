
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
    res.render("campgrounds/register", { page: 'register' });
})

router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    if (req.body.adminCode === "SecretCode12") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("campgrounds/register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Successfully Signed Up! Nice to meet you "  + user.username);
            res.redirect("/campgrounds");
        })
    })
});


//LOGIN routerRS
router.get("/login", function (req, res) {
    res.render("campgrounds/login", { page: 'login' });
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