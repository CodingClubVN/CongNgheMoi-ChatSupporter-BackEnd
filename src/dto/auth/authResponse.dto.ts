import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
    @ApiProperty()
    token: string;
    // @ApiProperty()
    // role: string;

    constructor(partial: Partial<AuthResponseDto>) {
        Object.assign(this, partial);
    }
}