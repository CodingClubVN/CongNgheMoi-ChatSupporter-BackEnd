import { ApiProperty } from "@nestjs/swagger";
import { MessageModel } from "../../entity/models/message.model";
import { UserModel } from "../../entity/models/user.model";

export class ConversationResponseDto {
   
    @ApiProperty()
    _id: string;

    @ApiProperty()
    conversationName: string;

    @ApiProperty({
        type: UserModel,
        isArray: true
    })
    users: UserModel[];
    

    @ApiProperty()
    lastMessage: MessageModel;
    
    @ApiProperty()
    readStatus: Object[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}