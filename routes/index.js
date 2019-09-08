
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
    res.render("register");
})

router.post("/register", (req, res) => {
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

//LOGIN routerRS
router.get("/login", function (req, res) {
    res.render("login");
})

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {
    })

//Log out routers
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
})


//Authentication configuration done

module.exports = router;