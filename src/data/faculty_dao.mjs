import databaseConfig from "../config/database_config.mjs";

let facultyCon;

export default class FacultyDAO {
  static async injectDB(conn) {
    if (facultyCon) {
      return;
    }
    try {
      facultyCon = conn.db(databaseConfig.database.dbName).collection("faculty");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addFacultyToDB(faculty) {
    try {
      const insertionResult = await facultyCon.insertOne(faculty);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add Faculty: ${e}`);
      return null;
    }
  }

  static async getFacultyByEmailFromDB(email) {
    try {
      const faculty = await facultyCon.findOne({ email: email });
      return faculty;
    } catch (e) {
      console.error(`Unable to get faculty by email: ${e}`);
      return null;
    }
  }

  static async getFacultyByIDFromDB(id) {
    try {
      const faculty = await facultyCon.findOne({ _id: id });
      return faculty;
    } catch (e) {
      console.error(`Unable to get faculty by ID: ${e}`);
      return null;
    }
  }

  static async updateFacultyPasswordInDB(email, newPassword) {
    try {
      const updateResult = await facultyCon.updateOne(
        { email },
        {
          $set: { password: newPassword },
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to update faculty password: ${e}`);
      return false;
    }
  }

  static async updateFacultyAccountInDB(faculty) {
    try {
      const updateResult = await facultyCon.updateOne(
        { _id: faculty._id },
        {
          $set: faculty,
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to update faculty account: ${e}`);
      return false;
    }
  }

  static async getAllFaculty() {
    try {
      const faculty = await facultyCon.find().toArray();
      return faculty;
    } catch (e) {
      console.error(`Unable to get all Faculty: ${e}`);
      return null;
    }
  }

}
