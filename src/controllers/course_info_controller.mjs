import AttendanceService from "../services/attendance_service.mjs";
import CourseInfoService from "../services/course_info_service.mjs";
import CourseService from "../services/course_service.mjs";
import FacultyService from "../services/faculty_service.mjs";
import StudentService from "../services/student_service.mjs";

export default class CourseInfoController {
  static async apiCreateCourseInfo(req, res, next) {
    try {
      const { courseId, studentId, total_hours, present_hours, absent_hours } =
        req.body;

      const serviceResponse = await CourseInfoService.addCourseInfo(
        courseId,
        studentId,
        total_hours,
        present_hours,
        absent_hours
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Course Info created successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetCourseInfoDetails(req, res, next) {
    try {
      const course_id = req.query.course_id;
      const student_id = req.query.student_id;

      if (!course_id || !student_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "course_id or student_id parameter is missing",
        });
      }

      const serviceResponse =
        await CourseInfoService.getCourseInfoByCourseAndStudent(
          course_id,
          student_id
        );

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
          message: "Attendance details fetched successfully",
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

  static async apiGetCourseInfoDetailsByCourse(req, res, next) {
    try {
      const course_id = req.query._id;

      if (!course_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await CourseInfoService.getCourseInfoByCourse(
        course_id
      );

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
          message: "Attendance details fetched successfully",
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

  static async apiGetCourseInfoDetailsByStudent(req, res, next) {
    try {
      const student_id = req.query._id;

      if (!student_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await CourseInfoService.getCourseInfoByStudent(
        student_id
      );

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
          message: "Attendance details fetched successfully",
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
}
