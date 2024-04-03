import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";
import FaceIdController from "../controllers/face_id_controller.mjs";

const router = express.Router();

const faceRoute = "/face-id";
//api routes
router
  .route(faceRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware(["studentId", "faceId"]),
    checkTokenMiddleware,
    FaceIdController.apiCreateFaceId
  );

router
  .route(faceRoute + "/details-by-student")
  .get(checkTokenMiddleware, FaceIdController.apiGetFaceIdDetails);

export default router;
