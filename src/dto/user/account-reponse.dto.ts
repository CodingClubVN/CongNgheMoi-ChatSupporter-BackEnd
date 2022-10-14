import { ApiProperty } from "@nestjs/swagger";

export class AccountResponseDto {
    @ApiProperty()
    username: string; 
}