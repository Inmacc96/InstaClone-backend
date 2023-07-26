import { QueryResolvers } from "../../types/graphql";

const queries: QueryResolvers = {
  // User
  getUser: () => {
    console.log("Getting user");
    return null;
  },
};

export default queries;
