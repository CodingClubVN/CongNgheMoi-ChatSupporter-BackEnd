import { ApiProperty } from "@nestjs/swagger";

export class MessageModel {

    @ApiProperty()
    conversationId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    content: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    fromUserId: string;
}