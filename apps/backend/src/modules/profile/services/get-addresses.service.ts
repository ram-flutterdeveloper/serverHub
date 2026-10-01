import addressRepository from "../repositories/address.repository";

class GetAddressesService {

    async execute(userId: string) {

        const addresses =
            await addressRepository.getByUser(userId);

        return addresses;

    }

}

export default new GetAddressesService();