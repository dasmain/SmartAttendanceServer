import { ObjectId } from "mongodb";
import databaseConfig from "../config/database_config.mjs";

let faceidcon;

export default class FaceIdDAO {
  static async injectDB(conn) {
    if (faceidcon) {
      return;
    }
    try {
      faceidcon = conn.db(databaseConfig.database.dbName).collection("face_id");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addFaceIdToDB(face) {
    try {
      const insertionResult = await faceidcon.insertOne(face);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add Face ID: ${e}`);
      return null;
    }
  }

  static async getFaceIdByStudentIdFromDB(studentId) {
    try {
      const face = await faceidcon.findOne({ studentId: studentId });
      return face;
    } catch (e) {
      console.error(`Unable to get FaceId by ID: ${e}`);
      return null;
    }
  }

  static async getAllFaceIdFromDB() {
    try {
      const face = await faceidcon.find().toArray();
      return face;
    } catch (e) {
      console.error(`Unable to get FaceId: ${e}`);
      return null;
    }
  }

  static async getFaceIdById(id) {
    try {
      const face = await faceidcon.findOne({ _id: new ObjectId(id) });
      return face;
    } catch (e) {
      console.error(`Unable to get FaceId by ID: ${e}`);
      return null;
    }
  }

  static async deleteFaceId(studentId) {
    try {      
      const face = await faceidcon.deleteOne({ studentId: studentId });
      return true;
    } catch (e) {
      console.error(`Unable to get faceId: ${e}`);
      return null;
    }
  }
}
