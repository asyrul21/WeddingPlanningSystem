const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const middleware = require('../middleware/index');

//index routes - view all
//view all
router.get('/', function(req, res){
    // res.send('This is where you view all tasks!');
    // res.render('tasks', {tasks: tasks});
    
    //view all tasks in DB
    Task.find({}, function(err , allTasks){
        if(err){
            console.log(err);
        }else{
            res.render('tasks/index', {tasks: allTasks});
        }
    });
});

//add new task form
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('tasks/new');
    
});

//add new task post request
router.post('/' , middleware.isLoggedIn ,function(req, res){
    // console.log('BODY PARSER TEST:', req.body);
    // res.send('YOU HIT THE POST ROUTE!');
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var progress = req.body.progress;
    
    var newTask = {
        name: name,
        image: image,
        description: desc,
        author: author,
        progress: progress
    }
    
    // tasks.push(newTask);
    
    //create new task in DB
    Task.create(newTask, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/tasks"); //redirect is URL path, but render is the FILE path 
        }
    });
    
});

//show page for each task
router.get('/:id', function(req, res){
    
    // console.log('Request PARAMS:', req.params); //params is from colon of url /tasks/:id
    // res.send("This will be show PAGE!");
    
     Task.findById(req.params.id).populate("comments").exec(function(err, foundTask){
         if(err || !foundTask){
             console.log(err);
             req.flash("error", "No such task!");
             res.redirect('/tasks');
         }else{
             res.render('tasks/show', {task: foundTask});
         }
     });
});

//edit form
router.get('/:id/edit', middleware.checkTaskOwnership, function(req, res){
    // res.send('EDIT form for task!');
        
    // Task.findById(req.params.id, function(err, foundTask){
    //     if(err || !foundTask){
    //         console.log(err);
    //         req.flash('error', 'No such Task found.');
    //         res.redirect('/tasks');
    //     }else{
    //         res.render('tasks/edit', {task: foundTask})        
    //     }
    // })
    
    Task.findById(req.params.id, function(err, foundTask) {
        res.render('tasks/edit', {task: foundTask});
    });
});

//update logic
router.put('/:id', middleware.checkTaskOwnership,function(req, res){
    //find task
    Task.findByIdAndUpdate(req.params.id, req.body.task, function(err, editedTasks){
        if(err || !editedTasks){
            console.log(err);
            req.flash('error', 'Editing task was unsuccessful');
            res.redirect('back');
        }else{
            res.redirect('/tasks/' + req.params.id);
        }
    });
});

//delete route
router.delete('/:id', middleware.checkTaskOwnership, function(req, res){
    
    Task.findByIdAndRemove(req.params.id, function(err, foundTask){
        if(err || !foundTask){
            res.redirect('/tasks');
        }else{
            res.redirect('/tasks');
        }
    });
});

module.exports = router;
