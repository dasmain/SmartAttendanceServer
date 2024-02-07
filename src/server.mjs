import express from "express";
import cors from "cors";
import routes from "./routes/admin_routes.mjs";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.use("*", (req, res) => res.status(404).json({ Error: "Not Found" }));

export default app;
