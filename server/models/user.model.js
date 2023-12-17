import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: "string",
      required: [true, "full name is Required"],
      minLength: [5, "Name must be atleast 5 Character"],
      maxLength: [50, "Name Should be Less the  50  Character"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: "string",
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [],
    },
    password: {
      type: "string",
      required: [true, "Password is required"],
      minLength: [8, "Password must be atleast 8 Characters"],
      select: false,
    },
    avtar: {
      public_id: {
        type: "String",
      },
      secure_url: {
        type: "String",
      },
    },
    role: {
      type: "String",
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamp: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hast(this.password, 10);
});

userSchema.methods = {
  generateJWTToken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },
  comparePassword: async function (plaintextPassword) {
    return await bcrypt.compare(plaintextPassword, this.password);
  },
};
const user = model("user", userSchema);

export default user;
