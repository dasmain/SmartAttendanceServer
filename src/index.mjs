import app from "./server.mjs";
import { MongoClient } from "mongodb";
import appConfig from "./config/app_config.mjs";
import databaseConfig from "./config/database_config.mjs";
import AdminService from "./services/admin_service.mjs";
import TokenService from "./services/token_service.mjs";
import ParentService from "./services/parent_service.mjs";
import ParentTokenService from "./services/parent_token_service.mjs";
import StudentService from "./services/student_service.mjs";
import StudentTokenService from "./services/student_token_service.mjs";
import FacultyService from "./services/faculty_service.mjs";
import FacultyTokenService from "./services/faculty_token_service.mjs";
import CourseService from "./services/course_service.mjs";
import CourseRequestsService from "./services/course_req_service.mjs";
import LeaveService from "./services/leave_service.mjs";
import AttendanceService from "./services/attendance_service.mjs";
import CourseInfoService from "./services/course_info_service.mjs";

// Uncomment to enable https

// import fs from "fs";
// import https from "https";

// const key = fs.readFileSync("private.key");
// const cert = fs.readFileSync("certificate.crt");
// const ca = fs.readFileSync("ca_bundle.crt");

// const cred = {
//   key,
//   cert,
//   ca,
// };

const port = appConfig.server.port;
//const httpPort = appConfig.server.httpsPort;
// const username = encodeURIComponent(databaseConfig.database.username);
// const password = encodeURIComponent(databaseConfig.database.password);

const uri = `mongodb://${databaseConfig.database.host}:${databaseConfig.database.port}/${databaseConfig.database.dbName}`;

//const uri = `mongodb://127.0.0.1:27017/sadb`
//${username}:${password}@

MongoClient.connect(uri, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await AdminService.connectDatabase(client);
    await TokenService.connectDatabase(client);
    await ParentService.connectDatabase(client);
    await ParentTokenService.connectDatabase(client);
    await StudentService.connectDatabase(client);
    await StudentTokenService.connectDatabase(client);
    await FacultyService.connectDatabase(client);
    await FacultyTokenService.connectDatabase(client);
    await CourseService.connectDatabase(client);
    await CourseRequestsService.connectDatabase(client);
    await LeaveService.connectDatabase(client);
    await AttendanceService.connectDatabase(client);
    await CourseInfoService.connectDatabase(client);
    // const httpsServer = https.createServer(cred, app);
    // httpsServer.listen(port, () => {
    //   console.log(`https server listening`);
    // });
    app.listen(port, () => {
      console.log(`http server listening on: ${port}`);
    });
  });
