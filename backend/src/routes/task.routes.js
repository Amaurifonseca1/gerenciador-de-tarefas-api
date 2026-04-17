import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { handleValidation } from "../middleware/handleValidation.js";
import {
  idParamValidator,
  listTaskValidators,
  storeTaskValidators,
  updateTaskValidators,
} from "../validators/task.validators.js";

const router = Router();

router.use(requireAuth);

router.get("/", listTaskValidators, handleValidation, taskController.index);
router.get("/:id", idParamValidator, handleValidation, taskController.show);
router.post("/", storeTaskValidators, handleValidation, taskController.store);
router.put("/:id", updateTaskValidators, handleValidation, taskController.update);
router.delete("/:id", idParamValidator, handleValidation, taskController.destroy);

export default router;
