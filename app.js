/**
 * Created by Shivaji, Sushil and Abidaan.
 */
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var session = require('client-sessions');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/registerForm');

var User = mongoose.model('User', new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true},
    password: String,
}));

app.engine('html', require('ejs').renderFile);
//Middleware
app.set('view engine','jade');
app.use(session({
    cookieName: 'session',
    secret: 's1l2aesdkfmb2342jasfdahj23b4hv2j4q2v43',
    duration: 30*60*1000
}));
//Connect to MongoDB
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req, res){
    res.render('register.jade');
});

app.post('/register',function(req, res){
   console.log("Entered post register");
    console.log(req.body) ;
    var user = new User({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err){
        if (err){
            if(err.code == 11000){
                var error = "Account with this emailID already exists";
            }
            else {var error = "Could not register user. Try again."}
            res.render('register.jade',{error: error});
        }
        else {
            // using SendGrid's Node.js Library - https://github.com/sendgrid/sendgrid-nodejs
            var sendgrid = require("sendgrid")("shivajividhale", "battlehack2015");
            var email = new sendgrid.Email();
            var sendemail = req.body.email;
            email.addTo(sendemail);
            email.setFrom("savidhal@ncsu.edu");
            email.setSubject("Knowledge is valuable");
            email.setHtml("We are glad to have you on board");

            //sendgrid.send(email);
            console.log("email sent");
            console.log("Added user");
                res.render('thanks.html');
            }
    });
});
app.listen(process.env.PORT || 3000);