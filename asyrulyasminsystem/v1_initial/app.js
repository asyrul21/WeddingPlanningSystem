//npm install express ejs body-parser request --save
// console.log("Hello World!");

const express = require('express');
const app = express();

//enable .ejs auto extension
app.set('view engine', 'ejs');

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    // res.send('This is the landing page!');
    res.render('landing');
})

app.get('/tasks', function(req, res){
    // res.send('This is where you view all tasks!');
    res.render('tasks', {tasks: tasks});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Starting Asyrul\'s Wedding App Server!');
});

//add new task form
app.get('/tasks/new', function(req, res){
    res.render('new');
    
});

//add new task post request
app.post('/tasks' , function(req, res){
    // console.log('BODY PARSER TEST:', req.body);
    // res.send('YOU HIT THE POST ROUTE!');
    var name = req.body.name;
    var image = req.body.image;
    var newTask = {
        name: name,
        image: image
    }
    
    tasks.push(newTask);
    
    res.redirect('/tasks');
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

