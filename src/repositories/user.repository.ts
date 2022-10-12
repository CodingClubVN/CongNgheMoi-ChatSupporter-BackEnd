import { InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserCreateDto } from "../dto";
import { User } from "../entity/user.entity";


export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>){

    }

    async createUser(user: UserCreateDto) {
        try {
            const newUser = await new this.userModel({
                ...user
            }).save();
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findOneByUsername(username: string) {
        try {
            const user = await this.userModel.findOne({"account.username": username});
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findByEmailOrEmail(email: string, username: string) {
        try {
            const user = await this.userModel.find({
                $or: [
                    {email},
                    {"account.username": username}
                ]
            });
            return user;
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
    }
}