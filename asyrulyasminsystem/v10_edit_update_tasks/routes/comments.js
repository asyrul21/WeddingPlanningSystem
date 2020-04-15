const express = require('express');
// const router = express.Router();
var router = express.Router({mergeParams: true}); //merge params is important!

const Task = require('../models/task');
const Comment = require('../models/comment');

const middleware = require('../middleware/index');

//== add new comments FORM
router.get('/new', middleware.isLoggedIn, function(req, res){
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
router.post('/', middleware.isLoggedIn, function(req, res){
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
                    
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    
                    foundTask.comments.push(newComment);
                    foundTask.save();
                    // res.redirect('/tasks/' + req.params.id); OR
                    res.redirect('/tasks/' + foundTask._id);
                }
            })
        }
    })
});

//comment edit form
router.get('/:comment_id/edit', function(req, res){
    
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            console.log(err);
            res.redirect('back');
        }else{
            // console.log('params id:', req.params.id);
            res.render('comments/edit', {task_id: req.params.id, comment: foundComment});
        }
    })
});

//comment updating logic
router.put('/:comment_id', middleware.checkCommentOwnership, function(req,res){
    console.log('link works!');
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || !updatedComment){
            console.log(err);
            res.redirect('back');
        }else{
            console.log('Updating success!');
            res.redirect('/tasks/' + req.params.id);
        }
    });
});

//comment delete route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            console.log('Comment deleted!');
            res.redirect('/tasks/' + req.params.id);
        }
    });
});

module.exports = router;