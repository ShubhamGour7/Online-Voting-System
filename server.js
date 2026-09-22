import "dotenv/config";
import {db} from "./db.js"
import {user} from "./models/user.model.js";
import express from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({ limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb"}));
app.use(express.static("public"));

const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()} Request made to : ${req.originalUrl}] `);   // It prints when the request was made and which URL was requested.
    next(); //Move on to the next phase
};

app.use(logRequest);


// const PORT = process.env.PORT || 3000

app.get("/log", (req,res) => {
    res.send("Hii there!!")
})

//Import the routes files
import router from "./routes/userRoutes.js";
import routers from "./routes/candidateRoutes.js";

// Use the routes
app.use('/user', router);
app.use('/candidate',routers);



app.listen(PORT, "0.0.0.0" ,() => {
    console.log(`App running on port: ${PORT}`);
});

