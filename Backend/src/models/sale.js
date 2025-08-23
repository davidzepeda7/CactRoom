import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: String,
            quantity: { type: Number, required: true },
            price: Number
        }
    ],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Sale", saleSchema);
