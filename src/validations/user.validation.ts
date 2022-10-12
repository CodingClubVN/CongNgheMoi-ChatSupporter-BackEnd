import { Injectable } from "@nestjs/common";
import { UserCreateDto } from "../dto";
import { UserRepository } from "../repositories";

@Injectable({})
export class UserValidation {
    constructor(private userRepository: UserRepository){}

    async checkValidateCreateUser(userReq: UserCreateDto) {
        const userCheckUsername = await this.userRepository.findByEmailOrEmail(userReq.email, userReq.account.username);
        if (userCheckUsername.length) {
            return 'username or email exists!';
        }
        return '';
    }
}