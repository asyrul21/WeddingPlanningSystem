const express = require('express');
const router = express.Router();
const Task = require('../models/task');

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
router.get('/new', isLoggedIn, function(req, res){
    res.render('tasks/new');
    
});

//add new task post request
router.post('/' , isLoggedIn ,function(req, res){
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
             res.redirect('back');
         }else{
             res.render('tasks/show', {task: foundTask});
         }
     });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // res.send('You need to be logged in to do that!');
    res.redirect('/login');
}

module.exports = router;
