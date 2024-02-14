import FacultyDAO from "../data/faculty_dao.mjs";
import AuthUtil from "../utility/auth_util.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import TokenUtil from "../utility/token_util.mjs";
import FacultyTokenService from "./faculty_token_service.mjs";


export default class FacultyService {
  static async connectDatabase(client) {
    try {
      await FacultyDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addFaculty(firstName, lastName, username, email, password, contactno, isStudentAdvisor) {
    try {
      const existingFaculty = await FacultyDAO.getFacultyByEmailFromDB(email);
      if (existingFaculty) {
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

      const facultyDocument = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email:email,
        password: hashedPassword,
        contactno: contactno,
        isStudentAdvisor: isStudentAdvisor,
        role: "faculty",
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedFacultyId = await FacultyDAO.addFacultyToDB(facultyDocument);
      const faculty = await FacultyDAO.getFacultyByIDFromDB(addedFacultyId);
      const filteredFaculty = PatternUtil.filterParametersFromObject(faculty, [
        "_id",
        "password",
        "role",
      ]);

      return { faculty: filteredFaculty };
    } catch (e) {
      return e.message;
    }
  }

  static async signInFaculty(email, password) {
    try {
      const existingFaculty = await FacultyDAO.getFacultyByEmailFromDB(email);
      if (!existingFaculty) {
        return "Either your email or password is incorrect";
      }
      const passwordCheck = await AuthUtil.comparePasswords(
        password,
        existingFaculty.password
      );
      if (!passwordCheck) {
        return "Either your email or password is incorrect";
      }
      const signedInOn = new Date();
      const tokenPayload = {
        _id: existingFaculty._id.toString(),
        email: existingFaculty.email,
        role: existingFaculty.role,
        signedInOn: signedInOn,
      };
      // Here you can create and return a token if needed
      const tokenString = await FacultyTokenService.createFacultyToken(tokenPayload);
      const filteredFaculty = PatternUtil.filterParametersFromObject(existingFaculty, [
        "_id",
        "password",
        "role",
      ]);

      return {
        token: tokenString,
        signed_in_on: signedInOn,
        faculty: filteredFaculty,
      };
    } catch (e) {
      return e.message;
    }
  }
  static async signOutFaculty(token) {
    try {
      const cleanedToken = TokenUtil.cleanToken(token);
      const deleteToken = await FacultyTokenService.deleteFacultyToken(cleanedToken);

      return deleteToken;
    } catch (e) {
      return e.message;
    }
  }
 

  static async getFacultyByID(facultyId) {
    try {
      const existingFaculty = await FacultyDAO.getFacultyByIDFromDB(facultyId);
      if (!existingFaculty) {
        return "No user found for this ID";
      } else {
        return existingFaculty;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getFacultyAccountDetails(facultyId) {
    try {
      const existingFaculty = await FacultyDAO.getFacultyByIDFromDB(facultyId);
      if (!existingFaculty) {
        return "No user found for this ID";
      } else {
        const filteredFaculty = PatternUtil.filterParametersFromObject(
          existingFaculty,
          ["password","role"]
        );

        return { user: filteredFaculty };
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateFacultyAccountPassword(facultyId, oldPassword, newPassword) {
    try {
      const existingFaculty = await FacultyDAO.getFacultyByIDFromDB(facultyId);
      if (!existingFaculty) {
        return "No user found for this ID";
      }

      const passwordCheck = await AuthUtil.comparePasswords(
        oldPassword,
        existingFaculty.password
      );

      if (!passwordCheck) {
        return "Incorrect password entered";
      }

      const newPasswordCheck = PatternUtil.checkPasswordLength(newPassword);
      if (!newPasswordCheck) {
        return "Password's length should be greater than 8 characters";
      }
      const hashedPassword = await AuthUtil.hashPassword(newPassword);
      const updateResult = await FacultyDAO.updateFacultyPasswordInDB(
        existingFaculty.email,
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

  static async updateFacultyAccountDetails(facultyId, firstName, lastName, username,email, contactno, isStudentAdvisor) {
    try {
      const existingFaculty = await FacultyDAO.getFacultyByIDFromDB(facultyId);
      if (!existingFaculty) {
        return "No user found for this ID";
      }
  
      if (firstName) {
        const firstNameCheck = PatternUtil.checkAlphabeticName(firstName);
        if (!firstNameCheck) {
          return "First name can not contain numbers and special characters";
        } else {
          existingFaculty.firstName = firstName;
        }
      }
  
      if (lastName) {
        const lastNameCheck = PatternUtil.checkAlphabeticName(lastName);
        if (!lastNameCheck) {
          return "Last name can not contain numbers and special characters";
        } else {
          existingFaculty.lastName = lastName;
        }
      }
      
      if (username) {
        existingFaculty.username = username;
      }
  
      if (email) {
        existingFaculty.email = email;
      }
  
      if (contactno) {
        existingFaculty.contactno = contactno;
      }

      if (isStudentAdvisor) {
        existingFaculty.isStudentAdvisor = isStudentAdvisor;
      }
  
      const updateResult = await FacultyDAO.updateFacultyAccountInDB(existingFaculty);
  
      if (updateResult) {
        return {};
      } else {
        return "Failed to update account details";
      }
    } catch (e) {
      return e.message;
    }
  }
  
  static async getAllFacultyForAdmin() {
    try {
      const existingFaculty = await FacultyDAO.getAllFaculty();
      if (!existingFaculty) {
        return "No faculty available.";
      } else {
        return existingFaculty;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async deleteFaculty(_id) {
    try {
      const resultObject = await FacultyDAO.deleteFacultyFromDB(_id);
      return resultObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

}
