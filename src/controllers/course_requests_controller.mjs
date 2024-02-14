import CourseRequestsService from "../services/course_req_service.mjs";
import CourseService from "../services/course_service.mjs";
import FacultyService from "../services/faculty_service.mjs";
import StudentService from "../services/student_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class CourseRequestController {
  static async apiCreateCourseRequest(req, res, next) {
    try {
      const { courseId, studentId, status } = req.body;

      const serviceResponse = await CourseRequestsService.addCourseRequest(
        courseId,
        studentId,
        status
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Course Request created successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetCourseRequestDetails(req, res, next) {
    try {
      const _id = req.query._id;

      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await CourseRequestsService.getCourseRequestByID(
        _id
      );

      if (serviceResponse.studentId != null) {
        const forStudentResponse =
          await StudentService.getStudentAccountDetails(
            serviceResponse.studentId
          );

        serviceResponse.studentId = forStudentResponse.user;
      }

      if (serviceResponse.courseId != null) {
        const forCourseResponse = await CourseService.getCourseByID(
          serviceResponse.courseId
        );

        serviceResponse.courseId = forCourseResponse;
      }

      if (typeof serviceResponse === "string") {
        res.status(200).json({
          success: false,
          data: {},
          message: serviceResponse,
        });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Course Request details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        data: {},
        message: e.message,
      });
    }
  }

  static async apiUpdateCourseRequestDetails(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const { courseId, studentId, status } = req.body;
      const serviceResponse = await CourseRequestsService.updateCourseDetails(
        courseId,
        studentId,
        status
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Course details updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetAllCourseRequestDetails(req, res, next) {
    try {
      const serviceResponse =
        await CourseRequestsService.getAllCourseRequestForAdmin();
      for (let i = 0; i < serviceResponse.length; i++) {
        const course = serviceResponse[i];
        if (course.courseId != null) {
          const forCourseResponse = await CourseService.getCourseByID(
            course.courseId
          );

          course.courseId = forCourseResponse;
        }
        if (course.studentId != null) {
          const forStudentResponse = await StudentService.getStudentAccountDetails(
            course.studentId
          );

          course.courseId = forStudentResponse;
        }
      }

      if (typeof serviceResponse === "string") {
        res.status(200).json({
          success: false,
          data: {},
          message: serviceResponse,
        });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Course Request details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        data: {},
        message: e.message,
      });
    }
  }

  static async apiDeleteCourseRequest(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await CourseRequestsService.deleteCourseRequest(_id);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to delete Course Request",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Course Request deleted successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
