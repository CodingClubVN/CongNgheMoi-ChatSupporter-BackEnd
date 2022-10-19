import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards, Body, Param, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { ConversationValidation } from "../../validations";
import { BadRequestErrorDto, ConversationAddUserDto, ConversationCreateDto, ConversationUpdateDto, ConversationCreateResponseDto, ConversationResponseDto, FilterParamDto, InternalServerErrorDTO, ListConversationResponseDto, Successful } from "../../dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { ConversationService } from "./conversation.service";

@ApiBearerAuth()
@ApiTags('api/conversation')
@Controller('api/conversations')
export class ConversationController {
    constructor(private conversationService: ConversationService, private conversationValidation: ConversationValidation) { }

    @ApiOkResponse({
        status: 200,
        type: ConversationCreateResponseDto,
        isArray: false
    })
    @ApiResponse({
        status: 400,
        description: 'bad request',
        type: BadRequestErrorDto,
        isArray: false
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @Post('')
    @UseGuards(JwtAuthGuard)
    async createConversation(@Req() req, @Res() res: Response, @Body() conversationReq: ConversationCreateDto) {
        try {
            const userId = req.user['userId'];
            conversationReq.arrayUserId.push(userId);
            const messageValidation = await this.conversationValidation.checkCreateConversation(conversationReq);
            if (messageValidation.toString().length) {
                return res.status(400).json(new BadRequestErrorDto([messageValidation]));
            }
            const result = await this.conversationService.createConversation(conversationReq);
            return res.status(200).json(new ConversationCreateResponseDto({ conversationId: result.conversationId }));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }


    @ApiOkResponse({
        status: 200,
        type: Successful,
        isArray: false
    })
    @ApiResponse({
        status: 400,
        description: 'bad request',
        type: BadRequestErrorDto,
        isArray: false
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @ApiOperation({ summary: 'add user to conversation' })
    @ApiParam({ name: 'conversationId', required: true })
    @Put(':conversationId/add-user')
    @UseGuards(JwtAuthGuard)
    async addUserToConversation(@Res() res: Response, @Body() reqBody: ConversationAddUserDto, @Param('conversationId') conversationId) {
        try {
            const arrayUserId = reqBody.arrayUserId;
            await this.conversationService.addUserToConversation(arrayUserId, conversationId);
            return res.status(HttpStatus.OK).json(new Successful("add user to conversation successful!"))
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @ApiOkResponse({
        status: 200,
        type: ConversationResponseDto,
        isArray: false
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @ApiOperation({ summary: 'get detail conversation' })
    @ApiParam({ name: 'conversationId', required: true })
    @Get(':conversationId')
    @UseGuards(JwtAuthGuard)
    async getConversationById(@Res() res: Response, @Param('conversationId') conversationId) {
        try {
            const conversation = await this.conversationService.getConversationId(conversationId);
            return res.status(HttpStatus.OK).json(conversation);
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @ApiOkResponse({
        status: 200,
        type: ListConversationResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @Get('')
    @ApiOperation({ summary: 'get all conversation' })
    @UseGuards(JwtAuthGuard)
    async getAllUser(@Req() req, @Res() res: Response, @Query() filters: FilterParamDto) {
        try {
            const userId = req.user['userId'];
            const conversations = await this.conversationService.findAllByUser(filters, userId);
            return res.status(200).json(conversations);
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }

    @ApiOkResponse({
        status: 200,
        type: Successful,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
    })
    @ApiResponse({
        status: 404,
        description: 'not found',
        type: InternalServerErrorDTO,
    })
    @Post(':conversationId/update')
    async updateConversation(@Res() res: Response, @Param('conversationId') conversationId: string, @Body() conversationReq: ConversationUpdateDto) {
        try {
            const messageValidation = await this.conversationValidation.checkUpdateConversation(conversationReq);
            if (messageValidation.toString().length) {
                return res.status(400).json(new BadRequestErrorDto([messageValidation]));
            }
            const conversationUpdated = await this.conversationService.updateConversation(conversationId, conversationReq);
            return res.status(200).json(conversationUpdated);
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
}