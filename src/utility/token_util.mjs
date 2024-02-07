import jwt from "jsonwebtoken";
import appConfig from "../config/app_config.mjs";
import TokenService from "../services/token_service.mjs";
import ParentService from "../services/parent_service.mjs";
import StudentService from "../services/student_service.mjs";
const secretKey = appConfig.jwt.secret;

const TokenUtil = {
  // Method to create a JWT token
  createToken: (payload) => {
    try {
      const token = jwt.sign(payload, secretKey, {
        expiresIn: appConfig.jwt.expiresIn,
      });
      return token;
    } catch (error) {
      throw error;
    }
  },

  // Method to check if a token exists in the database (dummy implementation)
  checkTokenStructure: (token) => {
    try {
      if (!token) {
        return false;
      } else if (!TokenUtil.cleanToken(token)) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return null;
    }
  },

  cleanToken: (token) => {
    try {
      const tokenSplit = token.split(" ")[1];

      return tokenSplit;
    } catch (error) {
      return null;
    }
  },

  decodeTokenData: (token) => {
    try {
      const tokenData = jwt.verify(
        TokenUtil.cleanToken(token),
        appConfig.jwt.secret
      );

      return tokenData;
    } catch (error) {
      return null;
    }
  },

  getDataFromToken: async (token) => {
    const tokenObject = await TokenService.getUserToken(
      TokenUtil.cleanToken(token)
    );
    

    return tokenObject;
  },
  getParentDataFromToken: async (token) => {
    const tokenObject = await ParentService.getUserToken(
      TokenUtil.cleanToken(token)
    );
    

    return tokenObject;
  },

  getStudentDataFromToken: async (token) => {
    const tokenObject = await StudentService.getUserToken(
      TokenUtil.cleanToken(token)
    );
    

    return tokenObject;
  },
};

export default TokenUtil;
