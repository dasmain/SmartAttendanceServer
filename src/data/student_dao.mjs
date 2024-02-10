import databaseConfig from "../config/database_config.mjs";

let studentCon;

export default class StudentDAO {
  static async injectDB(conn) {
    if (studentCon) {
      return;
    }
    try {
      studentCon = conn.db(databaseConfig.database.dbName).collection("students");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addStudentToDB(student) {
    try {
      const insertionResult = await studentCon.insertOne(student);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add Student: ${e}`);
      return null;
    }
  }

  static async getStudentByEmailFromDB(email) {
    try {
      const student = await studentCon.findOne({ email: email });
      return student;
    } catch (e) {
      console.error(`Unable to get student by email: ${e}`);
      return null;
    }
  }

  static async getStudentByIDFromDB(id) {
    try {
      const student = await studentCon.findOne({ _id: id });
      return student;
    } catch (e) {
      console.error(`Unable to get student by ID: ${e}`);
      return null;
    }
  }

  static async updateStudentPasswordInDB(email, newPassword) {
    try {
      const updateResult = await studentCon.updateOne(
        { email },
        {
          $set: { password: newPassword },
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to update student password: ${e}`);
      return false;
    }
  }

  static async updateStudentAccountInDB(student) {
    try {
      const updateResult = await studentCon.updateOne(
        { _id: student._id },
        {
          $set: student,
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to update student account: ${e}`);
      return false;
    }
  }

  
}
