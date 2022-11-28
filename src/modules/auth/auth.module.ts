import { CacheInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserValidation } from '../../validations';
import configuration from '../../config/configuration';
import { User, UserSchema } from '../../entity/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './auth.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule,
        ConfigModule.forRoot({
          load: [configuration]
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => {
            return {
              secret: config.get('jwt.secret'),
              signOptions: {
                expiresIn: config.get('jwt.expiresIn'),
              },
            };
          },
          inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
          imports:[ConfigModule.forRoot({load: [configuration]})],
          useFactory: async (config: ConfigService) => ({
            transport: {
              host: config.get('email.host'),
              secure: false,
              auth: {
                user: config.get('email.user'),
                pass: config.get('email.password'),
              },
            },
            defaults: {
              from: config.get('email.from'),
            },
            template: {
              dir: './email',
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
          inject: [ConfigService],
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository, JwtStrategy, UserValidation, 
      {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
      }
    ],
    exports: [AuthService]
})
export class AuthModule {}
