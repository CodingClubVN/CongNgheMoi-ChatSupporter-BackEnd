import { ApiProperty } from "@nestjs/swagger";

export class UserModel {

    @ApiProperty()
    userId: string;

    // @ApiProperty()
    // username: string;

    // @ApiProperty()
    // avatarUrl: string;
}