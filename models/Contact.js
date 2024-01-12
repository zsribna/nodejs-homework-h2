import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, addUpdateSettings } from "./hooks.js";

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    }, { versionKey: false, timestamps: true });

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", addUpdateSettings);

contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": `missing required name field`
    }),
    email: Joi.string().required().messages({
        "any.required": `missing required email field`
    }),
    phone: Joi.string().required().messages({
        "any.required": `missing required phone field`
    }),
    
})

export const contactUpdateSchema = Joi.object({
   name : Joi.string(),
   email: Joi.string(),
   phone: Joi.string(),
})

export const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
        "any.required": `missing field favorite`
    }),
})

export default Contact;