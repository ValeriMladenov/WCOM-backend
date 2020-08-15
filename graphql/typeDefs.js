const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID
    username: String!
    avatarImage: String!
    token: String!
  }

  type Query {
    ping: String!
    loadUser: User
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): User!
  }
`;
