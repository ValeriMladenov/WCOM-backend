const pingResolvers = require("./ping");
const userResolvers = require("./user");

module.exports = {
  Query: {
    ...pingResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
