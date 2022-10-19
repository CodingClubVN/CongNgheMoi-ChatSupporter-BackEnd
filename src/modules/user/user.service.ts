import { Injectable } from "@nestjs/common";
import { FilterParamDto } from "src/dto";
import { UserRepository } from "../../repositories";

@Injectable({})
export class UserService {

    constructor(private userRepository: UserRepository){}

    async findById(userId: string) {
        return await this.userRepository.findById(userId);
    }
    
    async findAll(filters: FilterParamDto) {
        return await this.userRepository.findAll(filters);
    }

}