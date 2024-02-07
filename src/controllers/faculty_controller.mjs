import FacultyService from "../services/faculty_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class FacultyController {
  static async apiCreateFacultyAccount(req, res, next) {
    try {
      const { firstName, lastName, username, email, password, contactno } = req.body;

      const serviceResponse = await FacultyService.addFaculty(
        firstName,
        lastName,
        username,
        email,
        password,
        contactno
      );
      
      if (typeof serviceResponse === "string") {
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
      const { firstName, lastName, username, email, contactno } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getFacultyDataFromToken(token);
      const serviceResponse = await FacultyService.updateFacultyAccountDetails(
        tokenDetails.user_id,
        firstName,
        lastName,
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
          message: "Faculty account details updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
