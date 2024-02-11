import databaseConfig from "../config/database_config.mjs";

let studentTokenCon;

export default class StudentTokenDAO {
  static async injectDB(conn) {
    if (studentTokenCon) {
      return;
    }
    try {
      studentTokenCon = conn.db(databaseConfig.database.dbName).collection("student_tokens");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addStudentTokenToDB(token) {
    try {
      const insertionResult = await studentTokenCon.insertOne(token);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add student Token: ${e}`);
      return null;
    }
  }

  static async getStudentTokenFromDB(token) {
    try {
      const tokenObject = await studentTokenCon.findOne({ token: token });
      return tokenObject;
    } catch (e) {
      console.error(`Unable to get student token: ${e}`);
      return null;
    }
  }

  static async deleteStudentTokenFromDB(token) {
    try {
      const isDel = await studentTokenCon.deleteOne({ token: token });
      return true;
    } catch (e) {
      console.error(`Unable to delete student token: ${e}`);
      return null;
    }
  }
  static async savePasswordResetTokenToDB(token) {
    try {
     
      const insertionResult = await studentTokenCon.insertOne(token);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to save password reset token: ${e}`);
      return null;
    }
  }
}
