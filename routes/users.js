const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const { Router } = require('express');
const router = express.Router();
const authenticate = require('../authenticate');



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  User.register(new User({username: req.body.username}),
    req.body.password, (err, user) =>{
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-type','application/json');
          res.json({err:err});
        }else {
          if(req.body.firstname){
            user.firstname = req.body.firstname;
          }
          if(req.body.lastname){
            user.lastname = req.body.lastname;
          }
          user.save(err =>{
            if(err){
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err:err});
              return;

            }
            passport.authenticate('local')(req, res, () =>{
              res.statusCode = 200,
              res.setHeader(Content-Type,'application/json');
              res.json({success: true, status:'Registration successful'});
            });
          });
         

        }
  
      }
    );
  });

    
    
  /*User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        const err = new Error(`User${req.body.username} already exist`);
        err.status = 403;
        return next(err);
      } else {
        User.create({
          username: req.body.username,
          password: req.body.password

        })
          .then(user => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ status: 'Registration Successful!', user: user });

          }).catch(err => next(err));

      }
    })
    .catch(err => next(err));



});

router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const err = new Error('you are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);

    }
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const password = auth[1];

    User.findOne({ usename: username })
    Uiser.findOne({ usename: username })
      .then(user => {
        if (!user) {
          const err = new Error(`User ${username} doesnot exist!`);
          err.status = 401;
          return next(err);
        } else if (user.password !== password) {
          const err = new Error('Your password is incorrect!');
          err.status = 401;
          return next(err);
        } else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!')
        }
      })
      .catch(err => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
});
*/
router.post('/login', passport.authenticate('local'),(req,res) =>
  {
    const token = authenticate.getToken({_id:req.user._id});
    res.statusCode =200;
    res.setHeader('Content-Type','application/json');
    res.json({success:true,token:token , status:"you are successfully logged in!"} );
  } );
router.get('/logout',(res, req, next) =>{
  if (req.session){
    req.session.destroy();
    req.clearCookie('session-id');
    res.redirect('/');
  }else {
    const err = new Error("you are not logged in!")
    err.status = 401;
    return next(err);
  }
});

module.exports = router;
