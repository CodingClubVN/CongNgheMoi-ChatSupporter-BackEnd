import { Controller, Get, HttpStatus, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";

@ApiBearerAuth()
@ApiTags('api/user')
@Controller('api/user')
export class UserController {
    constructor(){}

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getUser(@Req() req: Request, @Res() res: Response) {
        return res.status(HttpStatus.OK).json(req.user);
    }
}