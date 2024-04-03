import { ObjectId } from "mongodb";
import TokenDAO from "../data/token_dao.mjs";
import TokenUtil from "../utility/token_util.mjs";
import FaceIdDAO from "../data/face_id_dao.mjs";

export default class FaceIdService {
  static async connectDatabase(client) {
    try {
      await FaceIdDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async createFaceId(faceId, studentId) {
    try {
      const created_on = new Date();
      const deleted_on = null;

      const faceDocument = {
        faceId: faceId,
        studentId: studentId,
        created_on: created_on,
        deleted_on: deleted_on,
      };

      const addedFaceId = await FaceIdDAO.addFaceIdToDB(faceDocument);
      const faceIdResponse = await FaceIdDAO.getFaceIdById(addedFaceId);
      return faceIdResponse;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  static async getFaceIdByStudent(studentId) {
    try {
      const faceId = await FaceIdDAO.getFaceIdByStudentIdFromDB(studentId);
      return faceId;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
}
