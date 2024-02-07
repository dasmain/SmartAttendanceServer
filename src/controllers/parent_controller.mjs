import ParentService from "../services/parent_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class ParentController {
  static async apiCreateParentAccount(req, res, next) {
    try {
      const { username, email, password, contactno, 
        //studentID 
    } = req.body;

      const serviceResponse = await ParentService.addParent(
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

      const serviceResponse = await ParentService.signInParent(
        email,
        password
      );

      if (typeof serviceResponse === "string") {
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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

  static async apiGetParentAccountDetails(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getDataFromToken(token);
      const serviceResponse = await ParentService.getParentAccountDetails(
        tokenDetails.user_id
      );

      if (typeof serviceResponse === "string") {
        res.status(200).json({ success: false, data: {}, message: serviceResponse });
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
      const tokenDetails = await TokenUtil.getDataFromToken(token);
      const serviceResponse = await ParentService.updateParentAccountPassword(
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
          message: "Parent account password updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateParentAccountDetails(req, res, next) {
    try {
      const { username, email, contactno } = req.body;
      const token = req.headers["authorization"];
      const tokenDetails = await TokenUtil.getDataFromToken(token);
      const serviceResponse = await ParentService.updateParentAccountDetails(
        tokenDetails.user_id,
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
          message: "Parent account details updated successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
