import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { handleValidation } from "../middleware/handleValidation.js";
import { loginValidators, registerValidators } from "../validators/auth.validators.js";

const router = Router();

router.post("/register", registerValidators, handleValidation, authController.register);
router.post("/login", loginValidators, handleValidation, authController.login);

export default router;
