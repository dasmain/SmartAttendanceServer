import CourseDAO from "../data/course_dao.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import { ObjectId } from "mongodb";

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
        studentsEnrolled: null,
        courseTeacher: null,
        status: "pending",
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

  static async getCourseByTeacher(courseTeacher) {
    try {
      const existingCourse = await CourseDAO.getCourseByCoureTeacherFromDB(
        courseTeacher
      );
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
    studentsEnrolled,
    courseTeacher
  ) {
    try {
      const existingCourse = await CourseDAO.getCourseByIDFromDB(courseId);
      if (!existingCourse) {
        return "No course found for this ID";
      }

      if (courseCode && courseCode != existingCourse.courseCode) {
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
          existingCourse.courseName = courseName;
      }

      if (courseCredHrs) {
        existingCourse.courseCredHrs = courseCredHrs;
      }

      if (courseTeacher == "N/A") {
        existingCourse.courseTeacher = null;
        existingCourse.status = "pending";
      } else if (courseTeacher) {
        existingCourse.courseTeacher = courseTeacher;
        existingCourse.status = "assigned";
      } else {
        if (!existingCourse.courseTeacher) {
          existingCourse.status = "pending";
        }
      }

      if (studentsEnrolled) {
        existingCourse.studentsEnrolled = studentsEnrolled;
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

  static async updateCourseTeacher(courseId, courseTeacher) {
    try {
      const existingCourse = await CourseDAO.getCourseByIDFromDB(courseId);
      if (!existingCourse) {
        return "No course found for this ID";
      }

      if (courseTeacher) {
        existingCourse.courseTeacher = courseTeacher;

        existingCourse.status = "assigned";
      } else {
        existingCourse.courseTeacher = courseTeacher;
        existingCourse.status = "pending";
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

  static async getCoursesByStudent(studentId) {
    try {
      const existingCourses = await CourseDAO.getStudentCourse(studentId);
      if (!existingCourses) {
        return "No courses found for this student ID";
      } else {
        const filteredCourses = existingCourses.map(course => {
          const { studentsEnrolled, ...courseWithoutStudents } = course;
          return courseWithoutStudents;
        });
        return filteredCourses;
      }
    } catch (e) {
      return e.message;
    }
  }
  
}
