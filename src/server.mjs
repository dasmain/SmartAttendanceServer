import express from "express";
import cors from "cors";
import adminroutes from "./routes/admin_routes.mjs";
import parentroutes from "./routes/parent_routes.mjs";
import studentroutes from "./routes/student_routes.mjs";
import facultyroutes from "./routes/faculty_routes.mjs";
import courseroutes from "./routes/course_routes.mjs";
import coursereqroutes from "./routes/course_requests_routes.mjs";
import leaveroutes from "./routes/leave_routes.mjs";
import attendanceroutes from "./routes/attendance_routes.mjs";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", adminroutes);
app.use("/api/v1", parentroutes);
app.use("/api/v1", studentroutes);
app.use("/api/v1", facultyroutes);
app.use("/api/v1", courseroutes);
app.use("/api/v1", coursereqroutes);
app.use("/api/v1", leaveroutes);
app.use("/api/v1", attendanceroutes);

app.use("*", (req, res) => res.status(404).json({ Error: "Not Found" }));

export default app;
