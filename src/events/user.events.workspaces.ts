import client from "../clients/axios";
import { FIND_EMAIL_AND_AND_UPDATE_USER_ID } from "../constants/user.constants.urls";
import { findUserByEmailAndUpdateIdEvent } from "../types/confirm.type"

export const workspaceClient = (auth: string)=>{
    return client(process.env.WORKSPACE_SERVICE as string, auth, "application/json")
}

export const findByEmailAndUpdateId = async (payload: findUserByEmailAndUpdateIdEvent) => {
    try {
        const { email, user_id, auth } = payload;

        return await workspaceClient(auth).post(FIND_EMAIL_AND_AND_UPDATE_USER_ID, {email, user_id});

    } catch (e) {
        console.log(e);
    }
}

