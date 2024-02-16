import express from "express";
import FacultyController from "../controllers/faculty_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkFacultyTokenMiddleware from "../middleware/check_faculty_token_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";

const router = express.Router();

const facultyRoute = "/faculty";
// API routes
router
  .route(facultyRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware([
      "name",
      "email",
      "password",
      "contactno",
    ]),
    checkTokenMiddleware,
    FacultyController.apiCreateFacultyAccount
  );

router
  .route(facultyRoute + "/sign-in")
  .post(
    checkRequiredFieldsMiddleware(["email", "password"]),
    FacultyController.apiSignInFacultyAccount
  );
  router
  .route(facultyRoute + "/forgot-password")
  .post(
    checkRequiredFieldsMiddleware(["email"]),
    FacultyController.apiFacultyForgotPassword
  );
router
  .route(facultyRoute + "/validate-reset-pass-token")
  .get(
    checkFacultyTokenMiddleware,
    FacultyController.apiGetFacultyTokenValidation
  );

router
  .route(facultyRoute + "/update/password")
  .post(
    checkRequiredFieldsMiddleware(["old_password", "new_password"]),
    checkFacultyTokenMiddleware,
    FacultyController.apiUpdateFacultyAccountPassword
  );

router
  .route(facultyRoute + "/edit/details")
  .post(checkTokenMiddleware, FacultyController.apiUpdateFacultyAccountDetails);

router
  .route(facultyRoute + "/sign-out")
  .delete(
    checkFacultyTokenMiddleware,
    FacultyController.apiSignOutFacultyAccount
  );

router
  .route(facultyRoute + "/details")
  .get(
    checkFacultyTokenMiddleware,
    FacultyController.apiGetFacultyAccountDetails
  );

router
  .route(facultyRoute + "/alldetails")
  .get(checkTokenMiddleware, FacultyController.apiGetAllFacultyAccountDetails);

router
  .route(facultyRoute + "/delete")
  .delete(checkTokenMiddleware, FacultyController.apiDeleteFacultyAccount);

router
  .route(facultyRoute + "/detailsbyid")
  .get(checkTokenMiddleware, FacultyController.apiGetFacultyAccountDetailsByID);

export default router;
