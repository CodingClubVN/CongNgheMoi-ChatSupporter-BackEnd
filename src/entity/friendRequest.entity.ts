import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from "./user.entity";

@Schema()
export class FriendRequest extends Document {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name})
    fromUser: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name})
    toUser: MongooseSchema.Types.ObjectId;

    @Prop({default: Date.now()})
    createdAt: Date;

    @Prop()
    status: string;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);