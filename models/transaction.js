const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = Schema({
  is_personal: { type: Boolean, required: true, default: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Transaction = module.exports = mongoose.model('Transaction', TransactionSchema);