const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Transaction = require('./transaction');

// User Schema
const UserSchema = mongoose.Schema({
  is_admin: {
    type: Boolean,
    default: false,
    required: true
  },
  is_verified: {
    type: Boolean,
    default: false,
    required: true
  },
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
  usecase: {
    type: String
  }
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
  User.findOne({_id: data.user_id}, (err, user) => {
    if (user) {
      user.balance = user.balance + data.amount;
      user.save((err) => {
        if (err) {
          callback(err);
          return null;
        }
      });

      const tr = {
        is_personal: true,
        user: user._id,
        amount: data.amount
      }

      const trx = Transaction(tr);
      trx.save((err) => {
        if (err) {
          callback(err);
          return null;
        }
      });

      callback(null);
    } else {
      callback("User not found.");
    }
  })
}

module.exports.transferMoney = function(data, callback) {
  if (data.amount < 1) {
    callback("Amount must be positive");
    return null;
  }

  User.findOne({_id: data.sender}, (err, sender) => {
    if (sender) {
      if (sender.balance < data.amount) {
        callback("Sender does not have sufficient balance.");
      } else {
        User.findOne({ username: data.recipient }, (err, recipient) => {
          if (recipient) {
            if (sender._id.equals(recipient._id)) {
              callback("Sending to your own account is not allowed.");
              return null;
            }

            sender.balance = sender.balance - data.amount;
            sender.save((err) => {
              if (err) {
                callback("Transfer failed.")
                return null;
              }
            });

            recipient.balance = recipient.balance + data.amount;
            recipient.save((err) => {
              if (err) {
                callback("Transfer failed.");
                return null;
              }
            });

            const tr = {
              is_personal: false,
              sender: sender._id,
              recipient: recipient._id,
              amount: data.amount
            }

            const trx = Transaction(tr);
            trx.save((err) => {
              if (err) {
                callback(err);
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