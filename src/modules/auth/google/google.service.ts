import { Injectable } from "@nestjs/common"

@Injectable()
export default class GoogleService {
    googleLogin(req) {
        if (!req.user) {
            return {
                status: 401,
                message: 'Unauthorized from google'
            }
        }
        return {
            message: "User has been logged in successfully",
            user: req.user
        }
    }
};
