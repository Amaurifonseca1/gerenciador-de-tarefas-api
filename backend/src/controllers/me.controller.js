import { sendSuccess } from "../utils/response.js";

export function me(req, res, next) {
  try {
    return sendSuccess(res, { user: req.user });
  } catch (err) {
    return next(err);
  }
}
