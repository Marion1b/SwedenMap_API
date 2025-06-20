import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../index";
import { DATE } from "sequelize";

interface PinAttributes {
    pinId: number;
    name: string;
    description: string;
    photo?: string;
    category: string;
    geolocId: number;
    mapId: number;
    userId: number;
}

interface PinCreationAttributes extends Optional<PinAttributes, 'pinId'> {}

class Pin
    extends Model<PinAttributes, PinCreationAttributes>
    implements PinAttributes{
        public pinId! : number;
        public name! : string;
        public description!: string;
        public photo? : string;
        public category!: string;
        public geolocId!: number;
        public mapId!: number;
        public userId!: number;

        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

Pin.init(
    {
        pinId:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        name:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description:{
            type: DataTypes.STRING(800),
            allowNull: false
        },
        photo:{
            type: DataTypes.STRING(800)
        },
        category:{
            type: DataTypes.STRING(100),
            allowNull: false
        },
        geolocId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        mapId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        sequelize,
        modelName: 'Pin',
        tableName: 'pins',
        timestamps: true,
    }
);

export { Pin, PinAttributes, PinCreationAttributes };