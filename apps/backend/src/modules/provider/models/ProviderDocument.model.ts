import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class ProviderDocument extends BaseModel<
  InferAttributes<ProviderDocument>,
  InferCreationAttributes<ProviderDocument>
> {

  declare id: string;

  declare providerId: string;

  declare documentType:
    | "AADHAAR"
    | "PAN"
    | "GST"
    | "SHOP_LICENSE"
    | "DRIVING_LICENSE"
    | "PASSPORT";

  declare documentNumber: string;

  declare frontImage: string;

  declare backImage: string | null;

  declare status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

  declare verifiedBy: string | null;

  declare verifiedAt: Date | null;

  declare remarks: string | null;

}

ProviderDocument.init({

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true,
  },

  providerId:{
    type:DataTypes.UUID,
    allowNull:false,
    references:{
      model:"providers",
      key:"id",
    },
    onDelete:"CASCADE",
  },

  documentType:{
    type:DataTypes.ENUM(
      "AADHAAR",
      "PAN",
      "GST",
      "SHOP_LICENSE",
      "DRIVING_LICENSE",
      "PASSPORT"
    ),
    allowNull:false,
  },

  documentNumber:{
    type:DataTypes.STRING,
    allowNull:false,
  },

  frontImage:{
    type:DataTypes.STRING,
    allowNull:false,
  },

  backImage:{
    type:DataTypes.STRING,
  },

  status:{
    type:DataTypes.ENUM(
      "PENDING",
      "APPROVED",
      "REJECTED"
    ),
    defaultValue:"PENDING",
  },

  verifiedBy:{
    type:DataTypes.UUID,
  },

  verifiedAt:{
    type:DataTypes.DATE,
  },

  remarks:{
    type:DataTypes.TEXT,
  }

},{
  sequelize,
  tableName:"provider_documents",
  timestamps:true,
  paranoid:true,
});

export default ProviderDocument;