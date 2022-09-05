import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger/dist";
import { Response } from "express";
import { LoginRequest } from "../../dto/auth/loginRequest.dto";
import { UserCreateDto } from "../../dto/user/user-create.dto";
import { AuthService } from "./auth.service";

@ApiTags('/api/auth')
@Controller('api/auth')
export class AuthController{
    constructor (private authService: AuthService) {}

    @Post('login')
    async login(@Body() loginReq: LoginRequest, @Res() res: Response) {
        const response = await this.authService.login(loginReq);

        if (response !== null){
            return res.status(HttpStatus.OK).json(response);
        }else {
            return res.status(HttpStatus.BAD_REQUEST).json({message: 'Email or password is incorrect!'});
        }
    }

    @Post('register')
    async register(@Body() userReq: UserCreateDto,  @Res() res: Response) : Promise<any>{
        const newUser =  await this.authService.register(userReq);

        return res.status(200).json(newUser);
    }
}
