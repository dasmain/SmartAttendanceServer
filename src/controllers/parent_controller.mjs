import ParentService from "../services/parent_service.mjs";
import StudentService from "../services/student_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class ParentController {
  static async apiCreateParentAccount(req, res, next) {
    try {
      const { name, email, password, contactno, studentID } = req.body;

      const serviceResponse = await ParentService.addParent(
        name,
        email,
        password,
        contactno,
        studentID
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Parent account created successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiSignInParentAccount(req, res, next) {
    try {
      const { email, password } = req.body;

      const serviceResponse = await ParentService.signInParent(email, password);

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Parent signed in successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiSignOutParentAccount(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const serviceResponse = await ParentService.signOutParent(token);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to sign out Parent",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Parent signed out successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
  static async apiParentForgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const serviceResponse = await ParentService.forgotParentPassword(email);
      if (typeof serviceResponse === "string") {
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
  static async apiGetParentTokenValidation(req, res, next) {
    try {
      const token = req.headers["authorization"];
  
      // Validate the token
      // const isValidToken = await StudentService.validateResetPasswordToken(token);
      const tokenDetails = await TokenUtil.getParentDataFromToken(token);
      if (tokenDetails) {
        res.status(200).json({ success: true, data: {}, message: "Token is valid" });
      } else {
        res.status(400).json({ success: false, data: {}, message: "Invalid or expired token" });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
  static async apiGetParentAccountDetails(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getParentDataFromToken(token);
      const serviceResponse = await ParentService.getParentAccountDetails(
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
          message: "Parent account details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetParentAccountDetailsById(req, res, next) {
    try {
      const _id = req.query._id;

      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await ParentService.getParentAccountDetails(
        _id
      );

      if (serviceResponse.studentID != null) {
        const forStudentResponse =
          await StudentService.getStudentAccountDetails(
            serviceResponse.studentID
          );

        serviceResponse.studentID = forStudentResponse;
      }

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Parent account details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateParentAccountPassword(req, res, next) {
    try {
      const { old_password, new_password } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getParentDataFromToken(token);
      const serviceResponse = await ParentService.updateParentAccountPassword(
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
          message: "Parent account password updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateParentAccountDetails(req, res, next) {
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

      const serviceResponse = await ParentService.updateParentAccountDetails(
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
          message: "Parent account details updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetAllParentAccountDetails(req, res, next) {
    try {
      const serviceResponse = await ParentService.getAllParentForAdmin();

      for (let i = 0; i < serviceResponse.length; i++) {
        const course = serviceResponse[i];
        if (course.studentID != null) {
          const forStudentResponse = await StudentService.getStudentAccountDetails(
            course.studentID
          );

          course.studentID = forStudentResponse;
        }
      }

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

  static async apiDeleteParentAccount(req, res, next) {
    try {
      const _id = req.query._id;
      if (!_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "_id parameter is missing",
        });
      }

      const serviceResponse = await ParentService.deleteParent(_id);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to delete Parent",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "Parent deleted successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
