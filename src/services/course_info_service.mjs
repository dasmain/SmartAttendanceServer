import CourseInfoDAO from "../data/course_info_dao.mjs";

export default class CourseInfoService {
  static async connectDatabase(client) {
    try {
      await CourseInfoDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addCourseInfo(
    courseId,
    studentId,
    total_hours,
    present_hours,
    absent_hours
  ) {
    try {
      const existingUser = await CourseInfoDAO.getCourseInfoByStudentAndCourse(
        courseId,
        studentId
      );
      if (existingUser) {
        return "Course Info for this Student And Course Already Exists!";
      }

      const createdOn = new Date();
      const deletedOn = null;

      const userDocument = {
        courseId: courseId,
        studentId: studentId,
        total_hours: total_hours,
        present_hours: present_hours,
        absent_hours: absent_hours,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedInfoId = await CourseInfoDAO.addCourseInfoToDB(userDocument);

      return { _id: addedInfoId };
    } catch (e) {
      return e.message;
    }
  }

  static async getCourseInfoByCourse(courseId) {
    try {
      const existingCourse = await CourseInfoDAO.getCourseInfoByCourse(
        courseId
      );
      if (!existingCourse) {
        return "No course info found for this courseId";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getCourseInfoByStudent(studentId) {
    try {
      const existingCourse = await CourseInfoDAO.getCourseInfoByStudent(
        studentId
      );
      if (!existingCourse) {
        return "No course info found for this studentId";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async getCourseInfoByCourseAndStudent(courseId, studentId) {
    try {
      const existingCourse =
        await CourseInfoDAO.getCourseInfoByStudentAndCourse(
          courseId,
          studentId
        );
      if (!existingCourse) {
        return "No course info found for this course and student";
      } else {
        return existingCourse;
      }
    } catch (e) {
      return e.message;
    }
  }

  static async updateCourseInfoDetails(
    courseId,
    studentId,
    total_hours,
    present_hours,
    absent_hours
  ) {
    try {
      const existingCourse =
        await CourseInfoDAO.getCourseInfoByStudentAndCourse(
          courseId,
          studentId
        );
      if (!existingCourse) {
        return "No course info found for this student and course";
      }

      // if (courseId) {
      //   existingCourse.courseId = courseId;
      // }

      // if (studentId) {
      //   existingCourse.studentId = studentId;
      // }

      if (total_hours) {
        existingCourse.total_hours = total_hours;
      }

      if (present_hours) {
        existingCourse.present_hours = present_hours;
      }

      if (absent_hours) {
        existingCourse.absent_hours = absent_hours;
      }

      const updateResult = await CourseInfoDAO.update(
        courseId,
        studentId,
        existingCourse
      );

      if (updateResult) {
        return {};
      } else {
        return "Failed to update course info details";
      }
    } catch (e) {
      return e.message;
    }
  }
}
