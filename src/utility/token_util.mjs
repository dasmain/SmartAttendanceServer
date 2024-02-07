import jwt from "jsonwebtoken";
import appConfig from "../config/app_config.mjs";
import TokenService from "../services/token_service.mjs";
import ParentTokenService from "../services/parent_token_service.mjs";
import StudentTokenService from "../services/student_token_service.mjs";
import FacultyTokenService from "../services/faculty_token_service.mjs";
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
    const tokenObject = await ParentTokenService.getParentToken(
      TokenUtil.cleanToken(token)
    );
    

    return tokenObject;
  },

  getStudentDataFromToken: async (token) => {
    const tokenObject = await StudentTokenService.getStudentToken(
      TokenUtil.cleanToken(token)
    );
    

    return tokenObject;
  },
  
  getFacultyDataFromToken: async (token) => {
    const tokenObject = await FacultyTokenService.getFacultyToken(
      TokenUtil.cleanToken(token)
    );
    

    return tokenObject;
  },
};

export default TokenUtil;
