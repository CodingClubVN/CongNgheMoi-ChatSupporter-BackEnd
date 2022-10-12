import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MessageModel } from "./models/message.model";
import { UserModel } from "./models/user.model";


@Schema()
export class Conversation extends Document {

    @Prop()
    conversationName: string;

    @Prop({default: []})
    users: UserModel[];
    
    @Prop({default: []})
    lastMessage: MessageModel;
    
    @Prop({default: []})
    readStatus: Object[];

    @Prop({default: Date.now()})
    createdAt: Date;

    @Prop({default: Date.now()})
    updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
