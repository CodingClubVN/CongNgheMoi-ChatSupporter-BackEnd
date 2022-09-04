import { ApiProperty } from "@nestjs/swagger";

export class Account {
    @ApiProperty()
    username: string;
    
    @ApiProperty()
    password: string;
}