import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import {AuthDto} from "../auth/dto/auth.dto";
import {hash} from "argon2";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async getById(id: string): Promise<User | null> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            return null;
        }
        return user as User;
    }

    async getByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            return null;
        }
        return user as User;
    }

    async create(dto: AuthDto): Promise<User> {
        const user = {
            email: dto.email,
            name: '',
            password: await hash(dto.password)
        }
        const userEntity = new this.userModel(user);
        return userEntity.save() as Promise<User>;
    }
}
