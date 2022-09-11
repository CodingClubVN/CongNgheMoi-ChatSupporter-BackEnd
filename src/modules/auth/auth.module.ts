import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../../entity/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './auth.strategy';

@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: jwtConstants.expiresIn },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
