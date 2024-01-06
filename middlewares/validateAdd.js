import { HttpError } from "../helpers/index.js";
import { contactAddSchema } from "../schemas/contact-schemas.js";

const validateAdd = (req, res, next)=> {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
        return next(HttpError(400, error.message));
    }
    next();
}

export default validateAdd;