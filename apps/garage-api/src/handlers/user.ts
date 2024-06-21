import { Handler, HttpVerb } from "@garage/ts-express-api";
import { AuthTokenPayload, UserLookupInputModel, UserLookupResponseModel } from "../models";
// import { ValidationChain, query } from "express-validator";
import { param } from "express-validator";
import { PrismaClient } from '@prisma/client'
import { User, UserRepository } from "@garage/database";




export class UserHandler extends Handler <
 UserLookupInputModel,
 UserLookupResponseModel,
 AuthTokenPayload
> {
    readonly method: HttpVerb = "get";
    readonly path: string = "/user/:UserId";
    validations = [param("UserId").trim()];
    override requiresAuth = false;
    prisma = new PrismaClient()

    async handler({UserId}: UserLookupInputModel, auth: AuthTokenPayload): Promise<UserLookupResponseModel> {
        const test = new UserRepository();
        const user: User = await test.findByEmail("vishalp83@gmail.com");

        // const user = await this.prisma.user.findUnique({
        //     where: {email: "vishalp83@gmail.com"},
        //     // include: {
        //     //     vehicles: true,
        //     //     mods: true,
        //     //     glove_box: true
        //     // }
        // })

        console.log(user);

        if(user) {
            return {
                UserId: user.id.toString(),
                FirstName: user.first_name,
                LastName: user.last_name ?? ""
            }
        } else {
            return {
                UserId: "",
                FirstName: "",
                LastName: ""
            }
        }
    }

}