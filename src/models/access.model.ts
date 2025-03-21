import mongoose from "mongoose";
import { access, AccessTypes } from "../types/access.type";

const schema = new mongoose.Schema<access>({
    workspace_id: {type: mongoose.Schema.Types.ObjectId, ref: 'workspaces', require},
    user_id:  {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    access_level: {type: String, enum: AccessTypes, require},
    accepted: {type: Boolean, require, default: false},
    email: { type: String },
    default: {type: Boolean},
    date_joined: {type: Date, default: Date.now}
}, { timestamps: true });

export const model = mongoose.model('workspace_access', schema);