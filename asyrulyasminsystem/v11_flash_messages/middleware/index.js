//all middleware goes here
var Task = require('../models/task');
var Comment = require('../models/comment');

var middleware = {};

middleware.checkTaskOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Task.findById(req.params.id, function(err, foundTask){
            if(err ||  !foundTask){
                // console.log(err);
                req.flash("error", "Task not found!");
                res.redirect('back');
            }else{
                //does user own group
                
                if(foundTask.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please log in first!");
        res.redirect('/login');
    }
}

middleware.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated){
        // console.log('Authentication done!');
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                // console.log(err);
                req.flash("error", "Comment doesnt exist.");
                res.redirect('back');
            }else{
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                }else{
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash("error", "Please log in first!");
        res.redirect('/login');
    }
}

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first!");
    res.redirect('/login');
}

module.exports = middleware;