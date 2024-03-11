import AttendanceService from "../services/attendance_service.mjs";
import CourseService from "../services/course_service.mjs";
import FacultyService from "../services/faculty_service.mjs";
import StudentService from "../services/student_service.mjs";

export default class AttendanceController {
  static async apiCreateAttendance(req, res, next) {
    try {
      const { courseId, attendance, attendance_hours, topics } = req.body;

      const serviceResponse = await AttendanceService.addAttendance(
        courseId,
        attendance,
        attendance_hours,
        topics
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Attendance created successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetAttendanceDetails(req, res, next) {
    try {
      const course_id = req.query._id;

      if (!course_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "courseId parameter is missing",
        });
      }

      const serviceResponse = await AttendanceService.getAttendanceByCourse(
        course_id
      );

      for (let i = 0; i < serviceResponse.length; i++) {
        const course = serviceResponse[i];
        if (course.courseId != null) {
          const forCourseResponse = await CourseService.getCourseByID(
            course.courseId
          );

          course.courseId = forCourseResponse;
        }

        for (let j = 0; j < course.attendance.length; j++) {
          const attendance = course.attendance[j];
          const studentData = await StudentService.getStudentAccountDetails(
            attendance.studentId
          );
          attendance.studentId = studentData;
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

  static async apiGetAttendanceDetailsForDate(req, res, next) {
    try {
      const course_id = req.query._id;
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);

      if (!course_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "courseId parameter is missing",
        });
      }

      const serviceResponse =
        await AttendanceService.getAttendanceByCourseAndDate(course_id, date);

      if (typeof serviceResponse != "string") {
        for (let i = 0; i < serviceResponse.length; i++) {
          const course = serviceResponse[i];
          if (course.courseId != null) {
            const forCourseResponse = await CourseService.getCourseByID(
              course.courseId
            );

            course.courseId = forCourseResponse;
          }

          for (let j = 0; j < course.attendance.length; j++) {
            const attendance = course.attendance[j];
            const studentData = await StudentService.getStudentAccountDetails(
              attendance.studentId
            );
            attendance.studentId = studentData;
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

  static async apiGetStudentList(req, res, next) {
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
      if (serviceResponse.studentsEnrolled != null) {
        for (let i = 0; i < serviceResponse.studentsEnrolled.length; i++) {
          const forFacultyResponse = await StudentService.getStudentByID(
            serviceResponse.studentsEnrolled[i]
          );

          serviceResponse.studentsEnrolled[i] = forFacultyResponse;
        }
      }

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

  static async apiUpdateAttendance(req, res, next) {
    try {
      const { courseId, attendance, attendance_hours, topics } = req.body;

      const serviceResponse = await AttendanceService.updateAttendanceDetails(
        courseId,
        attendance,
        attendance_hours,
        topics
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Attendance updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
