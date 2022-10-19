import { ApiProperty } from "@nestjs/swagger";

export class ConversationUpdateDto {
    @ApiProperty()
    conversationName: string;
    @ApiProperty()
    updatedDate: Date;
}

