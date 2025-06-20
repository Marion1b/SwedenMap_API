import {
    User,
    UsersAttributes,
    UsersCreationAttributes,
} from '../../database/models/User';
import { StatusCodes } from 'http-status-codes';

export class UserService{
    // get all users
    async getAll():Promise<UsersAttributes[]>{
        try{
            const users = await User.findAll();
            console.log(users);
            return users;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    //create user
    async create(payload:UsersCreationAttributes): Promise<UsersAttributes>{
        try{
            const user = await User.create(payload);
            return user;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}