import { ApiProperty } from "@nestjs/swagger";

export class MessageResponseDto {
   
    @ApiProperty()
    _id: string;

    @ApiProperty()
    conversationId: string;
    
    @ApiProperty()
    fromUserId: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    type: string;
}