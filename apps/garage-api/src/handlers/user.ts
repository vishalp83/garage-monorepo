import { Handler, HttpVerb } from "@garage/ts-express-api";
import { AuthTokenPayload, UserLookupInputModel, UserLookupResponseModel } from "../models";
// import { ValidationChain, query } from "express-validator";
import { param } from "express-validator";
import { User, UserRepository } from "@garage/database";


/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *       properties:
 *         id:
 *           type: int
 *           description: The auto-generated id of the book
 *         firstName:
 *           type: string
 *           description: User's First Name
 *         lastName:
 *           type: string
 *           description: User's Last Name
 *       example:
 *         id: d5fE_asz
 *         firstName: John
 *         lastName: Doe
 */



/**
 * @openapi
 * tags:
 *   name: User
 *   description: User enpoints allow you to get and modify users.
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get user info for given id
 *     description: longer description when box is open
 *     responses:
 *       200:
 *         description: Returns a User Object.
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
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