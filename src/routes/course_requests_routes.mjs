import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";
import CourseRequestController from "../controllers/course_requests_controller.mjs";

const router = express.Router();

const courseRoute = "/coursereq";
//api routes
router
  .route(courseRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware([
      "courseId",
      "studentId",
      "status",
    ]),
    checkTokenMiddleware,
    CourseRequestController.apiCreateCourseRequest
  );

router
  .route(courseRoute + "/update")
  .post(checkTokenMiddleware, CourseRequestController.apiUpdateCourseRequestDetails);

router
  .route(courseRoute + "/details")
  .get(checkTokenMiddleware, CourseRequestController.apiGetCourseRequestDetails);

router
  .route(courseRoute + "/alldetails")
  .get(checkTokenMiddleware, CourseRequestController.apiGetAllCourseRequestDetails);

router
  .route(courseRoute + "/delete")
  .delete(checkTokenMiddleware, CourseRequestController.apiDeleteCourseRequest);

export default router;
