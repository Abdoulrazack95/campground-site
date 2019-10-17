var express    = require("express"),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    router     = express.Router();

var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);
    
// INDEX - Show all Campgrounds
router.get("/", function (req, res) {
    res.render("campgrounds/landing");
})


router.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds, page: 'campgrounds' });
        }
    })
})

router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new")
})

//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
    // get data from form and add to campgrounds array
    var name    = req.body.name;
    var image   = req.body.image;
    var desc    = req.body.description;
    var author  = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = { name: name, image: image, description: desc, author: author, location: location, lat: lat, lng: lng };
        // Create a new campground and save to DB
        Campground.create(newCampground, function (err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
    });
});


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
        req.flash("error", "Campground not found");
        res.render("campgrounds/edit", { campground: foundCampground });
    })
})


// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat      = data[0].latitude;
        var lng      = data[0].longitude;
        var location = data[0].formattedAddress;
        var newData = {
            name: req.body.name,
            image: req.body.image,
            description: req.body.desc,
            location: location,
            lat: lat,
            lng: lng
        };
        Campground.findByIdAndUpdate(req.params.id, newData, function (err, campground) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

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