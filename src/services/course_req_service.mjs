import CourseRequestDAO from "../data/course_requests_dao.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import { ObjectId } from "mongodb";

export default class CourseRequestsService {
  static async connectDatabase(client) {
    try {
      await CourseRequestDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addCourseRequest(courseId, studentId, status) {
    try {
      const existingRequest =
        await CourseRequestDAO.getCourseRequestByCourseAndStudent(
          courseId,
          studentId
        );

      if (existingRequest) {
        return "Request already made!";
      }

      const createdOn = new Date();
      const deletedOn = null;

      const courseDocument = {
        courseId: courseId,
        studentId: studentId,
        status: status,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedCourseRequest = await CourseRequestDAO.addCourseRequestToDB(
        courseDocument
      );

      return { course: addedCourseRequest };
    } catch (e) {
      return e.message;
    }
  }

  static async getCourseRequestByID(courseId) {
    try {
      const existingCourse = await CourseRequestDAO.getCourseRequestByIDFromDB(
        courseId
      );
      if (!existingCourse) {
        return "No course request found for this ID";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateCourseDetails(coursereqId, courseId, studentId, status) {
    try {
      const existingCourse = await CourseRequestDAO.getCourseRequestByIDFromDB(
        coursereqId
      );
      if (!existingCourse) {
        return "No course request found for this ID";
      }

      if (courseId) {
        existingCourse.courseId = courseId;
      }

      if (studentId) {
        existingCourse.studentId = studentId;
      }

      if (status) {
        existingCourse.status = status;
      }

      const updateResult = await CourseRequestDAO.updateCourseRequestInDB(
        existingCourse
      );

      if (updateResult) {
        return {};
      } else {
        return "Failed to update course request details";
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getAllCourseRequestForAdmin() {
    try {
      const existingCourse = await CourseRequestDAO.getAllCourseRequest();
      if (!existingCourse) {
        return "No Course Request available.";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async deleteCourseRequest(_id) {
    try {
      const resultObject = await CourseRequestDAO.deleteCourseRequestFromDB(
        _id
      );
      return resultObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  static async getCourseRequestByStudent(studentId) {
    try {
      const existingCourse = await CourseRequestDAO.getCourseRequestByStudent(
        studentId
      );
      if (!existingCourse) {
        return "No course request found for this Student";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }
}
