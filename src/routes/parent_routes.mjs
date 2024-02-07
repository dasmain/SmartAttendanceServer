import express from "express";
import ParentController from "../controllers/parent_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";

const router = express.Router();

const parentRoute = "/parent";
// API routes
router
  .route(parentRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware([
      "username",
      "email",
      "password",
      "contactno",
    //   "studentID"
    ]),
    ParentController.apiCreateParentAccount
  );

router
  .route(parentRoute + "/sign-in")
  .post(
    checkRequiredFieldsMiddleware(["email", "password"]),
    ParentController.apiSignInParentAccount
  );

router
  .route(parentRoute + "/update/password")
  .post(
    checkRequiredFieldsMiddleware(["old_password", "new_password"]),
    checkTokenMiddleware,
    ParentController.apiUpdateParentAccountPassword
  );

router
  .route(parentRoute + "/edit/details")
  .post(checkTokenMiddleware, ParentController.apiUpdateParentAccountDetails);

router
  .route(parentRoute + "/sign-out")
  .delete(checkTokenMiddleware, ParentController.apiSignOutParentAccount);

router
  .route(parentRoute + "/details")
  .get(checkTokenMiddleware, ParentController.apiGetParentAccountDetails);

export default router;
