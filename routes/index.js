
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

router.post("/forgot", function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString("hex");
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    req.flash("error", "No accounts with that email address exists.");
                    return res.redirect("/forgot");
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                autho: {
                    user: "abdoulrazackkahin434@gmail.com",
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: "abdoulrazackkahin434@gmail.com",
                text: "You are receiving this email because you have requisted the reset of the password " +
                    "Please click on the following link or past this into your browser to complete the process " +
                    "http://" + req.headers.host + "/reset" + token + "\n\n" +
                    "if you did not request this, please ignore this email and your password will remain unchanged"
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log("mail sent");
                req.flash("Success", "An e-mail has been sent to " + user.email + " with further instructions.");
                done(err, "done");
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect("/forgot");
    });
});

module.exports = router;