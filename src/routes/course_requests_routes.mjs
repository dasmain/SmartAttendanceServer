import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";
import CourseRequestController from "../controllers/course_requests_controller.mjs";
import checkStudentTokenMiddleware from "../middleware/check_student_token_middleware.mjs";
import checkFacultyTokenMiddleware from "../middleware/check_faculty_token_middleware.mjs";

const router = express.Router();

const courseRoute = "/creq";
//api routes
router
  .route(courseRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware(["courseId", "status"]),
    checkStudentTokenMiddleware,
    CourseRequestController.apiCreateCourseRequest
  );

router
  .route(courseRoute + "/update")
  .post(
    checkFacultyTokenMiddleware,
    CourseRequestController.apiUpdateCourseRequestDetails
  );

router
  .route(courseRoute + "/details")
  .get(
    checkFacultyTokenMiddleware,
    CourseRequestController.apiGetCourseRequestDetails
  );

router
  .route(courseRoute + "/alldetails")
  .get(
    checkFacultyTokenMiddleware,
    CourseRequestController.apiGetAllCourseRequestDetails
  );

router
  .route(courseRoute + "/delete")
  .delete(checkTokenMiddleware, CourseRequestController.apiDeleteCourseRequest);

router
  .route(courseRoute + "/detailsbystudent")
  .get(checkStudentTokenMiddleware, CourseRequestController.apiGetCourseRequestDetailsByStudent);

export default router;
