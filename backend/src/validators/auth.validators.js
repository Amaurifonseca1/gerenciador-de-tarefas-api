import { body } from "express-validator";

export const registerValidators = [
  body("email").trim().isEmail().withMessage("Informe um e-mail válido.").normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 6, max: 128 })
    .withMessage("A senha deve ter entre 6 e 128 caracteres."),
];

export const loginValidators = [
  body("email").trim().notEmpty().withMessage("O e-mail é obrigatório.").isEmail().withMessage("Informe um e-mail válido."),
  body("password").isString().notEmpty().withMessage("A senha é obrigatória."),
];
