import type { User } from "../../domain/user/entity.js"

export type PublicUser = Omit<User, "password">
export type CreateUser = Omit<User, "id" | "createdAt">

export interface UserService{
    register(data: CreateUser): Promise<PublicUser | undefined>
    login(email: string, password: string): Promise<PublicUser | undefined>
    getUser(id: number): Promise<PublicUser | undefined>
}