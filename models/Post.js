import mongoose from "mongoose";

const schema = new mongoose.Schema({
  post: {
    type: String,
    required: true,
  },

  file: {
    public_id: {
      type: String,
    },

    secure_url: {
      type: String,
    },
  },

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Posts = mongoose.model("Post", schema);
