//npm install express ejs body-parser request --save
// console.log("Hello World!");
const express = require('express');
const app = express();
const request = require('request');
//Mongo setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wedding_tasks_monitor', { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost:27017/wedding_task_monitor", { useNewUrlParser: true });


//enable .ejs auto extension
app.set('view engine', 'ejs');

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//=====================
//========SCHEMA=======
//=====================

//Schema setup
var Task = require('./models/task');
var Comment = require('./models/comment');



//=====================
//=====================

app.get('/', function(req, res){
    // res.send('This is the landing page!');
    res.render('landing');
})

//view all
app.get('/tasks', function(req, res){
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
app.get('/tasks/new', function(req, res){
    res.render('tasks/new');
    
});

//add new task post request
app.post('/tasks' , function(req, res){
    // console.log('BODY PARSER TEST:', req.body);
    // res.send('YOU HIT THE POST ROUTE!');
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var progress = req.body.progress;
    
    var newTask = {
        name: name,
        image: image,
        description: desc,
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
app.get('/tasks/:id', function(req, res){
    
    // console.log('Request PARAMS:', req.params); //params is from colon of url /tasks/:id
    // res.send("This will be show PAGE!");
    
    //find the task of that id
    //  Task.findById(req.params.id, function(err, foundTask){
    //      if(err || !foundTask){
    //          console.log(err);
    //          res.redirect('back');
    //      }else{
    //          res.render('show', {task: foundTask});
    //      }
    //  });
    
     Task.findById(req.params.id).populate("comments").exec(function(err, foundTask){
         if(err || !foundTask){
             console.log(err);
             res.redirect('back');
         }else{
             res.render('tasks/show', {task: foundTask});
         }
     });
});

//=====================
//======COMMENTS=======
//=====================

//== add new comments FORM
app.get('/tasks/:id/comments/new', function(req, res){
    // res.send('THIS IS NEW COMMENTS PAGE!');
    
    Task.findById(req.params.id, function(err, task){
        if(err || !task){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('comments/new', {task: task});
        }
    })
});

app.post('/tasks/:id/comments', function(req, res){
    // res.send('COMMENTS POST ROUTE!');
    
    //  Task.create(newTask, function(err, newlyCreated){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.redirect("/tasks"); //redirect is URL path, but render is the FILE path 
    //     }
    // });
    
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
                    res.redirect('/tasks/' + req.params.id);
                }
            })
        }
    })
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Starting Asyrul\'s Wedding App Server!');
});

//temporary storage
const tasks = [
        {
          name: "PA System", 
          image: "https://images.unsplash.com/photo-1533621517681-fd36c2e12666?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3a7349118668b09219b67a418a9f2bdd&auto=format&fit=crop&w=1050&q=80"  
        },
        {
            name: "Doorgifts",
            image: "https://images.unsplash.com/photo-1532348180050-a3f7dbe27642?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5f5429369fe042e5c56c4b4cd0a52c4a&auto=format&fit=crop&w=652&q=80"
        },
        {
            name: "Catering",
            image: "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=94bc060b3ea71111a8caeb6e1ace30f0&auto=format&fit=crop&w=1050&q=80"
        }
]

