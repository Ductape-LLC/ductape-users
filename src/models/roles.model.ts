import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'permission'
    }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

export const model = mongoose.model('role', roleSchema);