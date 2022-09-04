import { InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserCreateDto } from "src/dto/user/user-create.dto";
import { User } from "../entity/user.entity";


export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>){

    }

    async createUser(user: UserCreateDto) {
        try {
            const newUser = new this.userModel({
                ...user
            }).save();
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}