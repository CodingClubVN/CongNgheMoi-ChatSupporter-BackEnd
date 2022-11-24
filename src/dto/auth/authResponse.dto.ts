import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
    @ApiProperty()
    token: string;
    @ApiProperty()
    userId: string;

    constructor(partial: Partial<AuthResponseDto>) {
        Object.assign(this, partial);
    }
}