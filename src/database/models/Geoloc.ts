import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../index';
import { AllowNull } from 'sequelize-typescript';

interface GeolocAttributes {
    geolocId: number;
    geolocLat: number;
    geolocLng: number;
}

interface GeolocCreationAttributes extends Optional<GeolocAttributes, 'geolocId'> {}

class Geoloc
    extends Model<GeolocAttributes, GeolocCreationAttributes>
    implements GeolocAttributes{
        public geolocId!: number;
        public geolocLat!: number;
        public geolocLng!: number;

        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

Geoloc.init(
    {
        geolocId:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull:false
        },
        geolocLat:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        geolocLng:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        sequelize,
        modelName: 'Geoloc',
        tableName: 'geolocs',
        timestamps: true
    }
)

export { Geoloc, GeolocAttributes, GeolocCreationAttributes };