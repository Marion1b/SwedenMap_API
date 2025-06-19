import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';

interface UsersAttributes {
    user_id: string;
    username: string;
    password: string;
    email: string;
    avatar?: string;
    country?: string;
    city?: string;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'user_id'> {}

class User 
    extends Model<UsersAttributes, UsersCreationAttributes>
    implements UsersAttributes{
        public user_id! : string;
        public username!: string;
        public password!: string;
        public email! : string;
        public avatar? : string;
        public country?: string;
        public city? :string;

        public readonly createdAt!: Date;
        public readonly updatedAt! : Date;
    }

User.init(
    {
        username:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        password:{
            type:DataTypes.STRING(50),
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        avatar: {
            type:DataTypes.STRING,
        },
        country:{
            type:DataTypes.STRING,
        },
        city:{
            type:DataTypes.STRING,
        },
        user_id:{
            type:DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull:false
        }
    },{
        sequelize,
        modelName:'User',
        tableName:'users',
        timestamps:true,
    },
);

export { User, UsersAttributes, UsersCreationAttributes };