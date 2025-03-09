import mongoose from "mongoose";
import { IPermission } from "../types/permission.type";

const permissionSchema = new mongoose.Schema<IPermission>({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String },
    isBasePermission: { type: Boolean, default: false },
}, { timestamps: true  });

export const model = mongoose.model('permission', permissionSchema);