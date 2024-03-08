import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";
import checkFacultyTokenMiddleware from "../middleware/check_faculty_token_middleware.mjs";
import CourseController from "../controllers/course_controller.mjs";

const router = express.Router();

const courseRoute = "/course";
//api routes
router
  .route(courseRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware([
      "courseCode",
      "courseName",
      "courseCredHrs",
    ]),
    checkTokenMiddleware,
    CourseController.apiCreateCourse
  );

router
  .route(courseRoute + "/update")
  .post(checkTokenMiddleware, CourseController.apiUpdateCourseDetails);

router
  .route(courseRoute + "/update-by-advisor")
  .post(checkFacultyTokenMiddleware, CourseController.apiUpdateCourseTeacher);

router
  .route(courseRoute + "/details")
  .get(checkTokenMiddleware, CourseController.apiGetCourseDetails);

router
  .route(courseRoute + "/alldetails")
  .get(CourseController.apiGetAllCourseDetails);

router
  .route(courseRoute + "/delete")
  .delete(checkTokenMiddleware, CourseController.apiDeleteCourse);

router
  .route(courseRoute + "/details-by-teacher")
  .get(
    checkFacultyTokenMiddleware,
    CourseController.apiGetCourseDetailsByTeacher
  );

router
  .route(courseRoute + "/details-by-teacher-token")
  .get(
    checkFacultyTokenMiddleware,
    CourseController.apiGetCourseDetailsByTeacherToken
  );

export default router;
