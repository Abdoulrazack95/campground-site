
var express         = require("express"),
    User            = require("../models/user"),
    LocalStrategy   = require("passport-local"),
    passport        = require("passport"),
    campgrounds     = require("../models/campground"),
    async           = require("async"),
    nodemailer      = require("nodemailer"),
    crypto          = require("crypto"),
    router          = express.Router();

passport.use(new LocalStrategy(User.authenticate()));
//=====================
//AUTHENTICATE ROUTERS
//=====================

//SHOW regiter form

router.get("/register", (req, res) => {
    res.render("campgrounds/register", { page: 'register' });
})

router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
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



//User profile
router.get("/users/:id", function (req, res) {
    User.findById(req.params.id, function (err, findUser) {
        if (err) {
            res.flash("Ooops, something went wrong");
            req.redirect("/");
        } 
        campgrounds.find().where("author.id").equals(findUser._id).exec(function (err, campgrounds) {
            if (err) {
                res.flash("Ooops, something went wrong");
                req.redirect("/");
            }
            res.render("users/show", { user: findUser, campgrounds: campgrounds })
        })
    })
})

//Forgot Password
router.get("/forgot", function (req, res) {
    res.render("users/forgot");
})

router.post("forgot", function (req, res, next) {

})

module.exports = router;