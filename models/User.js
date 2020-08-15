const mongoose = require("mongoose");

const { Schema } = mongoose;

const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  username: { required: true, type: String },
  password: { required: true, type: String },
  avatarImage: {
    type: String,
    default:
      "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png",
  },
});

UserSchema.methods.add = function() {
  return new Promise(resolve => {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) throw err;
      this.password = hash;
      this.save((error, savedObj) => {
        if (error) throw error;
        resolve(savedObj);
      });
    });
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
