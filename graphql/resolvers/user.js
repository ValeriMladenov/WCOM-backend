const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const getAuthenticatedUser = require("../middlewares/authenticated");
const User = require("../../models/User");

const generateToken = user => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      avatarImage: user.avatarImage,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 604800,
    }
  );
};

module.exports = {
  Query: {
    loadUser: async (_, __, context) => {
      const { user, token } = getAuthenticatedUser(context);
      if (!user) {
        throw new Error("Unauthenticated!");
      }
      const dbuser = await User.findById(user._id).select("-password");
      return {
        token,
        ...dbuser._doc,
      };
    },
  },
  Mutation: {
    register: async (_, { username, password }) => {
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("User already exist!");
      }

      const newUser = new User({
        username,
        password,
      });

      const savedUser = await newUser.add();

      const token = generateToken(newUser);
      return {
        ...savedUser._doc,
        token,
      };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new UserInputError("User not found");
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new UserInputError("Wrong crendetials");
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        token,
      };
    },
  },
};
