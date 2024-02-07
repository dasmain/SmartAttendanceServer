import { ObjectId } from "mongodb";
import ParentTokenDAO from "../data/parent_token_dao.mjs"; // Assuming ParentTokenDAO is implemented
import TokenUtil from "../utility/token_util.mjs";

export default class ParentTokenService {
  static async connectDatabase(client) {
    try {
      await ParentTokenDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async createParentToken(payload) {
    try {
      const tokenString = TokenUtil.createToken(payload);
      const signedInOn = payload.signedInOn;
      const userId = new ObjectId(payload._id);

      const tokenDocument = {
        token: tokenString,
        user_id: userId,
        signed_in_on: signedInOn,
      };
      const addedTokenId = await ParentTokenDAO.addParentTokenToDB(tokenDocument);
      return tokenString;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  static async getParentToken(tokenString) {
    try {
      const tokenObject = await ParentTokenDAO.getParentTokenFromDB(tokenString);
      return tokenObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  static async deleteParentToken(tokenString) {
    try {
      const tokenObject = await ParentTokenDAO.deleteParentTokenFromDB(tokenString);
      return tokenObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
}
