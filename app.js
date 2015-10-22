/**
 * Created by Shivaji, Arjun and Kunal on 10/10/2015.
 */
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var session = require('client-sessions');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/teamup');

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
    res.render('signin.jade');
});
app.get('/register',function(req, res){
    res.render('register.jade');
    console.log("entered register")
});

app.get('/eventDetails',function(req,res){
    var id = req.query.eventId;
    var userid = req.session.user._id;

});

app.post('/createEvent',function(req, res){
    var event = new Event({
        name: req.body.name,
        location : req.body.location,
        teamSize : req.body.teamSize,
        date : req.body.date
    });
    event.save(function (err, events) {
        if(err) {
            console.log("error", err);
            res.redirect('createEventForm');
        }
        else {
            console.log("Saved!");
            Event.find({}, function (err, events) {
                console.log(events);
                res.render('index.jade', { events : events });
            });
        }
    });
});

app.get('/createEventForm',function(req, res){
    res.render('createEvent.html');
    console.log("entered register")
});


app.get('/dashboard',function(req,res){
   if(req.session && req.session.user){
       User.findOne({email: req.session.user.email}, function(err, user){
           if (!user){
               req.session.reset();
               res.render('signin.jade');
           }
           else {
            Event.find({}, function (err, events) {
                    if(events) {
                        res.locals.user = user;
                        res.render('index.jade', { events : events });
                    }
                    else {

                        res.render('index.jade', { events : ['null', 'null2'] });
                    }
                });
           }

       })
   }
    else{
               res.render('signin.jade');
   }
//Session set when user Request our app via URL
    //console.log(sess);

})

app.post('/login',function(req,res){
    console.log("Entered login get"+ req.body.username);
	if(req.body.username){

		User.findOne({email: req.body.username}, function(err, user){
			console.log("findOne callback"+ user);
			if(!user){
				console.log("No user");
				res.render('signin.jade',{error: "Invalid username or password"});
			}
			else{
				console.log("In else");
				if(req.body.password === user.password){
					console.log("Passwords match");
					req.session.user = user;
					res.redirect('/dashboard');
				}
				else {
					console.log("Incorrect password");
					res.render('signin.jade',{error: "Incorrect password"});
				}
			}
		})
	}
	else{
		console.log("Direct Access");
		res.render('signin.jade',{error: "You need to login!"});
	}
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
                res.redirect('/');
            }
    });
});
app.listen(process.env.PORT || 3000);