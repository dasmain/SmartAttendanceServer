import StudentService from "../services/student_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class StudentController {
  static async apiCreateStudentAccount(req, res, next) {
    try {
      const { name, email, password, contactno } = req.body;

      const serviceResponse = await StudentService.addStudent(
        name,
        email,
        password,
        contactno
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Student account created successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiSignInStudentAccount(req, res, next) {
    try {
      const { email, password } = req.body;

      const serviceResponse = await StudentService.signInStudent(
        email,
        password
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Student signed in successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiSignOutStudentAccount(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const serviceResponse = await StudentService.signOutStudent(token);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to sign out Student",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Student signed out successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetStudentAccountDetails(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getStudentDataFromToken(token);
      const serviceResponse = await StudentService.getStudentAccountDetails(
        tokenDetails.user_id
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Student account details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetStudentAccountDetailsByID(req, res, next) {
    try {
      const _id = req.query._id;

      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await StudentService.getStudentAccountDetails(
        _id
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Student account details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateStudentAccountPassword(req, res, next) {
    try {
      const { old_password, new_password } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getStudentDataFromToken(token);
      const serviceResponse = await StudentService.updateStudentAccountPassword(
        tokenDetails.user_id,
        old_password,
        new_password
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Student account password updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateStudentAccountPasswordByAdmin(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }
      const { new_password } = req.body;
      const serviceResponse =
        await StudentService.updateStudentAccountPasswordByAdmin(
          _id,
          new_password
        );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Student account password updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
  static async apiResetStudentAccountPassword(req, res, next) {
    try {
      const { new_password } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getStudentDataFromToken(token);
      const serviceResponse = await StudentService.resetStudentAccountPassword(
        tokenDetails.user_id,
        new_password
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Student account password updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateStudentAccountDetails(req, res, next) {
    try {
      const { name, email, contactno } = req.body;
      const _id = req.query._id;

      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await StudentService.updateStudentAccountDetails(
        _id,
        name,
        email,
        contactno
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Student account details updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiForgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const serviceResponse = await StudentService.forgotPassword(email);
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Password reset link sent to your email",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetStudentTokenValidation(req, res, next) {
    try {
      const token = req.headers["authorization"];

      // Validate the token
      // const isValidToken = await StudentService.validateResetPasswordToken(token);
      const tokenDetails = await TokenUtil.getStudentDataFromToken(token);
      if (tokenDetails) {
        res
          .status(200)
          .json({ success: true, data: {}, message: "Token is valid" });
      } else {
        res
          .status(400)
          .json({
            success: false,
            data: {},
            message: "Invalid or expired token",
          });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetAllStudentAccountDetails(req, res, next) {
    try {
      const serviceResponse = await StudentService.getAllStudentForAdmin();

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Student account details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiDeleteStudentAccount(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await StudentService.deleteStudent(_id);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to delete Student",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Student deleted successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
