import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkFacultyTokenMiddleware from "../middleware/check_faculty_token_middleware.mjs";
import AttendanceController from "../controllers/attendance_controller.mjs";
import checkStudentTokenMiddleware from "../middleware/check_student_token_middleware.mjs";

const router = express.Router();

const userRoute = "/attendance";
//api routes
router
  .route(userRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware(["courseId", "attendance"]),
    checkFacultyTokenMiddleware,
    AttendanceController.apiCreateAttendance
  );

router
  .route(userRoute + "/details")
  .get(checkStudentTokenMiddleware, AttendanceController.apiGetAttendanceDetails);

export default router;
