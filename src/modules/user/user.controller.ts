import { Controller, Get, HttpStatus, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { InternalServerErrorDTO, UserResponseDto } from "../../dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { UserService } from "./user.service";

@ApiBearerAuth()
@ApiTags('api/user')
@Controller('api/user')
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

}