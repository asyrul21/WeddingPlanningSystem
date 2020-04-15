//all middleware goes here
var Task = require('../models/task');
var Comment = require('../models/comment');

var middleware = {};

middleware.checkTaskOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Task.findById(req.params.id, function(err, foundTask){
            if(err ||  !foundTask){
                console.log(err);
                res.redirect('back');
            }else{
                //does user own group
                
                if(foundTask.author.id.equals(req.user._id)){
                    next();
                }else{
                    // res.redirect('/login');
                    // res.redirect('/login');
                    res.send('You do not have permission to do that!');
                }
            }
        });
    }else{
        res.redirect('/login');
    }
}

middleware.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated){
        // console.log('Authentication done!');
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                res.redirect('back');
            }else{
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                }else{
                    res.redirect('back')
                }
            }
        });
    }else{
        res.redirect('/login');
    }
}

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = middleware;