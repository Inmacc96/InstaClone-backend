import { ApolloServer, BaseContext } from "@apollo/server";
import { readFileSync } from "fs";
import { createUser } from "../../../../src/controllers/user";
import resolvers from "../../../../src/gql/resolvers";
import { UserInput, User } from "../../../../src/types/graphql";

const typeDefs = readFileSync("src/gql/schema.graphql", { encoding: "utf-8" });

jest.mock("../../../../src/controllers/user", () => ({
  createUser: jest.fn(),
}));

const userInput: UserInput = {
  name: "user test",
  username: "usertest",
  email: "usertest@usertest.com",
  password: "usertest123",
};

const userTest: User = {
  id: "ObjectId('6408bddf556f56e7beffa95c')",
  ...userInput,
  password: "$2a$10$eAX2vLXJw/6jpYKx33kOL.RVxZYZ2eeGUcR/3NsQOmK2Q7Ds7QmW2",
};

let testServer: ApolloServer<BaseContext>;

beforeEach(() => {
  jest.resetAllMocks();
  testServer = new ApolloServer<BaseContext>({ typeDefs, resolvers });
});

describe("[Mutation.newUser]", () => {
  const query = `#graphql
    mutation newUser($input: UserInput!){
      newUser(input: $input){
      id
      name
      email
      username
      password
      }
  }
`;

  it("should create a new user", async () => {
    (createUser as jest.Mock).mockResolvedValue(userTest);

    const response = await testServer.executeOperation({
      query,
      variables: { input: userInput },
    });

    expect(createUser).toHaveBeenCalledWith(userInput);
    expect(response).toMatchSnapshot();
  });
});
