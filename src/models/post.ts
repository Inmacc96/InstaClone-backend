import { Schema, model } from "mongoose";

const PostSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  file: {
    type: String,
    trim: true,
    require: true,
  },
  typeFile: {
    type: String,
    trim: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Post", PostSchema);
