import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";


class Service extends BaseModel<
    InferAttributes<Service>,
    InferCreationAttributes<Service>
> {
    declare id: string;

    declare categoryId: string;

    declare name: string;

    declare slug: string;

    declare image: string | null;

    declare icon: string | null;

    declare description: string | null;

    declare sortOrder: number;

    declare isFeatured: boolean;

    declare status: "ACTIVE" | "INACTIVE";
}

Service.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        slug: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        image: {
            type: DataTypes.STRING,
        },

        icon: {
            type: DataTypes.STRING,
        },

        description: {
            type: DataTypes.TEXT,
        },

        sortOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
    },
    {
        sequelize,
        tableName: "services",
        timestamps: true,
        paranoid: true,
    }
);

export default Service;
