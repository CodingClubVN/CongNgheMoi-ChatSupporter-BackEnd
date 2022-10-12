import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { ConversationValidation } from "../../validations";
import { BadRequestErrorDto, ConversationCreateDto, ConversationCreateResponseDto, InternalServerErrorDTO } from "../../dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { ConversationService } from "./conversation.service";

@ApiBearerAuth()
@ApiTags('api/conversation')
@Controller('api/conversations')
export class ConversationController {
    constructor(private conversationService: ConversationService, private conversationValidation: ConversationValidation){}

    @ApiOkResponse({
        status: 200,
        type:  ConversationCreateResponseDto,
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
    @Post('')
    @UseGuards(JwtAuthGuard)
    async getUser(@Res() res: Response, @Body() conversationReq: ConversationCreateDto) {
        try {
            const messageValidation = await this.conversationValidation.checkCreateConversation(conversationReq);
            if (messageValidation.toString().length) {
                return res.status(400).json(new BadRequestErrorDto([messageValidation]));
            }
            const result = await this.conversationService.createConversation(conversationReq);
            return res.status(200).json(new ConversationCreateResponseDto({conversationId: result.conversationId}));
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
}