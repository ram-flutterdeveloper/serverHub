import requirementRepository from "../repositories/service-requirement.repository";
import packageRepository from "../repositories/package.repository";
import { AppError } from "../../../helpers/AppError";

class ServiceRequirementService {

    async create(body:any){

        const pkg = await packageRepository.findById(body.packageId);

        if(!pkg){
            throw new AppError("Package not found",404);
        }

        return requirementRepository.create(body);

    }

    async getAll(){
        return requirementRepository.findAll();
    }

    async getByPackage(packageId:string){
        return requirementRepository.findByPackage(packageId);
    }

    async update(id:string,body:any){

        const requirement = await requirementRepository.findById(id);

        if(!requirement){
            throw new AppError("Requirement not found",404);
        }

        await requirement.update(body);

        return requirement;
    }

    async delete(id:string){
        await requirementRepository.delete(id);
    }

}

export default new ServiceRequirementService();