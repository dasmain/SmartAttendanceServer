import AttendanceService from "../services/attendance_service.mjs";
import CourseInfoService from "../services/course_info_service.mjs";
import CourseService from "../services/course_service.mjs";
import FacultyService from "../services/faculty_service.mjs";
import ParentService from "../services/parent_service.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import TokenUtil from "../utility/token_util.mjs";

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
          message: "Course Info details fetched successfully",
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

      const attendanceResponse = await AttendanceService.getAttendanceByCourse(
        course_id
      );

      attendanceResponse.forEach((attendance) => {
        const { date, topics } = attendance;
        const courseIndex = serviceResponse.findIndex(
          (course) => course.courseId === attendance.courseId
        );

        if (courseIndex !== -1) {
          if (!serviceResponse[courseIndex].attendance) {
            serviceResponse[courseIndex].attendance = [];
          }
          serviceResponse[courseIndex].attendance.push({ date, topics });
        }
      });

      for (let i = 0; i < serviceResponse.length; i++) {
        const course = serviceResponse[i];
        if (course.courseId != null) {
          const forCourseResponse = await CourseService.getCourseByID(
            course.courseId
          );

          if (typeof forCourseResponse === "string") {
            serviceResponse.splice(i, 1);
            i--;
            continue;
          }

          course.courseId = forCourseResponse;

          if (course.courseId && course.courseId.courseTeacher != null) {
            const forFacultyResponse =
              await FacultyService.getFacultyAccountDetails(
                course.courseId.courseTeacher
              );
            course.courseId.courseTeacher = forFacultyResponse.name;
          }
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
          message: "Course Info details fetched successfully",
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
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getStudentDataFromToken(token);
      const student_id = tokenDetails.user_id.toString();

      const serviceResponse = await CourseInfoService.getCourseInfoByStudent(
        student_id
      );

      for (let i = 0; i < serviceResponse.length; i++) {
        const attendanceResponse =
          await AttendanceService.getAttendanceByCourse(
            serviceResponse[i].courseId
          );

        attendanceResponse.forEach((attendance) => {
          const { date, topics } = attendance;
          const courseIndex = serviceResponse.findIndex(
            (course) => course.courseId === attendance.courseId
          );

          if (courseIndex !== -1) {
            if (!serviceResponse[courseIndex].attendance) {
              serviceResponse[courseIndex].attendance = [];
            }
            serviceResponse[courseIndex].attendance.push({ date, topics });
          }
        });
      }

      for (let i = 0; i < serviceResponse.length; i++) {
        const course = serviceResponse[i];
        if (course.courseId != null) {
          const forCourseResponse = await CourseService.getCourseByID(
            course.courseId
          );

          if (typeof forCourseResponse === "string") {
            serviceResponse.splice(i, 1);
            i--;
            continue;
          }

          course.courseId = forCourseResponse;

          if (course.courseId && course.courseId.courseTeacher != null) {
            const forFacultyResponse =
              await FacultyService.getFacultyAccountDetails(
                course.courseId.courseTeacher
              );
            course.courseId.courseTeacher = forFacultyResponse.name;
          }
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
          message: "Course Info details fetched successfully",
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

  static async apiGetCourseInfoDetailsByStudentForParent(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getParentDataFromToken(token);
      const parent_id = tokenDetails.user_id.toString();

      const parentResponse = await ParentService.getParentAccountDetails(
        parent_id
      );

      const serviceResponse = await CourseInfoService.getCourseInfoByStudent(
        parentResponse.studentID
      );

      for (let i = 0; i < serviceResponse.length; i++) {
        const attendanceResponse =
          await AttendanceService.getAttendanceByCourse(
            serviceResponse[i].courseId
          );

        attendanceResponse.forEach((attendance) => {
          const { date, topics } = attendance;
          const courseIndex = serviceResponse.findIndex(
            (course) => course.courseId === attendance.courseId
          );

          if (courseIndex !== -1) {
            if (!serviceResponse[courseIndex].attendance) {
              serviceResponse[courseIndex].attendance = [];
            }
            serviceResponse[courseIndex].attendance.push({ date, topics });
          }
        });
      }

      for (let i = 0; i < serviceResponse.length; i++) {
        const course = serviceResponse[i];
        if (course.courseId != null) {
          const forCourseResponse = await CourseService.getCourseByID(
            course.courseId
          );

          if (typeof forCourseResponse === "string") {
            serviceResponse.splice(i, 1);
            i--;
            continue;
          }

          course.courseId = forCourseResponse;

          if (course.courseId && course.courseId.courseTeacher != null) {
            const forFacultyResponse =
              await FacultyService.getFacultyAccountDetails(
                course.courseId.courseTeacher
              );
            course.courseId.courseTeacher = forFacultyResponse.name;
          }
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
          message: "Course Info details fetched successfully",
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
