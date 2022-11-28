import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { FriendModule } from './modules/friend/friend.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { EventSocketGateway } from './socket/socket.io';
import * as redisStore from 'cache-manager-redis-store';
// import type { RedisClientOptions } from "redis";
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule, 
        // ServeStaticModule.forRoot({
        //   rootPath: join(__dirname, '..', 'email'),
        // }),
      ],
      useFactory: async (config: ConfigService) => ({
       uri: config.get('database.url'),
       useNewUrlParser: true,
       useUnifiedTopology: true,
      }),
      inject: [ConfigService],
     }),
     AuthModule,
     UserModule,
     ConversationModule,
     MessageModule,
     FriendModule,
     CacheModule.register({
      database: 0,
      password: 'r3d1sp4ssw0rd',
      url: "redis://157.230.46.146:6379",
      isGlobal: true
    }),
  ],
  controllers: [],
  providers: [EventSocketGateway],
  exports: [EventSocketGateway]
})
export class AppModule {}
