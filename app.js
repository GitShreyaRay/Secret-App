//jshint esversion:6

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema( {
    email: String,
    password: String
});


const User = mongoose.model('User', userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.route("/login")
.get(function(req, res) {
    res.render("login", {error: ""});
})
.post(function(req, res) {
    const username = req.body.username;
    User.findOne({'email':username}, function(err, foundUser) {
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    if(err) {
                        console.log(err);
                    } else {
                        if(result) {
                            res.render("secrets");
                        } else {
                            res.render("login", {error: "Wrong username or password."});
                        }
                    }
                });
            
            } else {
                res.render("login", {error: "User not found."});
            }
        }
    });
});

app.route("/register")
.get(function(req, res) {
    res.render("register");
})
.post(function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash

        });

    newUser.save(function(err) {
        if(err) {
            console.log(err);
        }
        res.render("secrets");
    });
});
});




app.listen(3000, function() {
    console.log("Server started at port: 3000");
})
