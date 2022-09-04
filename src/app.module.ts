import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
       uri: config.get('database.url'),
       useNewUrlParser: true,
       useUnifiedTopology: true,
      }),
      inject: [ConfigService],
     }),
     AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
