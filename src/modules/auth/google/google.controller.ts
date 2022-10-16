import { Controller, Request, Get, Req, UseGuards, Res, HttpStatus } from "@nestjs/common";
import { ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import GoogleOauthGuard from "./google.guard";
import GoogleService from "./google.service";
import { Response } from "express";

@Controller('auth/google')
@ApiTags('auth/google')
export default class GoogleAuthController {
    constructor(private readonly googleService: GoogleService) { }
    @Get()
    @UseGuards(GoogleOauthGuard)
    async googleAuth() { }

    @ApiOkResponse({
        status: 200,
    })
    @Get('redirect')
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const response= this.googleService.googleLogin(req);
        return res.status(HttpStatus.OK).json(response);
    }
}

