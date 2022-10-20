import { Body, Controller, Get, HttpStatus,Param,Post,Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FirebaseUploadUtil } from "../../utils/firebase-upload.util";
import { FilterParamDto, InternalServerErrorDTO, MessageCreateDto, MessageCreateResponseDto, MessageResponseDto } from "../../dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { MessageService } from "./message.service";

@ApiBearerAuth()
@ApiTags('api/messages')
@Controller('api/messages')
export class MessageController {
    constructor(private firebase: FirebaseUploadUtil, private messageService: MessageService){}

    @Post("conversation/:conversationId")
    @ApiOkResponse({
        status: 200,
        type: MessageCreateResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type:  InternalServerErrorDTO,
        isArray: false
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    schema: {
        type: 'object',
        properties: {
            file: {
                type: 'string',
                format: 'binary',
            },
            type: {
                type: 'string',
                format: 'string'
            },
            content: {
                type: 'string',
                format: 'string'
            },
            description: {
                type: 'string',
                format: 'string'
            }
        },
    },
    })
    @ApiParam({name: 'conversationId', required: true})
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async createMessage(@Req() req, @Res() res: Response, @Param('conversationId') conversationId: string, @Body() body, @UploadedFile() file?: Express.Multer.File) {
        try {
            let message: MessageCreateDto = {
                fromUserId: req.user['userId'],
                conversationId,
                type: body.type
            }
            if(file) {
                await this.firebase.uploadFile(file);
                const url = this.firebase.getUrlUpload(file.originalname);
                message.content = url;
                message.description = body.description;
            }else {
                message.content = body.content;
            }
            const newMessage = await this.messageService.createMessage(message);
            return res.status(200).json(new MessageCreateResponseDto({messageId: newMessage._id}));
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
    

    @Get("conversation/:conversationId")
    @ApiOkResponse({
        status: 200,
        type:  [MessageResponseDto],
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type:  InternalServerErrorDTO,
        isArray: false
    })
    @ApiParam({name: 'conversationId', required: true})
    @UseGuards(JwtAuthGuard)
    async getAllMessageByConversation(@Req() req, @Res() res: Response, @Param('conversationId') conversationId: string,  @Query() filters: FilterParamDto) {
        try {
            const messages = await this.messageService.getAllByConversationId(conversationId, filters);
            return res.status(200).json(messages);
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
}