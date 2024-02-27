import LeaveDAO from "../data/leave_dao.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import { ObjectId } from "mongodb";

export default class LeaveService {
  static async connectDatabase(client) {
    try {
      await LeaveDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addLeave(
    studentId,
    subject,
    fromDate,
    toDate,
    attachment,
    reason
  ) {
    try {
      const existingRequest = await LeaveDAO.getLeaveByStudentFromDB(studentId);

      if (existingRequest && existingRequest.status == "pending") {
        return "Leave already applied for!";
      }

      const createdOn = new Date();
      const deletedOn = null;
      const status = "pending";

      const leaveDocument = {
        studentId: studentId,
        subject: subject,
        fromDate: fromDate,
        toDate: toDate,
        attachment: attachment,
        reason: reason,
        status: status,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedLeave = await LeaveDAO.addLeaveToDB(leaveDocument);

      return { _id: addedLeave };
    } catch (e) {
      return e.message;
    }
  }

  static async getLeaveByID(leaveId) {
    try {
      const existingCourse = await LeaveDAO.getLeaveByIDFromDB(leaveId);
      if (!existingCourse) {
        return "No leave found for this ID";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateLeaveDetails(
    leaveId,
    studentId,
    subject,
    fromDate,
    toDate,
    attachment,
    reason,
    status
  ) {
    try {
      const existingCourse = await LeaveDAO.getLeaveByIDFromDB(leaveId);
      if (!existingCourse) {
        return "No leave found for this ID";
      }

      if (studentId) {
        existingCourse.studentId = studentId;
      }

      if (subject) {
        existingCourse.subject = subject;
      }

      if (fromDate) {
        existingCourse.fromDate = fromDate;
      }

      if (toDate) {
        existingCourse.toDate = toDate;
      }

      if (attachment) {
        existingCourse.attachment = attachment;
      }

      if (reason) {
        existingCourse.reason = reason;
      }

      if (status) {
        existingCourse.status = status;
      }

      const updateResult = await LeaveDAO.updateLeaveInDB(existingCourse);

      if (updateResult) {
        return {};
      } else {
        return "Failed to update leave details";
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getAllLeaveForAdvisor() {
    try {
      const existingCourse = await LeaveDAO.getAllLeave();
      if (!existingCourse) {
        return "No leave available.";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async deleteLeave(_id) {
    try {
      const resultObject = await LeaveDAO.deleteLeaveFromDB(_id);
      return resultObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  static async getLeaveByStudent(studentId) {
    try {
      const existingCourse = await LeaveDAO.getLeaveByStudentFromDB(studentId);
      if (!existingCourse) {
        return "No leave found for this Student";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }
}
