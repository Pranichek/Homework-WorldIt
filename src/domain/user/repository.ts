import type { User } from "./entity.js"

export interface UserRepository {
    findById(id: number): Promise<User | undefined>
    findByEmail(email: string): Promise<User | undefined>
    create(data: Omit<User, "id" | "createdAt">): Promise<User>
}