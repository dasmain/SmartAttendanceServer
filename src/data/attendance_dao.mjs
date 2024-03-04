import databaseConfig from "../config/database_config.mjs";

let attendancecon;

export default class AttendanceDAO {
  static async injectDB(conn) {
    if (attendancecon) {
      return;
    }
    try {
      attendancecon = conn.db(databaseConfig.database.dbName).collection("attendance");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addAttendanceToDB(att) {
    try {
      const insertionResult = await attendancecon.insertOne(att);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add attendance: ${e}`);
      return null;
    }
  }

  static async getAttendanceByCourse(courseId) {
    try {
      const user = await attendancecon.find({ courseId: courseId }).toArray();
      return user;
    } catch (e) {
      console.error(`Unable to get attendance by course: ${e}`);
      return null;
    }
  }

  static async getAttendanceByCourseAndDate(courseId, date) {
    try {
      const user = await attendancecon.findOne({
        courseId: courseId,
        date: date,
      });
      return user;
    } catch (e) {
      console.error(`Unable to get attendance by course and date: ${e}`);
      return null;
    }
  }
}
