const express = require('express');
// const router = express.Router();
var router = express.Router({mergeParams: true}); //merge params is important!

const Task = require('../models/task');
const Comment = require('../models/comment');

//== add new comments FORM
router.get('/new', isLoggedIn, function(req, res){
    // res.send('THIS IS NEW COMMENTS PAGE!');
    
    Task.findById(req.params.id, function(err, task){
        if(err || !task){
            // res.send('TASK not found');
            console.log(err);
            res.redirect('back');
        }else{
            res.render('comments/new', {task: task});
        }
    })
});

//add new comments
router.post('/', isLoggedIn, function(req, res){
    // res.send('COMMENTS POST ROUTE!');
    
    Task.findById(req.params.id, function(err, foundTask){
        if(err || !foundTask){
            console.log(err);
            res.redirect('back');
        }else{
            //comment[] object is passed via req.body
            Comment.create(req.body.comment, function(err, newComment){
                if(err || !newComment){
                    console.log(err);
                    res.redirect('back');
                }else{
                    foundTask.comments.push(newComment);
                    foundTask.save();
                    // res.redirect('/tasks/' + req.params.id); OR
                    res.redirect('/tasks/' + foundTask._id);
                }
            })
        }
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // res.send('You need to be logged in to do that!');
    res.redirect('/login');
}

module.exports = router;