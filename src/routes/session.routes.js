import { Router } from "express";
import { userModel } from "../models/user.models.js";
import { createHash } from "../utils/hash.js";
import { verifyToken, generateToken } from "../utils/jwt.js";
import { authenticate, denegate } from "../middlewares/auth.middleware.js";
import passport from "passport";


const router = Router();

router.post("/login",denegate, passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/login-error" }), async (req, res) => {

    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const payload = {
        email: req.user.email,
        role: req.user.role
    }

    const token = generateToken(payload);
    let visitCount = req.cookies.visitCount ? parseInt(req.cookies.visitCount) : 0;
    visitCount += 1;

    res.cookie('visitCount', visitCount, { maxAge: 100000, httpOnly: true });
    res.cookie("currentUser", token, { maxAge: 190000, httpOnly: true });
    res.status(200).json({ message: "Login exitoso" });
});

router.get("/login-error", (req, res) => {
    res.status(401).json({ error: "Unauthorized" });
});


router.get("/current",authenticate, async (req, res) => {
    const token = req.cookies.currentUser;
    if (!token) {
        return res.status(401).json({ error: "No autorizado" });
    }
    try {
        const user = verifyToken(token);
        const userDB = await userModel.findOne({ email: user.email });
        if (!userDB) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }
        const userAuth = { first_name: userDB.first_name, last_name: userDB.last_name, email: userDB.email, role: userDB.role };
        res.status(200).json(userAuth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, role, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ error: "Todos los campos <first_name, last_name, email, age, password> son obligatorios" });
    }
    try {
        const hashPassword = await createHash(password);
        const user = await userModel.create({ first_name, last_name, email, age, password: hashPassword, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al crear usuario", message: error.message });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("currentUser");
    res.clearCookie("visitCount");
    res.clearCookie("CountFailedSuccess");
    res.status(200).json({ message: "Logout exitoso" });
});

export default router