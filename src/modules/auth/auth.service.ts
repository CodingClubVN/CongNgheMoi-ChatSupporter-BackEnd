import { Injectable } from "@nestjs/common";
import { UserCreateDto } from "../../dto/user/user-create.dto";
import { UserRepository } from "../../repositories/user.repository";

@Injectable({})
export class AuthService {

    constructor(private userRepository: UserRepository){}

    async login(user: UserCreateDto) {
        return await this.userRepository.createUser(user);
    }

    register(): string {
        return "register";
    }
}