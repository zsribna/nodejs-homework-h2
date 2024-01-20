import { HttpError } from "../helpers/index.js";

const isFileUploaded = (req, res, next) => {
  const { file } = req;
  console.log(file);
  if (!file) {
    return next(HttpError(400, "No file uploaded"));
  }
  next();
};
export default isFileUploaded;
