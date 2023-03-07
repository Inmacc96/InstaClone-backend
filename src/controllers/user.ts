import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import User from "../models/user";
import { UserInput, AuthInput } from "../types/graphql";

export const createUser = async (input: UserInput) => {
  const { email, username, password } = input;

  // Revisar si el email está en uso
  const foundEmail = await User.findOne({ email });

  if (foundEmail) {
    throw new GraphQLError("This email is already in use", {
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "email",
      },
    });
  }

  // Revisar si el username está en uso
  const foundUsername = await User.findOne({ username });

  if (foundUsername) {
    throw new GraphQLError("This username is already in use", {
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "username",
      },
    });
  }

  // Hashear el password
  const salt = await bcrypt.genSalt(10);
  input.password = await bcrypt.hash(password, salt);

  // Guardar en la base de datos
  try {
    const newUser = new User(input);
    await newUser.save();
    return newUser;
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Error saving the new user in the database", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

export const authUser = async (input: AuthInput) => {
  const { email, password } = input;

  console.log(email, password);

  return null;
};
