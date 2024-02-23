import databaseConfig from "../config/database_config.mjs";
import { ObjectId } from 'mongodb';

let coursecon;

export default class CourseDAO {
  static async injectDB(conn) {
    if (coursecon) {
      return;
    }
    try {
      coursecon = conn.db(databaseConfig.database.dbName).collection("course");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addCourseToDB(course) {
    try {
      const insertionResult = await coursecon.insertOne(course);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add Course: ${e}`);
      return null;
    }
  }

  static async getCourseByCoursCodeFromDB(courseCode) {
    try {
      const course = await coursecon.findOne({ courseCode: courseCode });
      return course;
    } catch (e) {
      console.error(`Unable to get faculty by course code: ${e}`);
      return null;
    }
  }

  static async getCourseByIDFromDB(_id) {
    try {
      const course = await coursecon.findOne({ _id: new ObjectId(_id) });
      return course;
    } catch (e) {
      console.error(`Unable to get course by ID: ${e}`);
      return null;
    }
  }

  static async getCourseByCoureTeacherFromDB(courseTeacher) {
    try {
      const course = await coursecon.findOne({ courseTeacher: courseTeacher });
      return course;
    } catch (e) {
      console.error(`Unable to get faculty by course code: ${e}`);
      return null;
    }
  }

  static async updateCourseInDB(course) {
    try {
      const updateResult = await coursecon.updateOne(
        { _id: course._id },
        {
          $set: course,
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to update course: ${e}`);
      return null;
    }
  }

  static async getAllCourse() {
    try {
      const course = await coursecon.find().toArray();
      return course;
    } catch (e) {
      console.error(`Unable to get all Course: ${e}`);
      return null;
    }
  }

  static async deleteCourseFromDB(_id) {
    try {
      const isDel = await coursecon.deleteOne({ _id: new ObjectId(_id) });
      return true;
    } catch (e) {
      console.error(`Unable to delete course: ${e}`);
      return null;
    }
  }
}
