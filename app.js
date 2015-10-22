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
var error = '';
//mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/registerForm');

var User = mongoose.model('User', new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true},
    password: String,
    age: Number,
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
    res.render('register.html');
});

function checkStringLength(a){
    //console.log(a);
    //if(a == undefined)
    //    return false;
    if (a.length <= 0)
        error += 'Please enter a value in the required field\n';
}

function checkSpecialCharacters(a){
        if(a.match(/[_\W0-9]/))
            error += 'String contains invalid characters\n';
}

function validateString(a){
    checkStringLength(a);
    checkSpecialCharacters(a);
}

function checkAge(age){
    if(isNaN(age))
        error += 'Please enter numeric values\n';
    else{
        if(age <=0 || age > 200)
            error += 'Please enter a valid age\n';
    }
}

app.post('/register',function(req, res){
   console.log("Entered post register");
    console.log(req.body) ;
    var user = new User({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age
    });

    validateString(user.firstName);
    validateString(user.lastName);
    checkAge(user.age);
    if(error.length > 0){
        console.log(error);
        error = '';
    }
});
app.listen(process.env.PORT || 3000);