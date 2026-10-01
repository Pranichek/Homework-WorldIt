import type { User } from "../domain/user/entity.js";
import type { UserRepository } from "../domain/user/repository.js";
import { readJsonFile, writeJsonFile } from "../storage/json-file.js";

const FILE_PATH = "data/users.json"

export function createUserRepository(): UserRepository{
    return{
        async findById(id){
            const users = await readJsonFile<User>(FILE_PATH)
            const foundUser: User | undefined = users.find((user) => user.id === id)
            return foundUser
        },

        async findByEmail(email){
            const users = await readJsonFile<User>(FILE_PATH);
            const foundUser: User | undefined = users.find((user) => user.email === email)
            return foundUser
        },

        async create(data){
            const users : User[] = await readJsonFile<User>(FILE_PATH);

            const newUser: User = {
                id: users.length + 1,
                ...data,
                createdAt: new Date()
            }

            const updatedUsers = [...users, newUser]
            await writeJsonFile(FILE_PATH, updatedUsers)

            return newUser
        }
    }
}