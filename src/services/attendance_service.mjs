import AttendanceDAO from "../data/attendance_dao.mjs";

export default class AttendanceService {
  static async connectDatabase(client) {
    try {
      await AttendanceDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addAttendance(courseId, attendance) {
    try {
      const date = new Date();
      date.setHours(0, 0, 0, 0);

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
        attendance: attendance.map((student) => ({
          studentId: student.studentId,
          status: student.status,
        })),
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedUserId = await AttendanceDAO.addAttendanceToDB(userDocument);

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
}
