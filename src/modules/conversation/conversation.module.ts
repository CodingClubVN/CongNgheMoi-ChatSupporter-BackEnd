import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationValidation } from '../../validations';
import { Conversation, ConversationSchema, User, UserSchema } from '../../entity';
import { ConversationRepository } from '../../repositories';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, {name: Conversation.name, schema: ConversationSchema}]),
    ],
    controllers: [ConversationController],
    providers: [ConversationRepository, ConversationService, ConversationValidation],
    exports: []
})
export class ConversationModule {}
