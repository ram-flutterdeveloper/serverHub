import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export abstract class BaseModel<
  TModelAttributes = any,
  TCreationAttributes = any
> extends Model<
  InferAttributes<any>,
  InferCreationAttributes<any>
> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare deletedAt: CreationOptional<Date | null>;
}