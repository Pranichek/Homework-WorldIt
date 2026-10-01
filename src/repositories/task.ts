import type { Task } from "../domain/task/entity.js";
import type { TaskRepository } from "../domain/task/repository.js";
import { readJsonFile, writeJsonFile } from "../storage/json-file.js";

const FILE_PATH = "data/tasks.json"

export function createTaskRepository(): TaskRepository{
    return {
        async findAll(filters){
            let tasks: Task[] = await readJsonFile<Task>(FILE_PATH)

            if (filters.userId != undefined){
                tasks = tasks.filter((task) => task.userId == filters.userId)
            }

            if (filters.status != undefined){
                tasks = tasks.filter((task) => task.status == filters.status)
            }

            if (filters.priority != undefined){
                tasks = tasks.filter((task) => task.priority == filters.priority)
            }

            return tasks
        },

        async findById(id){
            const tasks: Task[] = await readJsonFile<Task>(FILE_PATH)
            const foundTask: Task | undefined = tasks.find((task) => task.id == id)
            return foundTask
        },

        async create(data){
            const tasks: Task[] = await readJsonFile<Task>(FILE_PATH)
            const lastTask: Task | undefined = tasks[tasks.length - 1]
            let newId: number

            if (lastTask){
                newId = lastTask.id + 1
            }else{
                newId = 1
            }

            const now: string = new Date().toISOString()

            const newTask: Task = {
                id: newId,
                userId: data.userId,
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                createdAt: now,
                updatedAt: now
            }

            tasks.push(newTask)
            await writeJsonFile<Task>(FILE_PATH, tasks)

            return newTask
        },

        async update(id, changes){
            const tasks: Task[] = await readJsonFile<Task>(FILE_PATH)
            const index: number = tasks.findIndex((task) => task.id == id)

            if (index == -1){
                return undefined
            }

            const oldTask: Task | undefined = tasks[index]
            if (!oldTask){
                return undefined
            }

            const updateTask: Task = {
                ...oldTask,
                ...changes,
                updatedAt: new Date().toISOString()
            }

            tasks[index] = updateTask

            await writeJsonFile<Task>(FILE_PATH, tasks)
            return updateTask
        },

        async delete(id){
            const tasks: Task[] = await readJsonFile<Task>(FILE_PATH)
            const anothersTasks: Task[] = tasks.filter((task) => task.id != id)

            if (anothersTasks.length == tasks.length){
                return false
            }

            await writeJsonFile<Task>(FILE_PATH, anothersTasks)
            return true
        }
    }
}