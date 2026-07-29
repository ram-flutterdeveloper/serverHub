import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class ProviderBankAccount extends BaseModel<
    InferAttributes<ProviderBankAccount>,
    InferCreationAttributes<ProviderBankAccount>
> {

    declare id:string;

    declare providerId:string;

    declare accountHolderName:string;

    declare bankName:string;

    declare branchName:string | null;

    declare accountNumber:string;

    declare ifscCode:string;

    declare upiId:string | null;

    declare accountType:"SAVINGS"|"CURRENT";

    declare isPrimary:boolean;

    declare verificationStatus:
        |"PENDING"
        |"VERIFIED"
        |"REJECTED";

    declare verifiedAt:Date | null;

    declare remarks:string | null;

}

ProviderBankAccount.init({

    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },

    providerId:{
        type:DataTypes.UUID,
        allowNull:false,
        unique:true,
        references:{
            model:"providers",
            key:"id",
        },
        onDelete:"CASCADE",
    },

    accountHolderName:{
        type:DataTypes.STRING(150),
        allowNull:false,
    },

    bankName:{
        type:DataTypes.STRING(150),
        allowNull:false,
    },

    branchName:{
        type:DataTypes.STRING,
    },

    accountNumber:{
        type:DataTypes.STRING(50),
        allowNull:false,
    },

    ifscCode:{
        type:DataTypes.STRING(20),
        allowNull:false,
    },

    upiId:{
        type:DataTypes.STRING(150),
    },

    accountType:{
        type:DataTypes.ENUM(
            "SAVINGS",
            "CURRENT"
        ),
        defaultValue:"SAVINGS",
    },

    isPrimary:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
    },

    verificationStatus:{
        type:DataTypes.ENUM(
            "PENDING",
            "VERIFIED",
            "REJECTED"
        ),
        defaultValue:"PENDING",
    },

    verifiedAt:{
        type:DataTypes.DATE,
    },

    remarks:{
        type:DataTypes.TEXT,
    }

},{
    sequelize,
    tableName:"provider_bank_accounts",
    timestamps:true,
    paranoid:true,
});

export default ProviderBankAccount;