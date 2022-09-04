import { ApiProperty } from "@nestjs/swagger";
import { Account } from "../../entity/models/account.model";

export class UserCreateDto {
    @ApiProperty()
    fullname: string;

    @ApiProperty()
    account: Account;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;    
}