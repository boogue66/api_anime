import { Router } from "express";
import * as userCtrl from "../controllers/user.controller.js";
import { createUserValidation } from "../validators/user.validators.js";

const router = Router();

router
  .route('/')
  .get(userCtrl.getAllUsers)
  .post(createUserValidation, userCtrl.createUser);

router
  .route('/:id')
  .get(userCtrl.getUser)
  .patch(userCtrl.updateUser)
  .delete(userCtrl.deleteUser);

router
  .route('/check/:email')
  .get(userCtrl.getUserEmail);

export default router;
