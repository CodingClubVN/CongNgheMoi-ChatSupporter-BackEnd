import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../repositories";

@Injectable({})
export class UserService {

    constructor(private userRepository: UserRepository){}

    async findById(userId: string) {
        return await this.userRepository.findById(userId);
    }
  
    
}