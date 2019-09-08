var express    = require("express"),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    router     = express.Router();
    
// INDEX - Show all Campgrounds
router.get("/", function (req, res) {
    res.redirect("/campgrounds");
})


router.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds });
        }
    })
})

router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
    var name        = req.body.name;
    var image       = req.body.image;
    var description = req.body.description;
    var author      = {
                        id: req.user._id,
                        username: req.user.username
                    };
    var newCampground = { name: name, image: image, description: description, author: author };
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
})

router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new")
})

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
})

// Edit Campground Routes
router.get("/campgrounds/:id/edit", middleware.checkCampgoundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    })
})

//UPDATE ROUTE
router.put("/campgrounds/:id", middleware.checkCampgoundOwnership ,function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function (err, campgroundUpdate) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//Delete Route

router.delete("/campgrounds/:id", middleware.checkCampgoundOwnership,function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, deleted) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})



//function to check if a user owns a campground so that he can modify


module.exports = router;