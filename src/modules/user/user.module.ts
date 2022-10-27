import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseUploadUtil } from '../../utils/firebase-upload.util';
import { User, UserSchema } from '../../entity';
import { UserRepository } from '../../repositories';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UserController],
    providers: [UserRepository,FirebaseUploadUtil, UserService],
    exports: []
})
export class UserModule {}
