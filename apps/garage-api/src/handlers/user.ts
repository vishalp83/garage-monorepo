import { Handler, HttpVerb } from "@garage/api/ts-express-api";
import { AuthTokenPayload, UserLookupInputModel, UserLookupResponseModel } from "../models";
import { ValidationChain } from "express-validator";
import { param, query } from "express-validator";




export class UserHandler extends Handler <
 UserLookupInputModel,
 UserLookupResponseModel,
 AuthTokenPayload
> {
    readonly method: HttpVerb = "get";
    readonly path: string = "/user/:UserId";
    validations = [param("UserId").trim()];
    override requiresAuth = false;

    async handler({UserId}: UserLookupInputModel, auth: AuthTokenPayload): Promise<UserLookupResponseModel> {

        return {
            "UserId": UserId,
            "FirstName": "Vishal",
            "LastName": "Patel" 
        }
    }

}