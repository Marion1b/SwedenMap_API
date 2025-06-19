import {
    User,
    UsersAttributes,
    UsersCreationAttributes,
} from '../../database/models/User';

export class UserService{
    async getAll():Promise<UsersAttributes[]>{
        try{
            const users = await User.findAll();
            console.log(users);
            return users;
        }catch(error){
            throw error;
        }
    }
}