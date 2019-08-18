var express     =    require("express"),
    app         =    express(),
    bodyParser  =    require("body-parser"),
    mongoose    =    require("mongoose"),
    Campground  =    require("./models/campground"),
    seedDB      =    require("./seeds"),
    Comment     =   require("./models/comment")
    seedDB();

mongoose.connect('mongodb://localhost:27017/campyeah', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true}));
app.set("view engine", "ejs");


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
    var newCampground = {name: name, image: image, description: description};
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

app.listen(process.env.PORT || 3000, function(){
    console.log("Server has started");
});