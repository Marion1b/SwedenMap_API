import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../index';

// interface for what is coming from the db
interface UsersAttributes {
    userId: number;
    username: string;
    password: string;
    email: string;
    avatar?: string;
    country?: string;
    city?: string;
}

//interface for what we're sending to the db
interface UsersCreationAttributes extends Optional<UsersAttributes, 'userId'> {}

class User 
    extends Model<UsersAttributes, UsersCreationAttributes>
    implements UsersAttributes{
        public userId! : number;
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

        userId:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            allowNull:false
        },
        username:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        password:{
            type:DataTypes.STRING(255),
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
    },{
        sequelize,
        modelName:'User',
        tableName:'users',
        timestamps:true,
    },
);

export { User, UsersAttributes, UsersCreationAttributes };