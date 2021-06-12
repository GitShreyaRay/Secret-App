//jshint esversion:6

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema( {
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']});

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
    const password = req.body.password;
    User.findOne({'email':username}, function(err, foundUser) {
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets");
                } else {
                    res.render("login", {error: "Wrong username or password."});
                }
            }
        }
    });
});

app.route("/register")
.get(function(req, res) {
    res.render("register");
})
.post(function(req, res) {
    newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err) {
        if(err) {
            console.log(err);
        }
        res.render("secrets");
    });
});




app.listen(3000, function() {
    console.log("Server started at port: 3000");
})
