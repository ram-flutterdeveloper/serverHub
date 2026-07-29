import { ProviderBankAccount } from "../models";

class ProviderBankAccountRepository{

    async create(data:Partial<ProviderBankAccount>){
        return ProviderBankAccount.create(data as any);
    }

    async findByProvider(providerId:string){
        return ProviderBankAccount.findOne({
            where:{providerId},
        });
    }

    async update(
        id:string,
        data:Partial<ProviderBankAccount>
    ){
        await ProviderBankAccount.update(data,{
            where:{id},
        });

        return ProviderBankAccount.findByPk(id);
    }

    async delete(id:string){
        return ProviderBankAccount.destroy({
            where:{id},
        });
    }

}

export default new ProviderBankAccountRepository();