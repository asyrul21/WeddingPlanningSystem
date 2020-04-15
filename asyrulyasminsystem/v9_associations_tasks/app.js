//npm install express ejs body-parser request --save
// console.log("Hello World!");
const express = require('express');
const app = express();
const request = require('request');

//authentication
// npm install passport passport-local passport-local-mongoose express-session --save
const passport = require('passport');
const LocalStrategy = require('passport-local');

//Mongo setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wedding_tasks_monitor', { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost:27017/wedding_task_monitor", { useNewUrlParser: true });

//SCHEMA setup
var Task = require("./models/task");
var Comment = require("./models/comment");
var Admin = require("./models/admin");

//enable .ejs auto extension
app.set('view engine', 'ejs');

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//custom stylesheet
app.use(express.static(__dirname + "/public"));

//=====================
//=== PASSPORT SETUP ==
//=====================
// npm install passport-local-mongoose --save

app.use(require('express-session')({
    secret: 'Asyrul kahwins on the 18 November 2018',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

//middleware to enable current user for all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//==================
//====REMOVE ALL====
const remove_all = require('./remove_all');
remove_all();


//==================================
//==================================
//require all routes

const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

app.use('/', indexRoutes);
app.use('/tasks', taskRoutes);
app.use('/tasks/:id/comments', commentRoutes);


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

