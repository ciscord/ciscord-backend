
import * as express from "express";
import { GraphQLServer } from 'graphql-yoga'
import { sign } from 'jsonwebtoken';
import * as passport from 'passport';
import * as request from 'request';

let TwitterTokenStrategy = require('passport-twitter-token');
let router = express.Router();

export default class SocialConfig {
  public static configure(server: GraphQLServer): void {

    // Initialize Passport and restore authentication state, if any, from the
    // session.
    server.use(passport.initialize());
    server.use(passport.session());

    server.use('/api/v1', router);
    
    passport.use(new TwitterTokenStrategy({
      consumerKey: process.env['TWITTER_CONSUMER_KEY'],
      consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
      includeEmail: true
    },
    function (token: any, tokenSecret: any, profile: any, done: (arg0: any, arg1: { token: any; tokenSecret: any; profile: any; }) => void) {
      const user = {
        token,
        tokenSecret,
        profile,
      }
      done(null, user);
    }));

    // Twitter
  
  router.route('/health-check').get(function(req, res) {
    res.status(200);
    res.send('Hello World');
  });
  
  
  var createToken = function(auth: { id: any; }) {
    return sign({ id: auth.id }, process.env['APP_SECRET']);
  };
  
  var generateToken = function (req: { token: any; auth: any; }, res: any, next: () => void) {
    req.token = createToken(req.auth);
    return next();
  };
  
  var sendToken = function (req: { token: any; user: any; }, res: { setHeader: (arg0: string, arg1: any) => void; status: (arg0: number) => { send: (arg0: string) => void; }; }) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
  };
  
  router.route('/auth/twitter/reverse')
    .post(function(req, res) {
      request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
          consumer_key: process.env['TWITTER_CONSUMER_KEY'],
          consumer_secret: process.env['TWITTER_CONSUMER_SECRET'],
        }
      }, function (err: { message: any; }, r: any, body: { replace: (arg0: RegExp, arg1: string) => { replace: (arg0: RegExp, arg1: string) => string; }; }) {
        if (err) {
          return res.send(500, { message: err.message });
        }
  
  
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
  
        res.send(JSON.parse(jsonStr));
      });
    });
  
  router.route('/auth/twitter')
    .post((req, res, next) => {
      request.post({
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          consumer_key: process.env['TWITTER_CONSUMER_KEY'],
          consumer_secret: process.env['TWITTER_CONSUMER_SECRET'],
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      }, function (err: { message: any; }, r: any, body: { replace: (arg0: RegExp, arg1: string) => { replace: (arg0: RegExp, arg1: string) => string; }; }) {
        if (err) {
          return res.send(500, { message: err.message });
        }
        
  
        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
  
        const parsedBody = JSON.parse(bodyString);
  
        if (!req.body) {
          req.body = {};
        }
        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;
  
        next();
      });
    }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
        if (!req.user) {
          return res.send(401, 'User Not Authenticated');
        }
  
        // prepare token for API
        req.auth = {
          id: req.user.id
        };
  
        return next();
      }, generateToken, sendToken);
  
  
  };
  
  
}
