const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found.'});
    }

    if (!user.is_verified) {
      return res.json({success: false, msg: 'User is not verified.'})
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){

        const token = jwt.sign({data: user}, config.secret, {
            expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            is_verified: user.is_verified,
            is_admin: user.is_admin
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

//update Balance
router.post('/updateBalance', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
  // console.log(req.body);

  let data = {
      amount: req.body.amount,
      user_id: req.user._id
  };
  // console.log(name);

  // console.log("reached router");
  User.updateBalance(data,(err)=>{
    if (err) {
        res.json({
            success: false,
            msg: err
        })
    } else {
        res.json({
            success: true,
            msg: 'Account balance updated sucesssfully'
        })
    }
  });
});


// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

router.post('/fundstransfer', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  let data = {
    sender: req.user._id,
    amount: req.body.amount,
    recipient: req.body.username,
  }

  User.transferMoney(data, (err) => {
    if (err) {
      res.json({
          success: false,
          msg: err
      })
    } else {
        res.json({
            success: true,
            msg: 'Amount transferred successfully.'
        })
    }
  })
});

router.get('/getAll', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  if (!req.user.is_admin) {
    res.json({success: false, msg: 'Not allowed.'});
  }
  
  var query = User.find().select('name email _id is_verified');

  query.exec(function (err, users) {
    if (err) res.json({success: false, msg: err})
    res.json(users);
  });
});

router.post('/verifyUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  if (!req.user.is_admin) {
    res.json({success: false, msg: 'Not allowed.'});
  }
  
  User.findOne({ _id: req.body.id }, (err, user) => {
    if (user) {
      console.log(user);
      user.is_verified = true;
      user.save();
      res.json({
        success: true,
        msg: 'User has been verified successfully.'
     });
     return null
    }

    res.json({
      success: false,
      msg: 'User could not be verified.'
    })
  });
});

module.exports = router;
