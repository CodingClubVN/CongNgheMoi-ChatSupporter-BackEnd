import { Injectable } from "@nestjs/common";
import { UserCreateDto } from "../../dto/user/user-create.dto";
import { UserRepository } from "../../repositories/user.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entity/user.entity";
import { Account } from "src/entity/models/account.model";
import { LoginRequest } from "src/dto/auth/loginRequest.dto";

@Injectable({})
export class AuthService {

    constructor(private userRepository: UserRepository, private jwtService: JwtService){}

    async login(account: LoginRequest) {
        const user = await this.userRepository.findOneByUsername(account.username);
        const isMatch = await bcrypt.compare(account.password, user.account.password);

        if (isMatch) {
            const payload = {userId: user.id}
            const accessToken= this.generateToken(payload);

            return {accessToken};
        }else {
            return null;
        }
    }

    async register(user: UserCreateDto) {
        user.account.password = await this.generatePassword(user.account.password);
        const newUser = await this.userRepository.createUser(user);

        return newUser;
    }

    private async generatePassword(plainPassword: string) {
        const saltOrRounds = 10;
        const password = await bcrypt.hash(plainPassword, saltOrRounds);

        return password;
    }

    private generateToken(payload: any): string {
        return this.jwtService.sign(payload);
    }
}