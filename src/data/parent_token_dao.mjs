import databaseConfig from "../config/database_config.mjs";

let parentTokenCon;

export default class ParentTokenDAO {
  static async injectDB(conn) {
    if (parentTokenCon) {
      return;
    }
    try {
      parentTokenCon = conn.db(databaseConfig.database.dbName).collection("parent_tokens");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addParentTokenToDB(token) {
    try {
      const insertionResult = await parentTokenCon.insertOne(token);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add Parent Token: ${e}`);
      return null;
    }
  }

  static async getParentTokenFromDB(token) {
    try {
      const tokenObject = await parentTokenCon.findOne({ token: token });
      return tokenObject;
    } catch (e) {
      console.error(`Unable to get parent token: ${e}`);
      return null;
    }
  }

  static async deleteParentTokenFromDB(token) {
    try {
      const isDel = await parentTokenCon.deleteOne({ token: token });
      return true;
    } catch (e) {
      console.error(`Unable to delete parent token: ${e}`);
      return null;
    }
  }
}
