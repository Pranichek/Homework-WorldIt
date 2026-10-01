import type { Task } from "../../domain/task/entity.js";
import type { TaskFilters } from "../../domain/task/repository.js";

export interface TaskService {
    createTask(data: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task | undefined>
    getTasks(filters: TaskFilters): Promise<Task[]>
    getTask(id: number): Promise<Task | undefined>
    updateTask(id: number, changes: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Task | undefined>
    deleteTask(id: number): Promise<boolean>
}