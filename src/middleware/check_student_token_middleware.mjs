import StudentService from "../services/student_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

const checkStudentTokenMiddleware = async (req, res, next) => {
  let token = req.headers["authorization"];
  //console.log(req.headers);
  let errorMessage;
  let tokenObject;

  const isTokenInCorrectForm = TokenUtil.checkTokenStructure(token);

  if (!isTokenInCorrectForm) {
    errorMessage = "Token missing in the Authorization header";
  } else {
    const decoded = TokenUtil.decodeTokenData(token);

    if (decoded) {
      tokenObject = await TokenUtil.getStudentDataFromToken(token);
      if (!tokenObject) {
        errorMessage = "Malformed or unknown token in the header";
      } else {
        //const userObject = await UserService.getUserByID(tokenObject.user_id);

        if (tokenObject.role !== "student") {
          errorMessage =
            "You do not have the permissions to perform this operation";
        }
      }
    } else {
      errorMessage = "Malformed or unknown token in the header";
    }
  }

  if (errorMessage) {
    return res.status(401).json({
      success: false,
      data: {},
      message: errorMessage,
    });
  }
  next();
};

export default checkStudentTokenMiddleware;
