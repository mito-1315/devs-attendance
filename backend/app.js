import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./routes/index.js";

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ---------- Routes ---------- */
app.use("/api", routes);


export default app;
