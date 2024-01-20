import { Schema, model } from "mongoose";
import { hadleSaveError, addUpdateSettings } from "./hooks.js";
import Joi from "joi";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
    },
    avatarURL: { type: String },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", hadleSaveError);
userSchema.pre("findOneAndUpdate", addUpdateSettings);
userSchema.post("findOneAndUpdate", hadleSaveError);

export const userSignupSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({ "any.required": "missing required email field" }),
  password: Joi.string()
    .min(7)
    .required()
    .messages({ "any.required": "missing required password field" }),
});

export const userSigninSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({ "any.required": "missing required email field" }),
  password: Joi.string()
    .min(7)
    .required()
    .messages({ "any.required": "missing required password field" }),
});

export const subsUpdateSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required()
    .messages({ "any.required": "missing required subscription field" }),
});

const User = model("user", userSchema);

export default User;
