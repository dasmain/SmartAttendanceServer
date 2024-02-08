import { ObjectId } from "mongodb";
import StudentTokenDAO from "../data/student_token_dao.mjs"; // Assuming StudentTokenDAO is implemented
import TokenUtil from "../utility/token_util.mjs";

export default class StudentTokenService {
  static async connectDatabase(client) {
    try {
      await StudentTokenDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async createStudentToken(payload) {
    try {
      const tokenString = TokenUtil.createToken(payload);
      const signedInOn = payload.signedInOn;
      const userId = new ObjectId(payload._id);
      const role = payload.role;

      const tokenDocument = {
        token: tokenString,
        user_id: userId,
        role: role,
        signed_in_on: signedInOn,
      };
      const addedTokenId = await StudentTokenDAO.addStudentTokenToDB(tokenDocument);
      return tokenString;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  static async getStudentToken(tokenString) {
    try {
      const tokenObject = await StudentTokenDAO.getStudentTokenFromDB(tokenString);
      return tokenObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  static async deleteStudentToken(tokenString) {
    try {
      const tokenObject = await StudentTokenDAO.deleteStudentTokenFromDB(tokenString);
      return tokenObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
}
