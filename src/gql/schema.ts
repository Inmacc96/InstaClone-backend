const typeDefs = `#graphql
  type User {
    id: ID
    name: String
    username: String
  }

  type Query {
    # User
    getUser: User
  }
`;

export default typeDefs;
