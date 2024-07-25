import { Router } from "express";
import { userModel } from "../models/user.models.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get("/:id", authenticate, async (req, res) => {
    const {id} = req.params;
    try {
        const user = await userModel.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;