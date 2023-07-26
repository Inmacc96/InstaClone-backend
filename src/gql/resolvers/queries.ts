import { getUser } from "../../controllers/user";
import { QueryResolvers } from "../../types/graphql";

const queries: QueryResolvers = {
  // User
  getUser: (_, { id, username }) => getUser({ id, username }),
};

export default queries;
