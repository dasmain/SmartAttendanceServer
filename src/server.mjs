import express from "express";
import cors from "cors";
import adminroutes from "./routes/admin_routes.mjs";
import parentroutes from "./routes/parent_routes.mjs";
import studentroutes from "./routes/student_routes.mjs";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", adminroutes);
app.use("/api/v1", parentroutes);
app.use("/api/v1", studentroutes);

app.use("*", (req, res) => res.status(404).json({ Error: "Not Found" }));

export default app;
