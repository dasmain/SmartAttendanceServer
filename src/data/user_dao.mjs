import databaseConfig from "../config/database_config.mjs";

let admincon;

export default class AdminDAO {
  static async injectDB(conn) {
    if (admincon) {
      return;
    }
    try {
      admincon = conn.db(databaseConfig.database.dbName).collection("admin");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addAdminToDB(user) {
    try {
      const insertionResult = await admincon.insertOne(user);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add User: ${e}`);
      return null;
    }
  }

  static async getAdminByEmailFromDB(email) {
    try {
      const user = await admincon.findOne({ email: email });
      return user;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }

  static async getAdminByIDFromDB(id) {
    try {
      const user = await admincon.findOne({ _id: id });
      return user;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }

  static async updateAdminPasswordInDB(email, newPassword) {
    try {
      const updateResult = await admincon.updateOne(
        { email },
        {
          $set: { password: newPassword },
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }

  static async updateAdminAccountInDB(user) {
    try {
      const updateResult = await admincon.updateOne(
        { _id: user._id },
        {
          $set: user,
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }
}
