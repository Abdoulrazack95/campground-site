var mongoose    =   require("mongoose");
var Campground  =   require("./models/campground");
var Comment     =   require("./models/comment");

var data = [{
    name: "Camping under the view of the sun set",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Enjoying the sun set"
},
{
    name: "Camping near the river",
    image: "https://images.unsplash.com/photo-1557719551-3293dd9c529f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Having a camping near to the river"
},
{
    name: "Camping in the desert",
    image: "https://images.unsplash.com/photo-1558565180-4c6a7377714d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "In the middle of the desert"
}]

function seedDB(){
    // REMOVE ALL CAMPGROUNDS
Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }else{
        console.log("yeah table dropped");
            //ADD A FEW CAMPGROUNDS
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("New campground added");
                        //create a comment
                        Comment.create(
                            {
                                text: "this place is greate",
                                author: "Abdoulrazack"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                }else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("create a new comment");
                                }
                            }
                            )
                    }
                })
            });
        }
    });
}

module.exports = seedDB;