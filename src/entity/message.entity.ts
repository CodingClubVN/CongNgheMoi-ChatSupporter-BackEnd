import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Message extends Document {
    
    @Prop({
        type: MongooseSchema.Types.ObjectId,
    })
    conversationId: string;

   
    @Prop()
    createdAt: Date;

    @Prop()
    type: string;

    @Prop()
    content: string;

    @Prop({default: null})
    description: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
    })
    fromUserId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
