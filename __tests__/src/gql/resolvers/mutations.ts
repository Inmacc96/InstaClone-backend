import { ApolloServer, BaseContext } from "@apollo/server";
import { readFileSync } from "fs";
import { GraphQLError } from "graphql";
import { createUser } from "../../../../src/controllers/user";
import resolvers from "../../../../src/gql/resolvers";
import { UserInput, User } from "../../../../src/types/graphql";

const typeDefs = readFileSync("src/gql/schema.graphql", { encoding: "utf-8" });

jest.mock("../../../../src/controllers/user", () => ({
  createUser: jest.fn(),
}));

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

  it("should create a new user when the input is valid", async () => {
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

    (createUser as jest.Mock).mockResolvedValue(userTest);

    const response = await testServer.executeOperation({
      query,
      variables: { input: userInput },
    });

    expect(createUser).toHaveBeenCalledWith(userInput);
    expect(response).toMatchSnapshot();
  });

  it("should throw error when the email input is already in use", async () => {
    const userInput: UserInput = {
      name: "user test",
      username: "usertest",
      email: "usertest@usertest.com",
      password: "usertest123",
    };

    const error = {
      msg: "This email is already in use",
      code: "BAD_USER_INPUT",
      argumentName: "email",
    };

    (createUser as jest.Mock).mockRejectedValue(
      new GraphQLError(error.msg, {
        extensions: {
          code: error.code,
          argumentName: error.argumentName,
        },
      })
    );

    const response = await testServer.executeOperation({
      query,
      variables: { input: userInput },
    });

    expect(response).toMatchSnapshot();
  });

  it("should throw error when the username input is already in use", async () => {
    const userInput: UserInput = {
      name: "user test",
      username: "usertest",
      email: "usertest@usertest.com",
      password: "usertest123",
    };

    const error = {
      msg: "This username is already in use",
      code: "BAD_USER_INPUT",
      argumentName: "username",
    };

    (createUser as jest.Mock).mockRejectedValue(
      new GraphQLError(error.msg, {
        extensions: {
          code: error.code,
          argumentName: error.argumentName,
        },
      })
    );

    const response = await testServer.executeOperation({
      query,
      variables: { input: userInput },
    });

    expect(response).toMatchSnapshot();
  });

  it("should throw error when there is an error saving the user", async () => {
    const userInput: UserInput = {
      name: "user test",
      username: "usertest",
      email: "usertest@usertest.com",
      password: "usertest123",
    };

    const error = {
      msg: "Error saving the new user in the database",
      code: "INTERNAL_SERVER_ERROR",
    };

    (createUser as jest.Mock).mockRejectedValue(
      new GraphQLError(error.msg, {
        extensions: {
          code: error.code,
        },
      })
    );

    const response = await testServer.executeOperation({
      query,
      variables: { input: userInput },
    });

    expect(response).toMatchSnapshot();
  });

  it("should throw error when the input is empty", async () => {
    const userInput = {};

    const response = await testServer.executeOperation({
      query,
      variables: { input: userInput },
    });

    expect(response).toMatchSnapshot();
  });

  it("should throw error when some of the required fields of the input are empty", async () => {
    const userInput = {
      username: "usertest",
      email: "usertest@usertest.com",
      password: "usertest123",
    };

    const response = await testServer.executeOperation({
      query,
      variables: { input: userInput },
    });

    expect(response).toMatchSnapshot();
  });
});
