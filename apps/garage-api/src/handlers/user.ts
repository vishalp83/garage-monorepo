import { Handler, HttpVerb } from "@garage/ts-express-api";
import { AuthTokenPayload, UserLookupInputModel, UserLookupResponseModel } from "../models";
// import { ValidationChain, query } from "express-validator";
import { param } from "express-validator";
import { User, UserRepository } from "@garage/database";




export class UserHandler extends Handler <
 UserLookupInputModel,
 UserLookupResponseModel,
 AuthTokenPayload
> {
    readonly method: HttpVerb = "get";
    readonly path: string = "/user/:userId";
    validations = [param("userId").trim()];
    override requiresAuth = false;

    async handler({userId}: UserLookupInputModel, auth: AuthTokenPayload): Promise<UserLookupResponseModel> {
        const test = new UserRepository();
        const user: User = await test.findByEmail("vishalp83@gmail.com");

        if(user) {
            return {
                userId: user.id.toString(),
                firstName: user.first_name,
                lastName: user.last_name ?? ""
            }
        } else {
            return {
                userId: "vishal",
                firstName: "",
                lastName: ""
            }
        }
    }

}