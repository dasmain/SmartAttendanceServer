import FaceIdService from "../services/face_id_service.mjs";
import multer from "multer";
import fs from "fs";
const upload = multer({ dest: "src/files/face_id" });

export default class FaceIdController {
  static async apiCreateFaceId(req, res, next) {
    try {
      upload.single("faceId")(req, res, async function (err) {
        if (err) {
          return res
            .status(500)
            .json({ success: false, data: {}, message: err.message });
        }

        const { studentId } = req.body;

        let faceId = null;

        if (req.file) {
          const fileData = fs.readFileSync(req.file.path);
          faceId = fileData;
          fs.unlinkSync(req.file.path);
        }

        const serviceResponse = await FaceIdService.createFaceId(
          faceId,
          studentId
        );

        if (typeof serviceResponse === "string") {
          res
            .status(200)
            .json({ success: false, data: {}, message: serviceResponse });
        } else {
          res.status(200).json({
            success: true,
            data: serviceResponse,
            message: "Face ID created successfully",
          });
        }
      });
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiGetFaceIdDetails(req, res, next) {
    try {
      const student_id = req.query._id;

      if (!student_id) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "student_id parameter is missing",
        });
      }

      const serviceResponse = await FaceIdService.getFaceIdByStudent(
        student_id
      );

      if (typeof serviceResponse === "string") {
        res.status(200).json({
          success: false,
          data: {},
          message: serviceResponse,
        });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Course details fetched successfully",
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        data: {},
        message: e.message,
      });
    }
  }
}
