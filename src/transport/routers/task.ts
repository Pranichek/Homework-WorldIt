import { Router } from "express";
import type { TaskHandlers } from "../handlers/task.js";


export function createTaskRouter(handlers: TaskHandlers){
    const router = Router()

    router.post("/", handlers.createTask)
    router.get("/", handlers.getTasks)
    router.get("/:id", handlers.getTask)
    router.patch("/:id", handlers.updateTask)
    router.delete("/:id", handlers.deleteTask)

    return router
}