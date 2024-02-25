import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";
import LeaveController from "../controllers/leave_controller.mjs";
import checkStudentTokenMiddleware from "../middleware/check_student_token_middleware.mjs";
import checkFacultyTokenMiddleware from "../middleware/check_faculty_token_middleware.mjs";

const router = express.Router();

const courseRoute = "/leave";
//api routes
router
  .route(courseRoute + "/create")
  .post(
    // checkRequiredFieldsMiddleware([
    //   "studentId",
    //   "subject",
    //   "fromDate",
    //   "toDate",
    //   "reason",
    // ]),
    checkStudentTokenMiddleware,
    LeaveController.apiCreateLeave
  );

router
  .route(courseRoute + "/update")
  .post(checkFacultyTokenMiddleware, LeaveController.apiUpdateLeaveDetails);

router
  .route(courseRoute + "/details")
  .get(checkFacultyTokenMiddleware, LeaveController.apiGetLeaveDetails);

router
  .route(courseRoute + "/alldetails")
  .get(checkFacultyTokenMiddleware, LeaveController.apiGetAllLeaveDetails);

router
  .route(courseRoute + "/delete")
  .delete(checkTokenMiddleware, LeaveController.apiDeleteLeave);

router
  .route(courseRoute + "/details-by-student")
  .get(
    checkStudentTokenMiddleware,
    LeaveController.apiGetLeaveDetailsByStudent
  );

export default router;
