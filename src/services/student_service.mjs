import FaceIdDAO from "../data/face_id_dao.mjs";
import StudentDAO from "../data/student_dao.mjs";
import AuthUtil from "../utility/auth_util.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import TokenUtil from "../utility/token_util.mjs";
import StudentTokenService from "./student_token_service.mjs";
import nodemailer from "nodemailer";
export default class StudentService {
  static async connectDatabase(client) {
    try {
      await StudentDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addStudent(name, email, password, contactno) {
    try {
      const existingUser = await StudentDAO.getStudentByEmailFromDB(email);
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

      const nameCheck = PatternUtil.checkAlphabeticName(name);
      if (!nameCheck) {
        return "Name can not contain numbers and special characters";
      }

      const hashedPassword = await AuthUtil.hashPassword(password);
      const createdOn = new Date();
      const deletedOn = null;

      const userDocument = {
        name: name,
        email: email,
        password: hashedPassword,
        contactno: contactno,
        role: "student",
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedUserId = await StudentDAO.addStudentToDB(userDocument);
      const student = await StudentDAO.getStudentByIDFromDB(addedUserId);
      const filteredStudent = PatternUtil.filterParametersFromObject(student, [
        "_id",
        "password",
        "role",
      ]);

      return { student: filteredStudent };
    } catch (e) {
      return e.message;
    }
  }

  static async signInStudent(email, password) {
    try {
      const existingStudent = await StudentDAO.getStudentByEmailFromDB(email);
      if (!existingStudent) {
        return "Either your email or password is incorrect";
      }
      const passwordCheck = await AuthUtil.comparePasswords(
        password,
        existingStudent.password
      );
      if (!passwordCheck) {
        return "Either your email or password is incorrect";
      }

      const signedInOn = new Date();
      const tokenPayload = {
        _id: existingStudent._id.toString(),
        email: existingStudent.email,
        role: existingStudent.role,
        signedInOn: signedInOn,
      };

      const tokenString = await StudentTokenService.createStudentToken(
        tokenPayload
      );
      const filteredStudent = PatternUtil.filterParametersFromObject(
        existingStudent,
        ["_id", "password", "role"]
      );

      return {
        token: tokenString,
        signed_in_on: signedInOn,
        student: filteredStudent,
      };
    } catch (e) {
      return e.message;
    }
  }

  static async signOutStudent(token) {
    try {
      const cleanedToken = TokenUtil.cleanToken(token);
      const deleteToken = await StudentTokenService.deleteStudentToken(
        cleanedToken
      );

      return deleteToken;
    } catch (e) {
      return e.message;
    }
  }

  static async getStudentByID(studentId) {
    try {
      const existingStudent = await StudentDAO.getStudentByIDFromDB(studentId);
      if (!existingStudent) {
        return "No user found for this ID";
      } else {
        return existingStudent;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getStudentAccountDetails(studentId) {
    try {
      const existingStudent = await StudentDAO.getStudentByIDFromDB(studentId);
      if (!existingStudent) {
        return "No user found for this ID";
      } else {
        const filteredStudent = PatternUtil.filterParametersFromObject(
          existingStudent,
          ["password", "role"]
        );

        return filteredStudent;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateStudentAccountPassword(
    studentId,
    oldPassword,
    newPassword
  ) {
    try {
      const existingStudent = await StudentDAO.getStudentByIDFromDB(studentId);
      if (!existingStudent) {
        return "No user found for this ID";
      }

      const passwordCheck = await AuthUtil.comparePasswords(
        oldPassword,
        existingStudent.password
      );

      if (!passwordCheck) {
        return "Incorrect password entered";
      }

      const newPasswordCheck = PatternUtil.checkPasswordLength(newPassword);
      if (!newPasswordCheck) {
        return "Password's length should be greater than 8 characters";
      }
      const hashedPassword = await AuthUtil.hashPassword(newPassword);
      const updateResult = await StudentDAO.updateStudentPasswordInDB(
        existingStudent.email,
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

  static async updateStudentAccountPasswordByAdmin(studentId, newPassword) {
    try {
      const existingStudent = await StudentDAO.getStudentByIDFromDB(studentId);
      if (!existingStudent) {
        return "No user found for this ID";
      }

      const newPasswordCheck = PatternUtil.checkPasswordLength(newPassword);
      if (!newPasswordCheck) {
        return "Password's length should be greater than 8 characters";
      }
      const hashedPassword = await AuthUtil.hashPassword(newPassword);
      const updateResult = await StudentDAO.updateStudentPasswordInDBByAdmin(
        studentId,
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
  static async resetStudentAccountPassword(studentId, newPassword) {
    try {
      const existingStudent = await StudentDAO.getStudentByIDFromDB(studentId);
      if (!existingStudent) {
        return "No user found for this ID";
      }

      const newPasswordCheck = PatternUtil.checkPasswordLength(newPassword);
      if (!newPasswordCheck) {
        return "Password's length should be greater than 8 characters";
      }
      const hashedPassword = await AuthUtil.hashPassword(newPassword);
      const updateResult = await StudentDAO.updateStudentPasswordInDBByAdmin(
        studentId,
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

  static async updateStudentAccountDetails(studentId, name, email, contactno) {
    try {
      const existingStudent = await StudentDAO.getStudentByIDFromDB(studentId);
      if (!existingStudent) {
        return "No user found for this ID";
      }

      if (name) {
        existingStudent.name = name;
      }

      if (email) {
        existingStudent.email = email;
      }

      if (contactno) {
        existingStudent.contactno = contactno;
      }

      const updateResult = await StudentDAO.updateStudentAccountInDB(
        existingStudent
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

  static async forgotPassword(email) {
    try {
      const existingStudent = await StudentDAO.getStudentByEmailFromDB(email);
      if (!existingStudent) {
        return "No user found with this email";
      }

      const tokenPayload = {
        _id: existingStudent._id.toString(),
        email: existingStudent.email,
        role: existingStudent.role,
      };
      const tokenString = await StudentTokenService.savePasswordResetToken(
        tokenPayload
      );

      // const now = moment.tz('Asia/Karachi');
      const resetLink = `http://localhost:3001/student/reset-password?email=${email}&studentToken=${tokenString}`;
      // const formattedDate = moment.tz('Asia/Karachi').format('YYYY-MM-DD HH:mm:ss');

      // Send email with the reset link
      const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: "smartattendance1@hotmail.com",
          pass: "Fypproject",
        },
      });

      await transporter.sendMail({
        from: "smartattendance1@hotmail.com",
        to: email,
        subject: "Password Reset Link",
        html: `Click <a href="${resetLink}">here</a> to reset your password.`,
      });

      return;
    } catch (e) {
      console.error(e.message);
      return "Failed to send reset link. Please try again later.";
    }
  }

  // static async validateResetPasswordToken(token) {
  //   try {
  //     // Retrieve token object from the database
  //     const tokenObject = await StudentTokenService.getStudentToken(token);

  //     // Check if the token object exists and is valid
  //     if (tokenObject) {
  //       // Additional validation checks can be performed here if needed
  //       return true; // Token is valid
  //     } else {
  //       return false; // Token is invalid or expired
  //     }
  //   } catch (error) {
  //     console.error("Error validating reset password token:", error);
  //     return false;
  //   }
  // }

  static async getAllStudentForAdmin() {
    try {
      const [existingStudent, existingFaceIds] = await Promise.all([
        StudentDAO.getAllStudent(),
        FaceIdDAO.getAllFaceIdFromDB(),
      ]);
  
      if (!existingStudent) {
        return "No student available.";
      } else {
        existingStudent.forEach(student => {
          const matchingFaceId = existingFaceIds.find(faceId => faceId.studentId === student._id.toString());
          student.registered_face = !!matchingFaceId;
        });
        
        return existingStudent;
      }
    } catch (e) {
      return e.message;
    }
  }
  

  static async deleteStudent(_id) {
    try {
      const resultObject = await StudentDAO.deleteStudentFromDB(_id);
      return resultObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
}
