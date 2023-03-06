const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    username: String!
    email:String!
    avatar: String
    siteWeb: String
    description: String
    password: String!
    createdAt: String
  }

  type Query {
    # User
    getUser: User
  }
`;

export default typeDefs;
