import { ApiProperty } from "@nestjs/swagger";

export class FriendApproveDto {

    @ApiProperty()
    friendRequestId: string;
}