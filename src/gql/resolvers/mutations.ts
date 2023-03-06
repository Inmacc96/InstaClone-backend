import { GraphQLError } from "graphql";
import User from "../../models/user";
import { MutationResolvers } from "../../types/graphql";

const mutations: MutationResolvers = {
  // User
  createUser: async (_, { input }) => {
    const { email, username } = input;

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

    // TODO: Hashear el password

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
  },
};

export default mutations;
