import express from "express";
import StudentController from "../controllers/student_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";

const router = express.Router();

const studentRoute = "/student";
// API routes
router
  .route(studentRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware([
      "username",
      "email",
      "password",
      "contactno",
    //   "studentID"
    ]),
    StudentController.apiCreateStudentAccount
  );

router
  .route(studentRoute + "/sign-in")
  .post(
    checkRequiredFieldsMiddleware(["email", "password"]),
    StudentController.apiSignInStudentAccount
  );

router
  .route(studentRoute + "/update/password")
  .post(
    checkRequiredFieldsMiddleware(["old_password", "new_password"]),
    checkTokenMiddleware,
    StudentController.apiUpdateStudentAccountPassword
  );

router
  .route(studentRoute + "/edit/details")
  .post(checkTokenMiddleware, StudentController.apiUpdateStudentAccountDetails);

router
  .route(studentRoute + "/sign-out")
  .delete(checkTokenMiddleware, StudentController.apiSignOutStudentAccount);

router
  .route(studentRoute + "/details")
  .get(checkTokenMiddleware, StudentController.apiGetStudentAccountDetails);

export default router;
