import { Router } from "express";
import usersApi from "../config/users.routes";

const router = Router();
router.use("/users/v1", usersApi);
export default router;