import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(express.json({limit: '100mb'}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

export default app;