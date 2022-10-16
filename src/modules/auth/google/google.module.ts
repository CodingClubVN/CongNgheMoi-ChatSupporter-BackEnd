import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import GoogleAuthController from "./google.controller";
import GoogleService from "./google.service";
import GoogleStrategy from "./google.strategy";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [GoogleAuthController],
    providers: [GoogleService, GoogleStrategy],
})
export default class GoogleAuthModule { }