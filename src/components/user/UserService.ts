import {
    User,
    UsersAttributes,
    UsersCreationAttributes,
    UserModifyAttributes
} from '../../database/models/User';
import { StatusCodes } from 'http-status-codes';

export class UserService{
    // get all users
    async getAll():Promise<UsersAttributes[]>{
        try{
            const users = await User.findAll({
                attributes : {exclude:['password']}
            });
            return users;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    //find by id
    async findOneById(userId: number): Promise<UsersAttributes>{
        try{
            const user = await User.findByPk(
                userId, 
                { attributes:{exclude:['password']}}
            )
            return user
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    //find by email
    async findOneByEmail(userEmail:string): Promise<UsersAttributes>{
        try{
            const user =  await User.findOne({
                where: {email : userEmail},
                attributes : {exclude : ['password']}
            });
            return user;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    //find one by email and get password to login
    async findOneByEmailLogin(userEmail:string): Promise<UsersAttributes>{
        try{
            const user =  await User.findOne({
                where: {email : userEmail}
            });
            return user;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    //find by username
    async findOneByUsername(userUsername:string):Promise<UsersAttributes>{
        try{
            const user = await User.findOne({
                where:{username:userUsername},
                attributes : {exclude: ['password']}
            });
            return user;
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

    //modify user
    async modify(userId:number, payload:UserModifyAttributes): Promise<UsersAttributes>{
        try{
            const user = await User.update(payload, {
                where:{userId:userId},
                returning:true
            });

            if(user[0] === 0){
                throw new Error ('User not found or no changes made');
            }
            
            const updatedUser = await User.findByPk(userId);
            return updatedUser;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}