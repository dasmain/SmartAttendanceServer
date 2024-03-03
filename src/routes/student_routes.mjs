import express from "express";
import StudentController from "../controllers/student_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkStudentTokenMiddleware from "../middleware/check_student_token_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";

const router = express.Router();

const studentRoute = "/student";
// API routes
router.route(studentRoute + "/create").post(
  checkRequiredFieldsMiddleware([
    "name",
    "email",
    "password",
    "contactno",
    //   "studentID"
  ]),
  checkTokenMiddleware,
  StudentController.apiCreateStudentAccount
);

router
  .route(studentRoute + "/sign-in")
  .post(
    checkRequiredFieldsMiddleware(["email", "password"]),
    StudentController.apiSignInStudentAccount
  );

router
  .route(studentRoute + "/forgot-password")
  .post(
    checkRequiredFieldsMiddleware(["email"]),
    StudentController.apiForgotPassword
  );

router
  .route(studentRoute + "/reset-password")
  .post(
    checkRequiredFieldsMiddleware(["new_password"]),
    checkStudentTokenMiddleware,
    StudentController.apiResetStudentAccountPassword
  );

router
  .route(studentRoute + "/validate-reset-pass-token")
  .get(
    checkStudentTokenMiddleware,
    StudentController.apiGetStudentTokenValidation
  );

router
  .route(studentRoute + "/update/password")
  .post(
    checkRequiredFieldsMiddleware(["old_password", "new_password"]),
    checkStudentTokenMiddleware,
    StudentController.apiUpdateStudentAccountPassword
  );
router
  .route(studentRoute + "/edit/details")
  .post(checkTokenMiddleware, StudentController.apiUpdateStudentAccountDetails);

router
  .route(studentRoute + "/sign-out")
  .delete(
    checkStudentTokenMiddleware,
    StudentController.apiSignOutStudentAccount
  );

router
  .route(studentRoute + "/details")
  .get(
    checkStudentTokenMiddleware,
    StudentController.apiGetStudentAccountDetails
  );

router
  .route(studentRoute + "/alldetails")
  .get(checkTokenMiddleware, StudentController.apiGetAllStudentAccountDetails);

router
  .route(studentRoute + "/delete")
  .delete(checkTokenMiddleware, StudentController.apiDeleteStudentAccount);

router
  .route(studentRoute + "/detailsbyid")
  .get(checkTokenMiddleware, StudentController.apiGetStudentAccountDetailsByID);

router
  .route(studentRoute + "/updatebyid/password")
  .post(
    checkRequiredFieldsMiddleware(["new_password"]),
    checkTokenMiddleware,
    StudentController.apiUpdateStudentAccountPasswordByAdmin
  );

router
  .route(studentRoute + "/validate")
  .delete(checkTokenMiddleware, StudentController.apiValidateUser);

export default router;
