import passport from "passport";
import local from "passport-local";
import { userModel } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import jwtStrategy from "passport-jwt";
import { comparePassword } from "../utils/hash.js";

const localStrategy = local.Strategy;
const initializePassport = () => {
    // Login Strategy
    passport.use(
        "login",
        new localStrategy({ usernameField: "email", passReqToCallback: true }, async (req, email, password, done) => {
            try {
                const user = await userModel.findOne({email});
                if(!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }
                const isValidPassword = await comparePassword(password, user.password);
                if(!isValidPassword) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }
                return done(null, user);
            } catch (error) {
                done(error);
            }
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
       try {
        const user = await userModel.findById(id);
        done(null, user);
       } catch (error) {
        done(error);
       }
    });
};

export { initializePassport };