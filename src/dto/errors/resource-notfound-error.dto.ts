import { HttpException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export default class ResourceNotFoundException extends HttpException {
    @ApiProperty({
        default: 404
    })
    statusCode: number;

    @ApiProperty({
        default: "Not found"
    })
    error: string;

    @ApiProperty()
    message: string;
    
    constructor(message: string) {
        const partial: Partial<ResourceNotFoundException> = {
            statusCode: 404,
            error: "Not found!",
            message: message
        }
        super(partial, 404);
    }
}

