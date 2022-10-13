import { Controller, Get, HttpStatus,Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FilterParamDto, InternalServerErrorDTO, ListUserResponse, UserResponseDto } from "../../dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { UserService } from "./user.service";

@ApiBearerAuth()
@ApiTags('api/users')
@Controller('api/users')
export class UserController {
    constructor(private userService: UserService){}

    @ApiOkResponse({
        status: 200,
        type:  UserResponseDto,
        isArray: false
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type:  InternalServerErrorDTO,
        isArray: false
    })
    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getUserDeltail(@Req() req: Request, @Res() res: Response) {
        try {
            const userId = req.user['userId'];
            const user = await this.userService.findById(userId);
            return res.status(HttpStatus.OK).json(user);
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    
    @ApiOkResponse({
        status: 200,
        type:  ListUserResponse,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type:  InternalServerErrorDTO,
        isArray: false
    })
    @Get('')
    @UseGuards(JwtAuthGuard)
    async getAllUser(@Req() req, @Res() res: Response, @Query() filters: FilterParamDto) {
        try {
            const users = await this.userService.findAll(filters);
            return res.status(200).json(users);
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
}