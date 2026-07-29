import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class SubCategory extends BaseModel<
    InferAttributes<SubCategory>,
    InferCreationAttributes<SubCategory>
> {
    declare id: string;

    declare serviceId: string;

    declare name: string;

    declare slug: string;

    declare image: string | null;

    declare description: string | null;

    declare sortOrder: number;

    declare isFeatured: boolean;

    declare status: "ACTIVE" | "INACTIVE";
}

SubCategory.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        serviceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "services",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },

        slug: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        image: {
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
        tableName: "sub_categories",
        timestamps: true,
        paranoid: true,
    }
);


export default SubCategory;