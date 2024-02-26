import LeaveService from "../services/leave_service.mjs";
import CourseService from "../services/course_service.mjs";
import StudentService from "../services/student_service.mjs";
import TokenUtil from "../utility/token_util.mjs";
import multer from "multer";
import fs from "fs";
const upload = multer({ dest: "src/files/leave_attachments" });

export default class LeaveController {
  static async apiCreateLeave(req, res, next) {
    try {
      upload.single("attachment")(req, res, async function (err) {
        if (err) {
          return res
            .status(500)
            .json({ success: false, data: {}, message: err.message });
        }

        const token = req.headers["authorization"];
        const tokenDetails = await TokenUtil.getStudentDataFromToken(token);
        const _id = tokenDetails.user_id.toString();

        const { subject, fromDate, toDate, reason } = req.body;

        let attachmentData = null;

        if (req.file) {
          const fileData = fs.readFileSync(req.file.path);
          attachmentData = fileData;
          fs.unlinkSync(req.file.path);
        }

        const serviceResponse = await LeaveService.addLeave(
          _id,
          subject,
          fromDate,
          toDate,
          attachmentData,
          reason
        );

        if (typeof serviceResponse === "string") {
          res
            .status(200)
            .json({ success: false, data: {}, message: serviceResponse });
        } else {
          res.status(200).json({
            success: true,
            data: serviceResponse,
            message: "Leave Request created successfully",
          });
        }
      });
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetLeaveDetails(req, res, next) {
    try {
      const _id = req.query._id;

      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await LeaveService.getLeaveByID(_id);

      if (serviceResponse.studentId != null) {
        const forStudentResponse =
          await StudentService.getStudentAccountDetails(
            serviceResponse.studentId
          );

        serviceResponse.studentId = forStudentResponse;
      }

      const fileData = serviceResponse.attachment;
      const base64EncodedPDF = fileData.toString("base64");
      serviceResponse.attachment = base64EncodedPDF;

      if (typeof serviceResponse === "string") {
        res.status(200).json({
          success: false,
          data: {},
          message: serviceResponse,
        });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Leave details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        data: {},
        message: e.message,
      });
    }
  }

  static async apiUpdateLeaveDetails(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const {
        studentId,
        subject,
        fromDate,
        toDate,
        attachment,
        reason,
        status,
      } = req.body;

      const serviceResponse = await LeaveService.updateLeaveDetails(
        _id,
        studentId,
        subject,
        fromDate,
        toDate,
        attachment,
        reason,
        status
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Leave updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetAllLeaveDetails(req, res, next) {
    try {
      const serviceResponse = await LeaveService.getAllLeaveForAdvisor();
      for (let i = 0; i < serviceResponse.length; i++) {
        const course = serviceResponse[i];
        if (course.studentId != null) {
          const forStudentResponse =
            await StudentService.getStudentAccountDetails(course.studentId);

          course.studentId = forStudentResponse;

          const fileData = course.attachment;
          const base64EncodedPDF = fileData.toString("base64");
          course.attachment = base64EncodedPDF;
        }
      }

      if (typeof serviceResponse === "string") {
        res.status(200).json({
          success: false,
          data: {},
          message: serviceResponse,
        });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Leave details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        data: {},
        message: e.message,
      });
    }
  }

  static async apiDeleteLeave(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await LeaveService.deleteLeave(_id);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to delete Leave Request",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Leave Request deleted successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetLeaveDetailsByStudent(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getStudentDataFromToken(token);
      const _id = tokenDetails.user_id.toString();
      const serviceResponse = await LeaveService.getLeaveByStudent(_id);

      for (let i = 0; i < serviceResponse.length; i++) {
        const course = serviceResponse[i];
        if (course.studentId != null) {
          const forStudentResponse =
            await StudentService.getStudentAccountDetails(course.studentId);

          course.studentId = forStudentResponse;
        }
      }

      if (typeof serviceResponse === "string") {
        res.status(200).json({
          success: false,
          data: {},
          message: serviceResponse,
        });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Course Request details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        data: {},
        message: e.message,
      });
    }
  }
}
