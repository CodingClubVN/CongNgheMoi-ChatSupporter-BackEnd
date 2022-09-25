import { ApiProperty } from "@nestjs/swagger";

export class InternalServerErrorDTO {
    
    @ApiProperty()
    status: number;

    @ApiProperty()
    body: {
        error: {
            message: string;
        }
    }

    constructor(partial: Partial<InternalServerErrorDTO>) {
        Object.assign(this, partial);
    }
}