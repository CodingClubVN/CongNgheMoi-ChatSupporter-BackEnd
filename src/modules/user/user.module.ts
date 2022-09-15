import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/auth.strategy';
import { UserController } from './user.controller';

@Module({
    controllers: [UserController],
    providers: [],
    exports: []
})
export class UserModule {}
