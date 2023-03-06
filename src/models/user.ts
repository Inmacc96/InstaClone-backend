import { Schema, model } from "mongoose";

interface User {
  name: String;
  username: String;
  email: String;
  avatar?: String;
  siteWeb?: String;
  description?: String;
  password: String;
  createdAt?: String;
}

const UserSchema = new Schema<User>({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  username: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  avatar: {
    type: String,
    trim: true,
  },
  siteWeb: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model<User>("User", UserSchema);
