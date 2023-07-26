import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import User from "../../../src/models/user";
import { AuthInput, UserInput } from "../../../src/types/graphql";
import { authUser, createUser } from "../../../src/controllers/user";

const userInput: UserInput = {
  name: "user test",
  username: "usertest",
  email: "usertest@usertest.com",
  password: "usertest123",
};

beforeEach(async () => {
  await mongoose.connect(`${process.env.MONGO_URI_TEST}`);
  await User.deleteMany({});
});

describe("createUser", () => {
  it("should create a new user when the input is valid", async () => {
    const newUser = await createUser(userInput);

    expect(newUser).toBeDefined();
    expect(newUser.name).toEqual(userInput.name);
    expect(newUser.username).toEqual(userInput.username);
    expect(newUser.email).toEqual(userInput.email);

    const isValidPassword = await bcrypt.compare(
      userInput.password,
      newUser.password
    );

    expect(isValidPassword).toBe(true);
  });

  it("should throw an error when email is already in use", async () => {
    const existingUser = new User({
      email: "usertest@usertest.com",
      username: "existingUser",
      name: "existing User",
      password: "password",
    });
    await existingUser.save();

    await expect(createUser(userInput)).rejects.toThrow(GraphQLError);

    await expect(createUser(userInput)).rejects.toMatchObject({
      message: "This email is already in use",
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "email",
      },
    });
  });

  it("should throw an error when username is already in use", async () => {
    const existingUser = new User({
      email: "test@test.com",
      username: "usertest",
      name: "user test",
      password: "password",
    });
    await existingUser.save();

    await expect(createUser(userInput)).rejects.toThrow(GraphQLError);

    await expect(createUser(userInput)).rejects.toMatchObject({
      message: "This username is already in use",
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "username",
      },
    });
  });

  it("should throw an error when there is an error saving the user", async () => {
    const mockSave = jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(new Error("Database error"));

    await expect(createUser(userInput)).rejects.toThrow(GraphQLError);

    await expect(createUser(userInput)).rejects.toMatchObject({
      message: "Error saving the new user in the database",
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });

    mockSave.mockRestore();
  });
});

describe("authUser", () => {
  beforeEach(async () => {
    //Hashear password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userInput.password, salt);

    const mockUser = new User({ ...userInput, password: hashedPassword });
    await mockUser.save();
  });

  it("should return a token when correct credentials are provided", async () => {
    const authInput: AuthInput = {
      email: "usertest@usertest.com",
      password: "usertest123",
    };

    const { token } = await authUser(authInput);
    expect(token).not.toBeNull();
    expect(typeof token).toBe("string");
  });

  it("should throw an error when wrong email are provided", async () => {
    const authInput: AuthInput = {
      email: "usertest2@usertest.com",
      password: "usertest123",
    };

    await expect(authUser(authInput)).rejects.toThrow(GraphQLError);

    await expect(authUser(authInput)).rejects.toMatchObject({
      message: "Wrong credentials",
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  });

  it("should throw an error when wrong password are provided", async () => {
    const authInput: AuthInput = {
      email: "usertest@usertest.com",
      password: "usertest",
    };

    await expect(authUser(authInput)).rejects.toThrow(GraphQLError);

    await expect(authUser(authInput)).rejects.toMatchObject({
      message: "Wrong credentials",
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  });

  it("should return token null when JWT_SECRET_KEY is not defined", async () => {
    const authInput: AuthInput = {
      email: "usertest@usertest.com",
      password: "usertest123",
    };

    const originalEnv = { ...process.env };
    delete process.env.JWT_SECRET_KEY;

    const { token } = await authUser(authInput);
    expect(token).toBeNull();

    process.env = originalEnv;
  });

  it("should return token null when JWT_SECRET_KEY is a empty string", async () => {
    const authInput: AuthInput = {
      email: "usertest@usertest.com",
      password: "usertest123",
    };

    const originalEnv = { ...process.env };
    process.env.JWT_SECRET_KEY = "";

    const { token } = await authUser(authInput);
    expect(token).toBeNull();

    process.env = originalEnv;
  });
});

afterAll(() => {
  mongoose.connection.close();
});
