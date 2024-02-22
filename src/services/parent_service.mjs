import ParentDAO from "../data/parent_dao.mjs";
import AuthUtil from "../utility/auth_util.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import TokenUtil from "../utility/token_util.mjs";
import ParentTokenService from "./parent_token_service.mjs";
import nodemailer from 'nodemailer';

export default class ParentService {
  static async connectDatabase(client) {
    try {
      await ParentDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addParent(name, email, password, contactno, studentID) {
    try {
      const existingUser = await ParentDAO.getParentByEmailFromDB(email);
      if (existingUser) {
        return "User with this email already exists";
      }
      const passwordCheck = PatternUtil.checkPasswordLength(password);
      if (!passwordCheck) {
        return "Password's length should be greater than 8 characters";
      }
      const emailCheck = PatternUtil.checkEmailPattern(email);
      if (!emailCheck) {
        return "Please enter a valid email";
      }

      const hashedPassword = await AuthUtil.hashPassword(password);
      const createdOn = new Date();
      const deletedOn = null;

      const userDocument = {
        name: name,
        email: email,
        password: hashedPassword,
        contactno: contactno,
        studentID: studentID,
        role: "parent",
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedUserId = await ParentDAO.addParentToDB(userDocument);
      const parent = await ParentDAO.getParentByIDFromDB(addedUserId);
      const filteredParent = PatternUtil.filterParametersFromObject(parent, [
        "_id",
        "password",
        "role",
      ]);

      return { parent: filteredParent };
    } catch (e) {
      return e.message;
    }
  }

  static async signInParent(email, password) {
    try {
      const existingParent = await ParentDAO.getParentByEmailFromDB(email);
      if (!existingParent) {
        return "Either your email or password is incorrect";
      }
      const passwordCheck = await AuthUtil.comparePasswords(
        password,
        existingParent.password
      );
      if (!passwordCheck) {
        return "Either your email or password is incorrect";
      }

      const signedInOn = new Date();
      const tokenPayload = {
        _id: existingParent._id.toString(),
        email: existingParent.email,
        role: existingParent.role,
        signedInOn: signedInOn,
      };
      const tokenString = await ParentTokenService.createParentToken(
        tokenPayload
      );
      const filteredParent = PatternUtil.filterParametersFromObject(
        existingParent,
        ["_id", "password", "role"]
      );

      return {
        token: tokenString,
        signed_in_on: signedInOn,
        parent: filteredParent,
      };
    } catch (e) {
      return e.message;
    }
  }

  static async signOutParent(token) {
    try {
      const cleanedToken = TokenUtil.cleanToken(token);
      const deleteToken = await ParentTokenService.deleteParentToken(
        cleanedToken
      );

      return deleteToken;
    } catch (e) {
      return e.message;
    }
  }

  static async getParentByID(parentId) {
    try {
      const existingParent = await ParentDAO.getParentByIDFromDB(parentId);
      if (!existingParent) {
        return "No user found for this ID";
      } else {
        return existingParent;
      }
    } catch (e) {
      return e.message;
    }
  }
  static async forgotParentPassword(email) {
    try {
      const existingStudent = await ParentDAO.getParentByEmailFromDB(email);
      if (!existingStudent) {
        return "No user found with this email";
      }

      const tokenPayload = {
        _id: existingStudent._id.toString(),
        email: existingStudent.email,
        role: existingStudent.role,
      };
      const tokenString = await ParentTokenService.savePasswordResetToken(tokenPayload);

      
      const resetLink = `http://localhost:3001/parent/reset-password?email=${email}&parentToken=${tokenString}`;

      // Send email with the reset link
      const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'smartattendance1@hotmail.com',
          pass: 'Fypproject'
        }
      });

      await transporter.sendMail({
        from: 'smartattendance1@hotmail.com',
        to: email,
        subject: 'Password Reset Link',
        html: `Click <a href="${resetLink}">here</a> to reset your password.`,
      });

return;
      
    } catch (e) {
      console.error(e.message);
      return "Failed to send reset link. Please try again later.";
    }
  }

  static async getParentAccountDetails(parentId) {
    try {
      const existingParent = await ParentDAO.getParentByIDFromDB(parentId);
      if (!existingParent) {
        return "No user found for this ID";
      } else {
        const filteredParent = PatternUtil.filterParametersFromObject(
          existingParent,
          ["_id", "password", "role"]
        );

        return filteredParent;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateParentAccountPassword(parentId, oldPassword, newPassword) {
    try {
      const existingParent = await ParentDAO.getParentByIDFromDB(parentId);
      if (!existingParent) {
        return "No user found for this ID";
      }

      const passwordCheck = await AuthUtil.comparePasswords(
        oldPassword,
        existingParent.password
      );

      if (!passwordCheck) {
        return "Incorrect password entered";
      }

      const newPasswordCheck = PatternUtil.checkPasswordLength(newPassword);
      if (!newPasswordCheck) {
        return "Password's length should be greater than 8 characters";
      }
      const hashedPassword = await AuthUtil.hashPassword(newPassword);
      const updateResult = await ParentDAO.updateParentPasswordInDB(
        existingParent.email,
        hashedPassword
      );

      if (updateResult) {
        return {};
      } else {
        return "Failed to update the password";
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateParentAccountPasswordByAdmin(parentId, newPassword) {
    try {
      const existingParent = await ParentDAO.getParentByIDFromDB(parentId);
      if (!existingParent) {
        return "No user found for this ID";
      }

      const newPasswordCheck = PatternUtil.checkPasswordLength(newPassword);
      if (!newPasswordCheck) {
        return "Password's length should be greater than 8 characters";
      }
      const hashedPassword = await AuthUtil.hashPassword(newPassword);
      const updateResult = await ParentDAO.updateParentPasswordInDBByAdmin(
        parentId,
        hashedPassword
      );

      if (updateResult) {
        return {};
      } else {
        return "Failed to update the password";
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateParentAccountDetails(parentId, name, email, contactno,studentID) {
    try {
      const existingParent = await ParentDAO.getParentByIDFromDB(parentId);
      if (!existingParent) {
        return "No user found for this ID";
      }

      if (name) {
        existingParent.name = name;
      }

      if (email) {
        existingParent.email = email;
      }

      if (contactno) {
        existingParent.contactno = contactno;
      }
      if (studentID) {
        existingParent.studentID = studentID;
      }

      const updateResult = await ParentDAO.updateParentAccountInDB(
        existingParent
      );

      if (updateResult) {
        return {};
      } else {
        return "Failed to update account details";
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getAllParentForAdmin() {
    try {
      const existingParent = await ParentDAO.getAllParent();
      if (!existingParent) {
        return "No parent available.";
      } else {
        return existingParent;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async deleteParent(_id) {
    try {
      const resultObject = await ParentDAO.deleteParentFromDB(_id);
      return resultObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
}
