import express from "express";
import ParentController from "../controllers/parent_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkParentTokenMiddleware from "../middleware/check_parent_token_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";

const router = express.Router();

const parentRoute = "/parent";
// API routes
router.route(parentRoute + "/create").post(
  checkRequiredFieldsMiddleware([
    "username",
    "email",
    "password",
    "contactno",
    //   "studentID"
  ]),
  checkTokenMiddleware,
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
    checkParentTokenMiddleware,
    ParentController.apiUpdateParentAccountPassword
  );

router
  .route(parentRoute + "/edit/details")
  .post(checkTokenMiddleware, ParentController.apiUpdateParentAccountDetails);

router
  .route(parentRoute + "/sign-out")
  .delete(checkParentTokenMiddleware, ParentController.apiSignOutParentAccount);

router
  .route(parentRoute + "/details")
  .get(checkParentTokenMiddleware, ParentController.apiGetParentAccountDetails);

  router
  .route(parentRoute + "/alldetails")
  .get(checkTokenMiddleware, ParentController.apiGetAllParentAccountDetails);

  router
  .route(parentRoute + "/delete")
  .delete(checkTokenMiddleware, ParentController.apiDeleteParentAccount);

export default router;
