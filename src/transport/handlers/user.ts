import type { UserService } from "../../services/user/user.types.js";
import type { Request, Response } from "express";
import type { UserResponse } from "../dto/user/responses.js";
import type { ErrorDto } from "../dto/errors.js";
import type { LoginBody, RegisterBody, UserParams } from "../dto/user/requests.js";

export interface UserHandler{
    register(req: Request<{}, UserResponse | ErrorDto, RegisterBody>,  res: Response<UserResponse | ErrorDto>): Promise<void>,
    login(req: Request<{}, UserResponse | ErrorDto, LoginBody>,  res: Response<UserResponse | ErrorDto>): Promise<void>,
    getUser(req: Request<UserParams>, res: Response<UserResponse | ErrorDto>): Promise<void>
}

export function createUserHandler(userService: UserService): UserHandler{
    return{
        async register(req, res){
            const { name, email, password } = req.body;

            if(
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
            ){ 
                res.status(400).json({
                    message: "invalid data"
                })
                return 
            }
            const user = await userService.register({
                name: name.trim(),
                email: email.trim(),
                password: password
            });

            if (!user) {
                res.status(409).json({
                    message: "Користувач з такою поштою вже є"
                });
                return;
            }
            
            
            res.status(201).json(user)
            return 
            
        },
        async login(req, res) {
            const { email, password } = req.body;

            if (
                typeof email !== "string" ||
                typeof password !== "string" ||
                !email.trim() ||
                !password
            ){
                res.status(400).json({
                    message: "Invalid email or password"
                });
                return 
                
            }

            const user = await userService.login(
                email.trim(),
                password
            );

            if(!user){
                res.status(401).json({
                    message: "Invalid email or password"
                });
                return
            }
            
            res.status(200).json(user)
            return
         
        },

        async getUser(req, res){
            const id = Number(req.params.id)
            
            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({
                    message: "Invalid user id"
                })
                return 
            }

            const user = await userService.getUser(id)

            if(!user){
                 res.status(404).json({
                    message: "user not found"
                })

                return
            }

            res.status(200).json(user)
            return 
        }
    }
}