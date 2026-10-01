// import type — тільки тип Task.
import type { Task } from "./entity.js"

export interface TaskFilters {
    userId?: number | undefined
    status?: string | undefined
    priority?: string | undefined
}

export interface TaskRepository {
    findAll(filters: TaskFilters): Promise<Task[]>
    findById(id: number): Promise<Task | undefined>
    create(data: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task>
    update(id: number, changes: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Task | undefined>
    delete(id: number): Promise<boolean>
}