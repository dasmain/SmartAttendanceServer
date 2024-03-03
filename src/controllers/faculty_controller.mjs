import FacultyService from "../services/faculty_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class FacultyController {
  static async apiCreateFacultyAccount(req, res, next) {
    try {
      const { name, email, password, contactno, isStudentAdvisor } = req.body;

      const serviceResponse = await FacultyService.addFaculty(
        name,
        email,
        password,
        contactno,
        isStudentAdvisor
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Faculty account created successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiSignInFacultyAccount(req, res, next) {
    try {
      const { email, password } = req.body;

      const serviceResponse = await FacultyService.signInFaculty(
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
          message: "Faculty signed in successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiSignOutFacultyAccount(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const serviceResponse = await FacultyService.signOutFaculty(token);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to sign out Faculty",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Faculty signed out successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetFacultyAccountDetails(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getFacultyDataFromToken(token);
      const serviceResponse = await FacultyService.getFacultyAccountDetails(
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
          message: "Faculty account details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetFacultyAccountDetailsByID(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }
      const serviceResponse = await FacultyService.getFacultyAccountDetails(
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
          message: "Faculty account details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiFacultyForgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const serviceResponse = await FacultyService.forgotFacultyPassword(email);
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
  static async apiGetFacultyTokenValidation(req, res, next) {
    try {
      const token = req.headers["authorization"];

      // Validate the token
      // const isValidToken = await StudentService.validateResetPasswordToken(token);
      const tokenDetails = await TokenUtil.getFacultyDataFromToken(token);
      if (tokenDetails) {
        res
          .status(200)
          .json({ success: true, data: {}, message: "Token is valid" });
      } else {
        res.status(400).json({
          success: false,
          data: {},
          message: "Invalid or expired token",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
  static async apiUpdateFacultyAccountPassword(req, res, next) {
    try {
      const { old_password, new_password } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getFacultyDataFromToken(token);
      const serviceResponse = await FacultyService.updateFacultyAccountPassword(
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
          message: "Faculty account password updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
  static async apiResetFacultyAccountPassword(req, res, next) {
    try {
      const { new_password } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getFacultyDataFromToken(token);
      const serviceResponse = await FacultyService.resetFacultyAccountPassword(
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
          message: "Faculty account password updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateFacultyAccountPasswordByAdmin(req, res, next) {
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
        await FacultyService.updateFacultyAccountPasswordByAdmin(
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
          message: "Faculty account password updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateFacultyAccountDetails(req, res, next) {
    try {
      const { name, email, contactno, isStudentAdvisor } = req.body;

      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await FacultyService.updateFacultyAccountDetails(
        _id,
        name,
        email,
        contactno,
        isStudentAdvisor
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Faculty account details updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetAllFacultyAccountDetails(req, res, next) {
    try {
      const serviceResponse = await FacultyService.getAllFacultyForAdmin();

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Faculty account details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiDeleteFacultyAccount(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await FacultyService.deleteFaculty(_id);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to delete Faculty",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Faculty deleted successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiValidateUser(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getFacultyDataFromToken(token);

      if (tokenDetails) {
        res
          .status(200)
          .json({ success: true, data: {}, message: "User Authenticated" });
      } else {
        res.status(401).json({
          success: false,
          data: {},
          message: "Invalid, expired or no token found",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
