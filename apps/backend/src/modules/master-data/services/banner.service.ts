import bannerRepository from "../repositories/banner.repository";

class BannerService {

    async create(body:any){
        return bannerRepository.create(body);
    }

    async getAll(){
        return bannerRepository.findAll();
    }

    async getHome(){
        return bannerRepository.findHomeBanners();
    }

    async update(id:string,body:any){
        return bannerRepository.update(id,body);
    }

    async delete(id:string){
        await bannerRepository.delete(id);
    }

}

export default new BannerService();