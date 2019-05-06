const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}

module.exports.updateBalance = function(data, callback){
  User.findOne({username: data.username}, (err, user) => {
    if (user) {
      user.balance = user.balance + data.amount;
      user.save(callback); // add callback here
    } else {
      callback("User not found.");
    }
  })
}

module.exports.transferMoney = function(data, callback) {
  User.findOne({username: data.sender}, (err, sender) => {
    if (sender) {
      if (sender.balance < data.amount) {
        callback("Sender does not have sufficient balance.");
      } else {
        User.findOne({ username: data.recipient }, (err, recipient) => {
          if (recipient) {
            recipient.balance = recipient.balance + data.amount;
            sender.balance = sender.balance - data.amount;

            sender.save((err) => {
              if (err) {
                callback("Transfer failed.")
                return null;
              }
            });
            recipient.save((err) => {
              if (err) {
                callback("Transfer failed.");
                return null;
              }
            });
            callback(null);
          } else {
            callback("Recipient not found.")
          }
        })
      }
    } else {
      callback("Sender not found.");
    }
  })
}