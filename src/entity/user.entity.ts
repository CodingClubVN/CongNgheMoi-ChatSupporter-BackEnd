import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Account } from "./models/account.model";
import { Document} from 'mongoose';
@Schema()
export class User extends Document {
    
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

    @Prop({type: Account})
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