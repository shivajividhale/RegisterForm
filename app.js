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
    confirmPassword: String,
    age: Number
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

function checkStringLength(a){
    if (a.length == 0){
        error += 'Please enter a value in the required field\n';
        return 0;
    }
    return 1;
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

function validatePassword(password1, password2){
    if(password1===undefined || password1===null)
        error += 'Please enter password\n';
    else if(password1.length < 6 || password1.length >20)
        error += 'Password should be between 6 and 20 characters\n'
    else if(password1.match(/([a-z])/gi)===null||password1.match(/([0-9])/gi)===null)
        error += 'Password should contain atleast one character and one number\n';
    if(password1 != password2)
        error += 'Passwords do not match\n';
}

app.post('/register',function(req, res){
    var user = new User({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        confirmPassword: req.body.cpassword
    });

    validateString(user.firstName);
    validateString(user.lastName);
    checkAge(user.age);
    validatePassword(user.password, user.confirmPassword);
    if(error.length > 0)
    {
        console.log(error);
        res.render("errorRegister.jade",{message: error});
        error = "";
    }
    else
    {
        res.render("successRegister.jade");
    }
});
//app.listen(process.env.PORT || 3000);
exports.checkStringLength = checkStringLength;
exports.checkSpecialCharacters=checkSpecialCharacters;
exports.validateString=validateString;
exports.checkAge=checkAge;
exports.validatePassword=validatePassword;