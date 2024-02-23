import CourseService from "../services/course_service.mjs";
import FacultyService from "../services/faculty_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class CourseController {
  static async apiCreateCourse(req, res, next) {
    try {
      const { courseCode, courseName, courseCredHrs } = req.body;

      const serviceResponse = await CourseService.addCourse(
        courseCode,
        courseName,
        courseCredHrs,
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Course created successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetCourseDetails(req, res, next) {
    try {
      const course_id = req.query._id;

      if (!course_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "course_id parameter is missing",
        });
      }

      const serviceResponse = await CourseService.getCourseByID(course_id);

      if (serviceResponse.courseTeacher != null) {
        const forFacultyResponse =
          await FacultyService.getFacultyAccountDetails(
            serviceResponse.courseTeacher
          );

        serviceResponse.courseTeacher = forFacultyResponse;
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
          message: "Course details fetched successfully",
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

  static async apiGetCourseDetailsByTeacher(req, res, next) {
    try {
      const courseTeacher = req.query._id;

      if (!courseTeacher) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await CourseService.getCourseByTeacher(courseTeacher);

      if (serviceResponse.courseTeacher != null) {
        const forFacultyResponse =
          await FacultyService.getFacultyAccountDetails(
            serviceResponse.courseTeacher
          );

        serviceResponse.courseTeacher = forFacultyResponse;
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
          message: "Course details fetched successfully",
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

  static async apiUpdateCourseDetails(req, res, next) {
    try {
      const course_id = req.query._id;
      if (!course_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "course_id parameter is missing",
        });
      }

      const { courseCode, courseName, courseCredHrs, studentsEnrolled, courseTeacher } = req.body;
      const serviceResponse = await CourseService.updateCourseDetails(
        course_id,
        courseCode,
        courseName,
        courseCredHrs,
        studentsEnrolled,
        courseTeacher
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

  static async apiGetAllCourseDetails(req, res, next) {
    try {
      const serviceResponse = await CourseService.getAllCourseForAdmin();
      for (let i = 0; i < serviceResponse.length; i++) {
        const course = serviceResponse[i];
        if (course.courseTeacher != null) {
          const forFacultyResponse =
            await FacultyService.getFacultyAccountDetails(course.courseTeacher);
          course.courseTeacher = forFacultyResponse;
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
          message: "Course details fetched successfully",
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

  static async apiDeleteCourse(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await CourseService.deleteCourse(_id);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to delete Course",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Course deleted successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
