import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from "./models/user.model";


@Schema()
export class Conversation extends Document {

    @Prop()
    conversationName: string;

    @Prop()
    users: User[];
    
    @Prop()
    lastMessage: string;
    
    @Prop()
    readStatus: Object[];

    @Prop({default: Date.now()})
    createdAt: Date;

    @Prop({default: Date.now()})
    updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
