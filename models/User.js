import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validate } from "node-cron";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  email: {
    type: String,
    validator: validate.isEmail,
    required: true,
    unique: true,
  },

  status: {
    type: String,
    default: "not_verified",
  },

  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be at least 6 characters"],
  },

  followers: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  following: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
  ],

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next;
});

schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

schema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

schema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", schema);
