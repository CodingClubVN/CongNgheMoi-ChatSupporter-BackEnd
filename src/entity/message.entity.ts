import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Conversation } from "./conversation.entity";
import { User } from "./user.entity";


@Schema()
export class Message extends Document {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Conversation.name})
    conversationId: MongooseSchema.Types.ObjectId;

   
    @Prop({default: Date.now()})
    createdAt: Date;

    @Prop()
    type: string;

    @Prop()
    content: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name})
    fromUserId: MongooseSchema.Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
