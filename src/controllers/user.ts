import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { GraphQLError } from "graphql";
import { createToken } from "../helpers";
import User from "../models/user";
import { Context } from "../types/Context";
import { User as UserType, UserUpdateInput } from "../types/graphql";
import {
  UserInput,
  AuthInput,
  QueryGetUserArgs,
  QueryGenerateUploadUrlArgs,
} from "../types/graphql";
dotenv.config({ path: ".env" });

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
  const hashedPassword = await bcrypt.hash(password, salt);

  // Guardar en la base de datos
  try {
    const newUser = new User({ ...input, password: hashedPassword });
    await newUser.save();
    return newUser;
  } catch (err) {
    /*   console.log(err); */
    throw new GraphQLError("Error saving the new user in the database", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

export const authUser = async (input: AuthInput) => {
  const { email, password } = input;

  // Comprobar que el usuario existe
  const foundUser = await User.findOne({ email });

  // Comprobar que la contraseña es correcta
  const isCorrectPassword =
    !!foundUser && (await bcrypt.compare(password, foundUser.password));

  if (!foundUser || !isCorrectPassword) {
    throw new GraphQLError("Wrong credentials", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }
  // Crear el token
  const token = process.env.JWT_SECRET_KEY
    ? createToken(foundUser, process.env.JWT_SECRET_KEY, "24h")
    : null;

  return { token };
};

export const getUser = async ({ id, username }: QueryGetUserArgs) => {
  let user = null;

  if (id) user = await User.findById(id);
  if (username) user = await User.findOne({ username });

  if (!user) {
    throw new GraphQLError("User doesn't exist", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  return user;
};

export const generateUploadUrl = (
  { folder }: QueryGenerateUploadUrlArgs,
  context: Context
) => {
  const { currentUser } = context;
  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  const { id } = currentUser;
  const timestamp = Math.round(new Date().getTime() / 1000);

  const uploadParams = {
    folder: `instaclone/${folder}`,
    allowed_formats: ["png", "jpeg"],
    public_id: id,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    uploadParams,
    process.env.CLOUDINARY_API_SECRET!
  );

  return { signature, timestamp };
};

export const updateAvatar = async (urlImage: string, context: Context) => {
  const { currentUser } = context;
  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  const { id } = currentUser;

  // Comprobar que el usuario existe
  let user = (await User.findById(id)) as UserType | null;
  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  // Obtener el usuario autenticado y actualizar el valor avatar
  user = (await User.findByIdAndUpdate(
    id,
    { avatar: urlImage },
    { new: true }
  )) as UserType;

  return user;
};

export const deleteAvatar = async (context: Context) => {
  const { currentUser } = context;
  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  const { id } = currentUser;

  // Comprobar que el usuario existe
  let user = (await User.findById(id)) as UserType | null;
  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  // Obtener el usuario autenticado y actualizar el valor avatar
  user = (await User.findByIdAndUpdate(
    id,
    { $unset: { avatar: 1 } },
    { new: true }
  )) as UserType;

  return user;
};

export const updateUser = async (input: UserUpdateInput, context: Context) => {
  const { currentUser } = context;

  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  const { id } = currentUser;

  // Comprobar que el usuario existe
  let user = (await User.findById(id)) as UserType | null;
  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  // Si cambia la contraseña
  if (input.oldPassword && input.newPassword) {
    // Comprobar que la contraseña actual es correcta
    const isCorrectPassword = await bcrypt.compare(
      input.oldPassword,
      user.password
    );
    if (!isCorrectPassword) {
      throw new GraphQLError("Wrong password", {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    }
    // Actualizar la nueva contraseña encriptada
    const salt = await bcrypt.genSaltSync(10);
    const hashedNewPassword = await bcrypt.hash(input.newPassword, salt);

    user = (await User.findByIdAndUpdate(
      id,
      { password: hashedNewPassword },
      { new: true }
    )) as UserType;
  } else {
    // Cambia cualquier otro valor
    user = (await User.findByIdAndUpdate(id, input, { new: true })) as UserType;
  }

  return user;
};
