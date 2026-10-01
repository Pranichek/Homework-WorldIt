import type { Request, Response } from "express"
import type { Task } from "../../domain/task/entity.js"
import type { TaskFilters } from "../../domain/task/repository.js"
import type { TaskService } from "../../services/task/task.types.js"
import type { CreateTaskBody, UpdateTaskBody, TaskParams, GetTasksQuery } from "../dto/task/requests.js"
import type { TaskResponse } from "../dto/task/responses.js"
import type { ErrorDto } from "../dto/errors.js"

export interface TaskHandlers {
    createTask(req: Request<{}, TaskResponse | ErrorDto, CreateTaskBody>,res: Response<TaskResponse | ErrorDto>): Promise<void>
    getTasks(req: Request<{}, TaskResponse[] | ErrorDto, {}, GetTasksQuery>,res: Response<TaskResponse[] | ErrorDto>): Promise<void>
    getTask(req: Request<TaskParams>,res: Response<TaskResponse | ErrorDto>): Promise<void>
    updateTask(req: Request<TaskParams, TaskResponse | ErrorDto, UpdateTaskBody>, res: Response<TaskResponse | ErrorDto>): Promise<void>
    deleteTask(req: Request<TaskParams>, res: Response<ErrorDto>): Promise<void>
}

const TASK_STATUSES: string[] = ["todo", "in_progress", "done"]
const TASK_PRIORITIES: string[] = ["low", "medium", "high"]



export function createTaskHandlers(taskService: TaskService): TaskHandlers {
    return {
        async createTask(req, res) {
            const { userId, title, description, status, priority } = req.body

            if (typeof userId != "number" || !Number.isInteger(userId) || userId <= 0) {
                res.status(422).json({ message: "userId повинен бути додатнім числом" })
                return
            }
            if (typeof title != "string" || title.trim() === "") {
                res.status(422).json({ message: "title обов'язковий" })
                return
            }

            if (description != undefined && typeof description != "string") {
                res.status(422).json({ message: "description повинен бути строкою" })
                return
            }

            if (status != undefined && !TASK_STATUSES.includes(status)) {
                res.status(422).json({ message: "status може бути тільки todo, in_progress, done" })
                return
            }

            if (priority != undefined && !TASK_PRIORITIES.includes(priority)) {
                res.status(422).json({ message: "priority може бути тільки low, medium, high" })
                return
            }

            let finalDescription: string = ""
            let finalStatus: string = "todo"
            let finalPriority: string = "medium"

            if (description != undefined) {
                finalDescription = description
            }
    
            if (status != undefined) {
                finalStatus = status
            }
            
            if (priority != undefined) {
                finalPriority = priority
            }

            try {
                const newTask = await taskService.createTask({
                    userId: userId,
                    title: title,
                    description: finalDescription,
                    status: finalStatus,
                    priority: finalPriority,
                })

                if (!newTask) {
                    res.status(404).json({ message: "користувача з таким айді не існує" })
                    return
                }

                res.status(201).json(newTask)
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },

        async getTasks(req, res) {
            const { userId, status, priority } = req.query
            const filters: TaskFilters = {}

            if (userId != undefined) {
                const userIdNumber: number = Number(userId)
                if (!Number.isInteger(userIdNumber) || userIdNumber <= 0) {
                    res.status(422).json({ message: "userId повинен бути додатнім числом" })
                    return
                }
                filters.userId = userIdNumber
            }
            if (status != undefined) {
                if (typeof status != "string" || !TASK_STATUSES.includes(status)) {
                    res.status(422).json({ message: "status може бути тільки todo, in_progress, done" })
                    return
                }
                filters.status = status
            }

            if (priority != undefined) {
                if (typeof priority != "string" || !TASK_PRIORITIES.includes(priority)) {
                    res.status(422).json({ message: "priority може бути тільки low, medium, high" })
                    return
                }
                filters.priority = priority

            }

            try {
                const tasks = await taskService.getTasks(filters)
                res.status(200).json(tasks)
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },

        async getTask(req, res) {
            const id: number = Number(req.params.id)
            if (!Number.isInteger(id) || id <= 0) {
                res.status(422).json({ message: "id повинен бути додатнім числом" })
                return
            }

            try {
                const task = await taskService.getTask(id)

                if (!task) {
                    res.status(404).json({ message: "завдання не знайдено" })
                    return
                }

                res.status(200).json(task)
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },

        async updateTask(req, res) {
            const id: number = Number(req.params.id)
            if (!Number.isInteger(id) || id <= 0) {
                res.status(422).json({ message: "id повинен бути додатнім числом" })
                return
            }

            const { title, description, status, priority } = req.body

            if (title === undefined && description === undefined && status === undefined && priority === undefined) {
                res.status(422).json({ message: "передайте хоча б одне поле" })
                return
            }
            
            const changes: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">> = {}

            if (title != undefined) {
                if (typeof title != "string" || title.trim() == "") {
                    res.status(422).json({ message: "title не може бути пустим" })
                    return
                }
                changes.title = title
            }

            if (description != undefined) {
                if (typeof description != "string") {
                    res.status(422).json({ message: "description повинен бути рядком" })
                    return
                }
                changes.description = description
            }

            if (status != undefined) {
                if (!TASK_STATUSES.includes(status)) {
                    res.status(422).json({ message: "status може бути тільки todo, in_progress, done" })
                    return
                }
                changes.status = status
            }

            if (priority != undefined) {
                if (!TASK_PRIORITIES.includes(priority)) {
                    res.status(422).json({ message: "priority може бути тільки low, medium, high" })
                    return
                }
                changes.priority = priority
            }

            try {
                const updatedTask = await taskService.updateTask(id, changes)

                if (!updatedTask) {
                    res.status(404).json({ message: "Задачу не знайдено" })
                    return
                }

                res.status(200).json(updatedTask)
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },

        async deleteTask(req, res) {
            const id: number = Number(req.params.id)
            if (!Number.isInteger(id) || id <= 0) {
                res.status(422).json({ message: "id повинен бути додатнім" })
                return
            }

            try {
                const deleted = await taskService.deleteTask(id)

                if (!deleted) {
                    res.status(404).json({ message: "задачу не знайдено" })
                    return
                }
                res.status(204).send()
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Internal server error" })
            }
        },
    }
}