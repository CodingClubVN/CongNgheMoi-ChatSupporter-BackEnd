import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger/dist";
import { Response } from "express";
import { UserCreateDto } from "../../dto/user/user-create.dto";
import { AuthService } from "./auth.service";

@ApiTags('/api/auth')
@Controller('api/auth')
export class AuthController{
    constructor (private authService: AuthService) {}

    @Post('login')
    async login(@Body() userReq: UserCreateDto, @Res() res: Response) {
        try {
            const user = await this.authService.login(userReq);
            return res.status(HttpStatus.OK).json(user);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: error});
        }
    }

    @Post('register')
    register() {
        return {msg: this.authService.register()}
    }
}