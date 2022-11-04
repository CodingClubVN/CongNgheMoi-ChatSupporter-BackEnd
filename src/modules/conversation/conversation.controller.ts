import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards, Body, Param, Put, Query, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { ConversationValidation } from "../../validations";
import { BadRequestErrorDto, ConversationAddUserDto, ConversationCreateDto, ConversationCreateResponseDto, ConversationResponseDto, ConversationUpdateDto, FilterParamDto, InternalServerErrorDTO, ListConversationResponseDto, ResourceNotFoundException, Successful } from "../../dto";
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
    async addUserToConversation(@Req() req ,@Res() res: Response, @Body() reqBody: ConversationAddUserDto, @Param('conversationId') conversationId) {
        try {
            const userId = req.user['userId'];
            const arrayUserId = reqBody.arrayUserId;
            for (let userId of arrayUserId) {
                const messageValidation = await this.conversationValidation.checkUserFromConversationByUserId(conversationId, userId);
                if (messageValidation.toString().length) {
                    return res.status(400).json(new BadRequestErrorDto([messageValidation]));
                }
            }
            await this.conversationService.addUserToConversation(arrayUserId, conversationId, userId);
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
    async getAllConversationByUser(@Req() req, @Res() res: Response, @Query() filters: FilterParamDto) {
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
        isArray: false
    })
    @ApiOperation({ summary: 'get detail conversation' })
    @ApiParam({ name: 'conversationId', required: true })
    @Put(":conversationId/mark-read")
    @UseGuards(JwtAuthGuard)
    async updateReadStatus(@Req() req, @Res() res: Response, @Param('conversationId') conversationId) {
        try {
            const userId = req.user['userId'];
            await this.conversationService.updateReadStatus(userId, conversationId);
            return res.status(200).json(new Successful("updated status successful!"));
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
        type: ResourceNotFoundException,
    })
    @ApiOperation({ summary: 'update conversation' })
    @ApiParam({ name: 'conversationId', required: true })
    @Put(':conversationId')
    @UseGuards(JwtAuthGuard)
    async updateConversation( @Res() res: Response, @Param('conversationId') conversationId, @Body() conversationReq: ConversationUpdateDto) {
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

    @ApiOkResponse({
        status: 200,
        type: Successful,
    })
    @ApiResponse({
        status: 404,
        description: 'not found',
        type: ResourceNotFoundException,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type: InternalServerErrorDTO,
        isArray: false
    })
    @ApiOperation({ summary: 'remove user from conversation' })
    @ApiParam({ name: 'conversationId', required: true })
    @ApiParam({ name: 'userId', required: true })
    @Put(":conversationId/users/:userId/remove-user")
    @UseGuards(JwtAuthGuard)
    async removeUserFromConversation( @Req() req ,@Res() res: Response, @Param('conversationId') conversationId, @Param('userId') userId) {
        try {
            const uid = req.user['userId'];
            await this.conversationService.removeUserFromConversation(userId, conversationId, uid);
            return res.status(200).json(new Successful("remove user from conversation successful!"));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
}