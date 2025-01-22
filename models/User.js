const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
}, { timestamps: true });

module.exports = model('User', userSchema);
