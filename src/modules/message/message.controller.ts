import { Body, Controller, Get, HttpStatus,Param,Post,Query, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FirebaseUploadUtil } from "../../utils/firebase-upload.util";
import { DownloadFileRequestDto, FilterParamDto, InternalServerErrorDTO, MessageCreateDto, MessageCreateResponseDto, MessageResponseDto } from "../../dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { MessageService } from "./message.service";
import { createReadStream, existsSync, mkdirSync, readdir, unlink } from 'fs';
import { join } from 'path';

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

    @ApiOkResponse({
        status: 200,
        type:  StreamableFile,
    })
    @ApiResponse({
        status: 500,
        description: 'error',
        type:  InternalServerErrorDTO,
        isArray: false
    })
    @Post("file/download")
    @UseGuards(JwtAuthGuard)
    async downloadFile(@Req() req, @Res({ passthrough: true }) res: Response, @Body() body: DownloadFileRequestDto) {
        try {
            if (!existsSync('./download')) {
                mkdirSync('./download')
            }
            readdir('./download', (err, files) => {
                if (err) throw err;
              
                for (const file of files) {
                  unlink(join('./download', file), (err) => {
                    if (err) throw err;
                  });
                }
              });
            let filename = body.url.slice(79,body.url.length -28);
            await this.firebase.downloadFile(filename);
            let file = createReadStream(join(process.cwd(), `download/${filename}`));
            let contentType = 'application/json';
            if(filename.includes('png') || filename.includes('jpg') || filename.includes('svg')) {
                contentType = 'image/png';
            }
            res.status(200).set({
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename=${filename}`,
            });
            return new StreamableFile(file);
        }catch(error) {
            console.log(error);
            return res.status(500).json(new InternalServerErrorDTO());
        }
    }
}