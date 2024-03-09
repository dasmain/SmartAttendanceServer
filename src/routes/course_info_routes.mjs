import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkFacultyTokenMiddleware from "../middleware/check_faculty_token_middleware.mjs";
import checkStudentTokenMiddleware from "../middleware/check_student_token_middleware.mjs";
import checkParentTokenMiddleware from "../middleware/check_parent_token_middleware.mjs";
import CourseInfoController from "../controllers/course_info_controller.mjs";

const router = express.Router();

const userRoute = "/course-info";
//api routes

// router
//   .route(userRoute + "/create")
//   .post(
//     checkRequiredFieldsMiddleware(["courseId", "studentId", "total_hours", "present_hours", "absent_hours"]),
//     checkFacultyTokenMiddleware,
//     CourseInfoController.apiCreateCourseInfo
//   );

router
  .route(userRoute + "/details")
  .get(
    checkStudentTokenMiddleware,
    CourseInfoController.apiGetCourseInfoDetails
  );

router
  .route(userRoute + "/details-by-course")
  .get(
    checkStudentTokenMiddleware,
    CourseInfoController.apiGetCourseInfoDetailsByCourse
  );

router
  .route(userRoute + "/details-by-student")
  .get(
    checkStudentTokenMiddleware,
    CourseInfoController.apiGetCourseInfoDetailsByStudent
  );

  router
  .route(userRoute + "/parent-details")
  .get(
    checkParentTokenMiddleware,
    CourseInfoController.apiGetCourseInfoDetailsByStudentForParent
  );

export default router;
