import { ApolloServer, BaseContext } from "@apollo/server";
import { readFileSync } from "fs";
import { GraphQLError } from "graphql";
import { createUser, authUser } from "../../../../src/controllers/user";
import resolvers from "../../../../src/gql/resolvers";
import { UserInput, User, AuthInput } from "../../../../src/types/graphql";

const typeDefs = readFileSync("src/gql/schema.graphql", { encoding: "utf-8" });

jest.mock("../../../../src/controllers/user", () => ({
  createUser: jest.fn(),
  authUser: jest.fn(),
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
      createdAt
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

describe("[Mutation.authUser]", () => {
  const query = `#graphql
  mutation authUser($input: AuthInput!){
    authUser(input: $input){
      token
    }
}`;

  it("should return a token when the input is correct", async () => {
    const userInput: AuthInput = {
      email: "usertest@usertest.com",
      password: "usertest123",
    };

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDljOWNlZjIwZGI1NmRiMzVkZjRjZCIsImVtYWlsIjoidXNlcnRlc3RAdXNlcnRlc3QuY29tIiwidXNlcm5hbWUiOiJ1c2VydGVzdCIsIm5hbWUiOiJ1c2VyIHRlc3QiLCJpYXQiOjE2NzgzNjMwODYsImV4cCI6MTY3ODQ0OTQ4Nn0.5fXyYiF9bOzHJNvLzEWBspkQAN4V8qIPKOo10qciEg8";

    (authUser as jest.Mock).mockResolvedValue({ token });

    const response = await testServer.executeOperation({
      query,
      variables: { input: userInput },
    });

    expect(response).toMatchSnapshot();
  });

  it("should throw an error when wrong email are provided", async () => {
    const userInput: AuthInput = {
      email: "usertest2@usertest.com",
      password: "usertest123",
    };

    const error = {
      msg: "Wrong credentials",
      code: "BAD_USER_INPUT",
    };

    (authUser as jest.Mock).mockRejectedValue(
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
});
