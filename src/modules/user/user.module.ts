import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/auth.strategy';
import { UserController } from './user.controller';

@Module({
    controllers: [UserController],
    providers: [JwtStrategy],
    exports: []
})
export class UserModule {}
