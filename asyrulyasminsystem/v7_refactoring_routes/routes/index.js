const express = require('express');
const router = express.Router();

const passport = require('passport');
const Admin = require('../models/admin');

//landing page
router.get('/', function(req, res){
    // res.send('This is the landing page!');
    res.render('landing');
});

//authentication
//show register form
router.get('/register', function(req, res){
    res.render('register');
});

// sign up logic
router.post('/register', function(req, res){
    // res.send("Sign Up PAGE!");
    
    var newAdmin = new Admin({username: req.body.username});
    Admin.register(newAdmin, req.body.password, function(err, admin){
        if(err){
            console.log(err);
            return res.render('register');
        }else{
            passport.authenticate('local')(req, res, function(){
                res.redirect('/tasks');
            });
        }
    });
});

//login form
router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/tasks",
    failureRedirect: "login"
}), function(req, res){
    //logic happens here
});

//logout
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;