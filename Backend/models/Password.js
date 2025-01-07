const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  website_name: { type: String, required: true },
  website_username: { type: String, required: true },
  website_password: { type: String, required: true },
});

module.exports = mongoose.model('Password', passwordSchema);
