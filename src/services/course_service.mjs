import CourseDAO from "../data/course_dao.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import { ObjectId } from 'mongodb';

export default class CourseService {
  static async connectDatabase(client) {
    try {
      await CourseDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addCourse(courseCode, courseName, courseCredHrs) {
    try {
      const existingCourse = await CourseDAO.getCourseByCoursCodeFromDB(
        courseCode
      );
      if (existingCourse) {
        return "Course with this code already exists";
      }

      const createdOn = new Date();
      const deletedOn = null;

      const courseDocument = {
        courseCode: courseCode,
        courseName: courseName,
        courseCredHrs: courseCredHrs,
        courseTeacher: null,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedCourse = await CourseDAO.addCourseToDB(courseDocument);

      return { course: addedCourse };
    } catch (e) {
      return e.message;
    }
  }

  static async getCourseByID(courseId) {
    try {
      const existingCourse = await CourseDAO.getCourseByIDFromDB(courseId);
      if (!existingCourse) {
        return "No course found for this ID";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateCourseDetails(
    courseId,
    courseCode,
    courseName,
    courseCredHrs,
    courseTeacher
  ) {
    try {
      const existingCourse = await CourseDAO.getCourseByIDFromDB(courseId);
      if (!existingCourse) {
        return "No course found for this ID";
      }

      if (courseCode != existingCourse.courseCode) {
        const existingCourseCheck2 = await CourseDAO.getCourseByCoursCodeFromDB(
          courseCode
        );
        if (existingCourseCheck2) {
          return "Course with this code already exists";
        }
      }

      if (courseCode) {
        existingCourse.courseCode = courseCode;
      }

      if (courseName) {
        const courseNameCheck = PatternUtil.checkAlphabeticName(courseName);
        if (!courseNameCheck) {
          return "Course name can not contain numbers and special characters";
        } else {
          existingCourse.courseName = courseName;
        }
      }

      if (courseCredHrs) {
        existingCourse.courseCredHrs = courseCredHrs;
      }

      if (courseTeacher) {
        existingCourse.courseTeacher = courseTeacher;
      }

      const updateResult = await CourseDAO.updateCourseInDB(existingCourse);

      if (updateResult) {
        return {};
      } else {
        return "Failed to update course details";
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getAllCourseForAdmin() {
    try {
      const existingCourse = await CourseDAO.getAllCourse();
      if (!existingCourse) {
        return "No Course available.";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async deleteCourse(_id) {
    try {
      const resultObject = await CourseDAO.deleteCourseFromDB(_id);
      return resultObject;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
}
