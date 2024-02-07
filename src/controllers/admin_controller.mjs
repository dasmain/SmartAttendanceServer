import AdminService from "../services/admin_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class AdminController {
  static async apiCreateAdminAccount(req, res, next) {
    try {
      const { email, password } = req.body;

      const serviceResponse = await AdminService.addAdmin(
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
          message: "User account created successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiSignInAdminAccount(req, res, next) {
    try {
      const { email, password } = req.body;

      const serviceResponse = await AdminService.signInAdmin(
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
          message: "User signed in successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiSignOutAdminAccount(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const serviceResponse = await AdminService.signOutAdmin(token);

      if (!serviceResponse) {
        res.status(200).json({
          success: false,
          data: {},
          message: "Failed to sign out user",
        });
      } else {
        res.status(200).json({
          success: true,
          data: {},
          message: "User signed out successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetAdminAccountDetails(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getDataFromToken(token);
      const serviceResponse = await AdminService.getAdminAccountDetails(
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
          message: "User account details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateAccountPassword(req, res, next) {
    try {
      const { old_password, new_password } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getDataFromToken(token);
      const serviceResponse = await AdminService.updateAdminAccountPassword(
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
          message: "User account password updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateAccountDetails(req, res, next) {
    try {
      const { firstname, lastname } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getDataFromToken(token);
      const serviceResponse = await AdminService.updateAdminAccountDetails(
        tokenDetails.user_id,
        firstname,
        lastname
      );

      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "User account details updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
