import { Injectable } from "@nestjs/common";
import { FilterParamDto, UserUpdateDto } from "src/dto";
import { UserRepository } from "../../repositories";

@Injectable({})
export class UserService {

    constructor(private userRepository: UserRepository) { }

    async findById(userId: string) {
        return await this.userRepository.findById(userId);
    }

    async findAll(filters: FilterParamDto) {
        return await this.userRepository.findAll(filters);
    }

    async updateUserProfile(userId: string, user: UserUpdateDto) {
        return await this.userRepository.updateUserProfile(userId, user);
    }
}