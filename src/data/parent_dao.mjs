import databaseConfig from "../config/database_config.mjs";
import { ObjectId } from 'mongodb';

let parentCon;

export default class ParentDAO {
  static async injectDB(conn) {
    if (parentCon) {
      return;
    }
    try {
      parentCon = conn.db(databaseConfig.database.dbName).collection("parent");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addParentToDB(parent) {
    try {
      const insertionResult = await parentCon.insertOne(parent);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add Parent: ${e}`);
      return null;
    }
  }

  static async getParentByEmailFromDB(email) {
    try {
      const parent = await parentCon.findOne({ email: email });
      return parent;
    } catch (e) {
      console.error(`Unable to get parent by email: ${e}`);
      return null;
    }
  }

  static async getParentByIDFromDB(id) {
    try {
      const parent = await parentCon.findOne({ _id: new ObjectId(id) });
      return parent;
    } catch (e) {
      console.error(`Unable to get parent by ID: ${e}`);
      return null;
    }
  }

  static async updateParentPasswordInDB(email, newPassword) {
    try {
      const updateResult = await parentCon.updateOne(
        { email },
        {
          $set: { password: newPassword },
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to update parent password: ${e}`);
      return false;
    }
  }

  static async updateParentAccountInDB(parent) {
    try {
      const updateResult = await parentCon.updateOne(
        { _id: parent._id },
        {
          $set: parent,
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to update parent account: ${e}`);
      return false;
    }
  }

  static async getAllParent() {
    try {
      const parent = await parentCon.find().toArray();
      return parent;
    } catch (e) {
      console.error(`Unable to get all Student: ${e}`);
      return null;
    }
  }

  static async deleteParentFromDB(_id) {
    try {
      const isDel = await parentCon.deleteOne({ _id: new ObjectId(_id) });
      return true;
    } catch (e) {
      console.error(`Unable to delete parent: ${e}`);
      return null;
    }
  }
}
