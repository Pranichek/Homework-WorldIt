import type { TaskRepository } from "../../domain/task/repository.js"
import type { UserRepository } from "../../domain/user/repository.js"
import type { TaskService } from "./task.types.js"

export function createTaskService(taskRepository: TaskRepository, userRepository: UserRepository): TaskService {
    return {
        async createTask(data) {
            const user = await userRepository.findById(data.userId)
            if (!user) {
                return undefined
            }

            const newTask = await taskRepository.create(data)
            return newTask
        },

        getTasks(filters) {
            return taskRepository.findAll(filters)
        },

        getTask(id) {
            return taskRepository.findById(id)
        },

        updateTask(id, changes) {
            return taskRepository.update(id, changes)
        },

        deleteTask(id) {
            return taskRepository.delete(id)
        },
    }
}