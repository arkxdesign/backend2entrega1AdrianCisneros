import { authenticate } from "../middlewares/auth.middleware.js";
import { carritoModel } from "../models/carrito.model.js";
import { userModel } from "../models/user.models.js";
import { Router } from "express";

const router = Router();

router.get("/", authenticate, async (req, res) => {
    try {
        const carts = await carritoModel.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }   
});

router.post("/",authenticate, async (req, res) => {
    try {
        const newCart = new carritoModel(req.body);
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post("/:idUser/cart/:idCart",authenticate, async (req, res) => {
    const { idUser, idCart } = req.params;
    try {
        const cart = await carritoModel.findById(idCart);
        const user = await userModel.findById(idUser);
        user.cart = cart;
        await user.save();
        res.status(200).json({user, message: "Carrito agregado al usuario"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});    

export default router