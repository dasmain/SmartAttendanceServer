import databaseConfig from "../config/database_config.mjs";

let infocon;

export default class CourseInfoDAO {
  static async injectDB(conn) {
    if (infocon) {
      return;
    }
    try {
      infocon = conn
        .db(databaseConfig.database.dbName)
        .collection("course_info");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addCourseInfoToDB(info) {
    try {
      const insertionResult = await infocon.insertOne(info);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add course information: ${e}`);
      return null;
    }
  }

  static async getCourseInfoByCourse(courseId) {
    try {
      const info = await infocon.find({ courseId: courseId }).toArray();
      return info;
    } catch (e) {
      console.error(`Unable to get course information by course: ${e}`);
      return null;
    }
  }

  static async getCourseInfoByStudent(studentId) {
    try {
      const info = await infocon.find({ studentId: studentId }).toArray();
      return info;
    } catch (e) {
      console.error(`Unable to get course information by student: ${e}`);
      return null;
    }
  }

  static async getCourseInfoByStudentAndCourse(courseId, studentId) {
    try {
      const info = await infocon.findOne({
        courseId: courseId,
        studentId: studentId,
      });
      return info;
    } catch (e) {
      console.error(`Unable to get course information by student: ${e}`);
      return null;
    }
  }

  static async update(courseId, studentId, courseinfo) {
    try {
      const updateResult = await infocon.updateOne(
        { courseId: courseId, studentId: studentId },
        {
          $set: courseinfo,
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to update course info: ${e}`);
      return false;
    }
  }
}
