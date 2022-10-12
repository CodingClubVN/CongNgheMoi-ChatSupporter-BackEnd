import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger/dist";
import { Response } from "express";
import { AuthResponseDto, BadRequestErrorDto, InternalServerErrorDTO, LoginRequestDto, UserCreatedResponse, UserCreateDto } from "../../dto";
import { AuthService } from "./auth.service";


@ApiTags('/api/auth')
@Controller('api/auth')
export class AuthController{
    constructor (private authService: AuthService) {}

    @ApiOkResponse({
        status: 200,
        type:  AuthResponseDto,
        isArray: false
    })
    @ApiResponse({
        status: 400,
        description: 'bad request',
        type:  BadRequestErrorDto,
        isArray: false
    })
    @ApiResponse({
        status: 500,
        description: 'error server',
        type:  InternalServerErrorDTO,
        isArray: false
    })
    @Post('login')
    async login(@Body() loginReq: LoginRequestDto, @Res() res: Response) {
        try {
            const response = await this.authService.login(loginReq);
            if (response !== null){
                return res.status(HttpStatus.OK).json(response);
            }else {
                return res.status(HttpStatus.BAD_REQUEST).json(new BadRequestErrorDto(["Incorrect password!"]));
            }
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @ApiOkResponse({
        status: 200,
        type:  UserCreatedResponse,
        isArray: false
    })
    @ApiResponse({
        status: 400,
        description: 'bad request',
        type:  BadRequestErrorDto,
        isArray: false
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type:  InternalServerErrorDTO,
        isArray: false
    })
    @Post('register')
    async register(@Body() userReq: UserCreateDto,  @Res() res: Response) {
        try {
            const newUser =  await this.authService.register(userReq);
            return res.status(200).json(new UserCreatedResponse({userId: newUser._id}));
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());  
        }
    }
}
