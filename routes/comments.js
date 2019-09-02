
var express         = require("express"),
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    router          = express.Router(); 


//-----------------
//COMMENTS Routers
//-----------------

router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campgroundFound) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campgroundFound: campgroundFound });

        }
    })
})

router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router;