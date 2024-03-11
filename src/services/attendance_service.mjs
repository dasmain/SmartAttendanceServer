import AttendanceDAO from "../data/attendance_dao.mjs";
import CourseInfoService from "./course_info_service.mjs";

export default class AttendanceService {
  static async connectDatabase(client) {
    try {
      await AttendanceDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addAttendance(courseId, attendance, attendance_hours, topics) {
    try {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);

      const existingUser = await AttendanceDAO.getAttendanceByCourseAndDate(
        courseId,
        date
      );
      if (existingUser) {
        return "Attendance for this day already exists!";
      }

      const createdOn = new Date();
      const deletedOn = null;

      const userDocument = {
        courseId: courseId,
        date: date,
        attendance_hours: attendance_hours,
        topics: topics,
        attendance: attendance.map((student) => ({
          studentId: student.studentId,
          status: student.status,
        })),
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedUserId = await AttendanceDAO.addAttendanceToDB(userDocument);

      for (let i = 0; i < attendance.length; i++) {
        const courseinfo =
          await CourseInfoService.getCourseInfoByCourseAndStudent(
            courseId,
            attendance[i].studentId
          );

        if (typeof courseinfo === "string") {
          continue;
        }

        if (attendance[i].status == "present") {
          const present_hours = courseinfo.present_hours + attendance_hours;
          const total_hours = present_hours + courseinfo.absent_hours;
          await CourseInfoService.updateCourseInfoDetails(
            courseId,
            attendance[i].studentId,
            total_hours,
            present_hours,
            courseinfo.absent_hours
          );
        } else if (attendance[i].status == "absent") {
          const absent_hours = courseinfo.absent_hours + attendance_hours;
          const total_hours = courseinfo.present_hours + absent_hours;

          await CourseInfoService.updateCourseInfoDetails(
            courseId,
            attendance[i].studentId,
            total_hours,
            courseinfo.present_hours,
            absent_hours
          );
        }
      }

      return { _id: addedUserId };
    } catch (e) {
      return e.message;
    }
  }

  static async getAttendanceByCourse(courseId) {
    try {
      const existingCourse = await AttendanceDAO.getAttendanceByCourse(
        courseId
      );
      if (!existingCourse) {
        return "No attendance found for this courseId";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getAttendanceByCourseAndDate(courseId, date) {
    try {
      const existingCourse = await AttendanceDAO.getAttendanceByCourseAndDate(
        courseId, date
      );
      if (!existingCourse) {
        return "No attendance found for this courseId";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateAttendanceDetails(
    courseId,
    attendance,
    attendance_hours,
    topics
  ) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    try {
      const existingCourse = await AttendanceDAO.getAttendanceByCourseAndDate(
        courseId,
        date
      );
      if (!existingCourse) {
        return "No attendance found for this date and course";
      }

      for (let i = 0; i < attendance.length; i++) {
        const courseinfo =
          await CourseInfoService.getCourseInfoByCourseAndStudent(
            courseId,
            attendance[i].studentId
          );

        if (typeof courseinfo === "string") {
          continue;
        }

        if (existingCourse.attendance[i].status == "present") {
          const present_hours =
            courseinfo.present_hours - existingCourse.attendance_hours;

          if (attendance[i].status == "present") {
            const new_present_hours = present_hours + attendance_hours;
            const new_total_hours = new_present_hours + courseinfo.absent_hours;

            await CourseInfoService.updateCourseInfoDetails(
              courseId,
              attendance[i].studentId,
              new_total_hours,
              new_present_hours,
              courseinfo.absent_hours
            );
          } else if (attendance[i].status == "absent") {
            const new_absent_hours = courseinfo.absent_hours + attendance_hours;
            const new_total_hours = present_hours + new_absent_hours;

            await CourseInfoService.updateCourseInfoDetails(
              courseId,
              attendance[i].studentId,
              new_total_hours,
              present_hours,
              new_absent_hours
            );
          }
        } else if (existingCourse.attendance[i].status == "absent") {
          const absent_hours = courseinfo.absent_hours - attendance_hours;

          if (attendance[i].status == "present") {
            const new_present_hours =
              courseinfo.present_hours + attendance_hours;
            const new_total_hours = new_present_hours + absent_hours;

            await CourseInfoService.updateCourseInfoDetails(
              courseId,
              attendance[i].studentId,
              new_total_hours,
              new_present_hours,
              absent_hours
            );
          } else if (attendance[i].status == "absent") {
            const new_absent_hours = absent_hours + attendance_hours;
            const new_total_hours = courseinfo.present_hours + new_absent_hours;

            await CourseInfoService.updateCourseInfoDetails(
              courseId,
              attendance[i].studentId,
              new_total_hours,
              courseinfo.present_hours,
              new_absent_hours
            );
          }
        }
      }

      if (attendance) {
        existingCourse.attendance = attendance;
      }

      if (attendance_hours) {
        existingCourse.attendance_hours = attendance_hours;
      }

      if (topics) {
        existingCourse.topics = topics;
      }

      const updateResult = await AttendanceDAO.updateAttendance(existingCourse);

      if (updateResult) {
        return {};
      } else {
        return "Failed to update course details";
      }
    } catch (e) {
      return e.message;
    }
  }
}
