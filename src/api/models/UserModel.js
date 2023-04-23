const mongoose = require('mongoose');

const BaseSchema = require('../../utils/database/mongoose');
const config = require('../../config');

const UserSchema = new BaseSchema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: config.USER_ROLE,
      required: true,
    }
  }
);

module.exports = mongoose.model('User', UserSchema);
