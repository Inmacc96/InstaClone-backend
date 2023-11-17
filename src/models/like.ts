import { Schema, model } from "mongoose";

const LikeSchema = new Schema({
  idPost: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Post",
  },
  idUser: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Like", LikeSchema);
