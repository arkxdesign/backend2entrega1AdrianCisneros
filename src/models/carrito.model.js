import { Schema, model } from "mongoose";

export const carritoCollectionName = "carritos";    

const CartsSchema = new Schema({
    timestamp: {
        type: Number,
        default: Date.now(),
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
});

export const carritoModel = model(carritoCollectionName, CartsSchema)