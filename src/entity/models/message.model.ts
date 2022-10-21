import { ApiProperty } from "@nestjs/swagger";

export class MessageModel {

    @ApiProperty()
    conversationId: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    fromUserId: string;
}