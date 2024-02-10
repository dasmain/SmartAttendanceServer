import StudentService from "../services/student_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class StudentController {
  static async apiCreateStudentAccount(req, res, next) {
    try {
      const { firstname, lastname, username, email, password, contactno, 
        //studentID 
    } = req.body;

      const serviceResponse = await StudentService.addStudent(
        firstname,
        lastname,
        username,
        email,
        password,
        contactno,
       // studentID
      );
      
      if (typeof serviceResponse === "string") {
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
      const tokenDetails = await TokenUtil.getDataFromToken(token);
      const serviceResponse = await StudentService.getStudentAccountDetails(
        tokenDetails.user_id
      );

      if (typeof serviceResponse === "string") {
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
      const tokenDetails = await TokenUtil.getDataFromToken(token);
      const serviceResponse = await StudentService.updateStudentAccountPassword(
        tokenDetails.user_id,
        old_password,
        new_password
      );

      if (typeof serviceResponse === "string") {
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
      const { firstname, lastname, username, email, contactno } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getDataFromToken(token);
      const serviceResponse = await StudentService.updateStudentAccountDetails(
        tokenDetails.user_id,
        firstname,
        lastname,
        username,
        email,
        contactno
      );

      if (typeof serviceResponse === "string") {
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
}
