import databaseConfig from "../config/database_config.mjs";
import { ObjectId } from "mongodb";

let leavecon;

export default class LeaveDAO {
  static async injectDB(conn) {
    if (leavecon) {
      return;
    }
    try {
      leavecon = conn.db(databaseConfig.database.dbName).collection("leave");
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addLeaveToDB(leave) {
    try {
      const insertionResult = await leavecon.insertOne(leave);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add Leave: ${e}`);
      return null;
    }
  }

  static async getLeaveByIDFromDB(_id) {
    try {
      const leave = await leavecon.find({ studentId: _id }).toArray();
      return leave;
    } catch (e) {
      console.error(`Unable to get leave by ID: ${e}`);
      return null;
    }
  }

  static async getLeaveByStudentFromDB(studentId) {
    try {
      const leave = await leavecon.findOne({ studentId: studentId });
      return leave;
    } catch (e) {
      console.error(`Unable to get leave by ID: ${e}`);
      return null;
    }
  }

  static async updateLeaveInDB(leave) {
    try {
      const updateResult = await leavecon.updateOne(
        { _id: leave._id },
        {
          $set: leave,
        }
      );
      return true;
    } catch (e) {
      console.error(`Unable to update leave: ${e}`);
      return null;
    }
  }

  static async getAllLeave() {
    try {
      const leave = await leavecon.find().toArray();
      return leave;
    } catch (e) {
      console.error(`Unable to get all Leave: ${e}`);
      return null;
    }
  }

  static async deleteLeaveFromDB(_id) {
    try {
      const isDel = await leavecon.deleteOne({ _id: new ObjectId(_id) });
      return true;
    } catch (e) {
      console.error(`Unable to delete leave: ${e}`);
      return null;
    }
  }
}
