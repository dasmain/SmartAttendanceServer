import express from "express";
import AdminController from "../controllers/admin_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";

const router = express.Router();

const userRoute = "/admin";
//api routes
router
  .route(userRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware(["email", "password"]),
    checkTokenMiddleware,
    AdminController.apiCreateAdminAccount
  );

router
  .route(userRoute + "/sign-in")
  .post(
    checkRequiredFieldsMiddleware(["email", "password"]),
    AdminController.apiSignInAdminAccount
  );

router
  .route(userRoute + "/update/password")
  .post(
    checkRequiredFieldsMiddleware(["old_password", "new_password"]),
    checkTokenMiddleware,
    AdminController.apiUpdateAccountPassword
  );

// router
//   .route(userRoute + "/update")
//   .post(checkTokenMiddleware, AdminController.apiUpdateAccountDetails);

router
  .route(userRoute + "/sign-out")
  .delete(checkTokenMiddleware, AdminController.apiSignOutAdminAccount);

router
  .route(userRoute + "/details")
  .get(checkTokenMiddleware, AdminController.apiGetAdminAccountDetails);

router
  .route(userRoute + "/validate")
  .get(checkTokenMiddleware, AdminController.apiValidateUser);

export default router;
