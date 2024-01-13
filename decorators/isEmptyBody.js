import { HttpError } from "../helpers/index.js";

const isEmptyBody = (message) => {
  const func = (req, res, next) => {
    const { length } = Object.keys(req.body);
    if (!length) {
      return next(HttpError(400, message));
    }
    next();
  };
  return func;
};
export default isEmptyBody;
