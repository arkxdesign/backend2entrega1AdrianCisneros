import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import sessionRoutes from "./routes/session.routes.js";
import userRoutes from "./routes/user.routes.js";
import carritotRoutes from "./routes/carrito.routes.js";
import morgan from "morgan";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";

const app = express();
const PORT = 8080; 

// Express config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));

// Passport config
initializePassport();
app.use(passport.initialize());

// Mongoose config
mongoose
    .connect("mongodb://127.0.0.1:27017/afterclass")
    .then(() => {
        console.log("Base de datos conectada a MongoDB", mongoose.connection.host, mongoose.connection.name);
    })
    .catch((error) => {
        console.log(error);
    });

// Routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carrito", carritotRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
})
