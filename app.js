var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();

app.use(cookieParser());
app.use(session({resave:'true',saveUninitialized:'true', secret:'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user,done){
done(null,user);
});
passport.deserializeUser(function(obj,done){
done(null,obj);
});


const server = app.listen(process.env.PORT||"8080",function(){
	const port = server.address().port;
	console.log("Emp App is listening on "+port);
	});

//app.post();

//app.put();t
