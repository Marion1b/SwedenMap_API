import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../index';
import { AllowNull } from 'sequelize-typescript';

interface MapAttributes {
    mapId: number;
    name: string;
    creatorId: number;
    country: string;
    city?: string;
}

interface MapCreationAttributes extends Optional<MapAttributes, 'mapId'> {}

class Map
 extends Model<MapAttributes, MapCreationAttributes>
 implements MapAttributes{
    public mapId! : number;
    public name! : string;
    public creatorId!: number;
    public country! : string;
    public city?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
 }

Map.init(
    {
        mapId:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        name:{
            type:DataTypes.STRING(255),
            allowNull: false
        },
        creatorId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        country:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        city:{
            type:DataTypes.STRING(255),
        }
    },{
        sequelize,
        modelName:'Map',
        tableName:'maps',
        timestamps:true
    }
)

export { Map, MapAttributes, MapCreationAttributes };