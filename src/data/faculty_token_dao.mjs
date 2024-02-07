import databaseConfig from "../config/database_config.mjs";

let facultyTokenCon;

export default class FacultyTokenDAO {
  static async injectDB(conn) {
    if (facultyTokenCon) {
      return;
    }
    try {
      facultyTokenCon = conn.db(databaseConfig.database.dbName).collection("faculty_tokens");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addFacultyTokenToDB(token) {
    try {
      const insertionResult = await facultyTokenCon.insertOne(token);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add Faculty Token: ${e}`);
      return null;
    }
  }

  static async getFacultyTokenFromDB(token) {
    try {
      const tokenObject = await facultyTokenCon.findOne({ token: token });
      return tokenObject;
    } catch (e) {
      console.error(`Unable to get faculty token: ${e}`);
      return null;
    }
  }

  static async deleteFacultyTokenFromDB(token) {
    try {
      const isDel = await facultyTokenCon.deleteOne({ token: token });
      return true;
    } catch (e) {
      console.error(`Unable to delete faculty token: ${e}`);
      return null;
    }
  }
}
