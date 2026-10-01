import express from "express";

import { createUserRepository } from "./repositories/user.js";
import { createTaskRepository } from "./repositories/task.js";
import { createUserService } from "./services/user/user.js";
import { createTaskService } from "./services/task/task.js";
import { createUserHandler } from "./transport/handlers/user.js";
import { createTaskHandlers } from "./transport/handlers/task.js";
import { createUserRouter } from "./transport/routers/users.js";
import { createTaskRouter } from "./transport/routers/task.js";

const app = express()
app.use(express.json());

const userRepository = createUserRepository()
const taskRepository = createTaskRepository()
const userService = createUserService(userRepository)
const taskService = createTaskService(taskRepository, userRepository)
const userHandlers = createUserHandler(userService)
const taskHandlers = createTaskHandlers(taskService)
const userRouter = createUserRouter(userHandlers)
const taskRouter = createTaskRouter(taskHandlers)

app.use(userRouter)
app.use("/tasks", taskRouter)

const HOST = "localhost"
const PORT = 8888

app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`);
});