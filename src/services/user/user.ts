import type { UserRepository } from "../../domain/user/repository.js";
import type { UserService } from "./user.types.js";
import type { User } from "../../domain/user/entity.js";

export function createUserService(userRepository: UserRepository): UserService{
    return{
        async register(data){
            const email: string = data.email.trim()

            const existingUser: User | undefined = await userRepository.findByEmail(email)
            if (existingUser){
                return undefined
            }

            const newUser: User = await userRepository.create({
                name: data.name,
                email: email,
                password: data.password 
            })

            const { password: savedPassword, ...publicUser } = newUser
            return publicUser
        },
        async login(email, password){
            const user: User | undefined = await userRepository.findByEmail(email.trim())
            if (!user || user.password !== password){
                return undefined
            }

            const { password: savedPassword, ...publicUser } = user
            return publicUser
        },
        async getUser(id){
            const user: User | undefined = await userRepository.findById(id)

            if (!user){
                return undefined
            }

            const { password: savedPassword, ...publicUser } = user
            return publicUser
        }
    }
}