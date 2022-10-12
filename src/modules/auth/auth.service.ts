import { Injectable } from "@nestjs/common";
import { LoginRequestDto, UserCreateDto } from "../../dto";
import { UserRepository } from "../../repositories/user.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable({})
export class AuthService {

    constructor(private userRepository: UserRepository, private jwtService: JwtService){}

    async login(account: LoginRequestDto) {
        const user = await this.userRepository.findOneByUsername(account.username);
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(account.password, user.account.password);

        if (isMatch) {
            const payload = {userId: user.id}
            const token= this.generateToken(payload);

            return {token};
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