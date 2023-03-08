import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import User from "../../../src/models/user";
import { UserInput } from "../../../src/types/graphql";
import { createUser } from "../../../src/controllers/user";

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

afterAll(() => {
  mongoose.connection.close();
});
