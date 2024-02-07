import { ObjectId } from "mongodb";
import FacultyTokenDAO from "../data/faculty_token_dao.mjs"; // Assuming FacultyTokenDAO is implemented
import TokenUtil from "../utility/token_util.mjs";

export default class FacultyTokenService {
  static async connectDatabase(client) {
    try {
      await FacultyTokenDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async createFacultyToken(payload) {
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
      const addedTokenId = await FacultyTokenDAO.addFacultyTokenToDB(tokenDocument);
      return tokenString;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  static async getFacultyToken(tokenString) {
    try {
      const tokenObject = await FacultyTokenDAO.getFacultyTokenFromDB(tokenString);
      return tokenObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  static async deleteFacultyToken(tokenString) {
    try {
      const tokenObject = await FacultyTokenDAO.deleteFacultyTokenFromDB(tokenString);
      return tokenObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
}
