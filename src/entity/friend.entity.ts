import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from "./user.entity";

@Schema()
export class Friend extends Document {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name})
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name})
    friendId: MongooseSchema.Types.ObjectId;

    @Prop({default: Date.now()})
    createdAt: Date;

}

export const FriendSchema = SchemaFactory.createForClass(Friend);
