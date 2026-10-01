import { Router } from "express";
import type { UserHandler } from "../handlers/user.js";

export function createUserRouter(handlers: UserHandler){
    const router = Router()

    router.post("/auth/register", handlers.register)
    router.post("/auth/login", handlers.login)
    router.get("/users/:id", handlers.getUser)

    return router

}