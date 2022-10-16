import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export default class GoogleOauthGuard extends AuthGuard('google') {
    constructor(private configService: ConfigService) {
        super({
            accessType: 'offline',
        });
    }

};
