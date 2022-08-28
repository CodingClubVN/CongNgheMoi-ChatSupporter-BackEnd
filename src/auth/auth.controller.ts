import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";


@Controller('api/auth')
export class AuthController{
    constructor (private authService: AuthService) {}

    @Post('login')
    login() {
        return {msg: this.authService.login()}
    }

    @Post('register')
    register() {
        return {msg: this.authService.register()}
    }
}