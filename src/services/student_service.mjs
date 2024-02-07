import StudentDAO from "../data/student_dao.mjs";
import AuthUtil from "../utility/auth_util.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import TokenUtil from "../utility/token_util.mjs";
import StudentTokenService from "./student_token_service.mjs";

export default class StudentService {
  static async connectDatabase(client) {
    try {
      await StudentDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addStudent(
    username,
    email,
    password,
    contactno
    //studentID
  ) {
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

      const hashedPassword = await AuthUtil.hashPassword(password);
      const createdOn = new Date();
      const deletedOn = null;

      const userDocument = {
        username: username,
        email: email,
        password: hashedPassword,
        contactno: contactno,
        // studentID: studentID,
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
          ["_id", "password", "role"]
        );

        return { user: filteredStudent };
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

  static async updateStudentAccountDetails(
    studentId,
    username,
    email,
    contactno
  ) {
    try {
      const existingStudent = await StudentDAO.getStudentByIDFromDB(studentId);
      if (!existingStudent) {
        return "No user found for this ID";
      }

      if (username) {
        existingStudent.username = username;
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
}
