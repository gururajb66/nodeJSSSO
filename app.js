var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
console.log('one');
app.use(cookieParser());
app.use(session({resave:'true',saveUninitialized:'true', secret:'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
console.log('two');
passport.serializeUser(function(user,done){
done(null,user);
});
passport.deserializeUser(function(obj,done){
done(null,obj);
});

var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var ssoConfig = services.SingleSignOn[0]; 
var client_id = ssoConfig.credentials.clientId;
var client_secret = ssoConfig.credentials.secret;
var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
var token_url = ssoConfig.credentials.tokenEndpointUrl;
var issuer_id = ssoConfig.credentials.issuerIdentifier;
var callback_url = 'https://nodejssso.herokuapp.com/auth/sso/callback';
 
console.log('three'+token_url+'  '+issuer_id);

var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
                authorizationURL : authorization_url,
                tokenURL : token_url,
                clientID : client_id,
                scope : 'email',
                response_type : 'code',
                clientSecret : client_secret,
                callbackURL : callback_url,
                skipUserProfile : true,
                issuer : issuer_id},
      function(iss, sub, profile, accessToken, refreshToken, params, done) {
        process.nextTick(function() {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            done(null, profile);
        })
      }
)
 
passport.use(Strategy); 
 
app.get('/auth/sso/callback',function(req,res,next) {
	console.log('call came back after auth');
    var redirect_url = req.session.originalUrl;
        passport.authenticate('openidconnect', {
                successRedirect: redirect_url,
                failureRedirect: '/failure',
        })(req,res,next);
    });
 
app.get('/failure', function(req, res) { 
	console.log('failedd');
             res.send('login failed'); });
 
app.get('/login', passport.authenticate('openidconnect', {})); 
 
function ensureAuthenticated(req, res, next) {
  if(!req.isAuthenticated()) {
              req.session.originalUrl = req.originalUrl;
    res.redirect('/login');
  } else {
    return next();
  }
}
 
app.get('/hello', ensureAuthenticated, function(req, res) {
             res.send('Hello, '+ req.user['id'] + '!');
           });

const server = app.listen(process.env.PORT||"8080",function(){
	const port = server.address().port;
	console.log("Emp App is listening on "+port);
	});
