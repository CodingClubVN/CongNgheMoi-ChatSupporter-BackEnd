import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Account } from "./models/account.interface";


@Schema()
export class User extends Document {

    @Prop({required: true, unique: true, message: 'id must be unique!'})
    id: string;

    @Prop({})
    fullname: string;

    @Prop()
    address: string;

    @Prop({required: true})
    email: string;

    @Prop()
    avatarUrl: string;

    @Prop()
    phone: string;

    @Prop()
    account: Account;

    @Prop()
    about: string;

    @Prop()
    yearOrBirth: Date;

    @Prop({default: Date.now()})
    updatedAt: Date;

    @Prop({default: Date.now()})
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);