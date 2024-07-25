import { userModel } from "../models/user.models.js";
import { verifyToken } from "../utils/jwt.js";

export async function authenticate(req, res, next) {
    const token = req.cookies.currentUser;
    if (!token) {
        return res.status(401).json({ error: "No autorizado => ingresa tus credenciales" });
    }
    try {
        const decoded = verifyToken(token);
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        };
        
        req.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario", message: error.message });
    }
}

export async function authorize(req, res, next) {
    console.log(req.user)
    const { role } = req.user;
    if (role === "admin") {
        next();
    }else{
        res.status(401).json({ error: "No autorizado"});
    }
}

export async function denegate(req, res, next) {
    let CountFailedSuccess = req.cookies.CountFailedSuccess ? parseInt(req.cookies.CountFailedSuccess) : 0;
    CountFailedSuccess += 1;
        res.cookie('CountFailedSuccess', CountFailedSuccess, { maxAge: 10000, httpOnly: true });
   
    if (CountFailedSuccess > 3) 
        return res.status(429).json({error: "Tu cuenta ha sido bloqueada por 1.6 minutos"});
        next();
}

