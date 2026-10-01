import { AppError } from "../../../helpers/AppError";
import addressRepository from "../repositories/address.repository";

class DeleteAddressService {

    async execute(
        id: string,
        userId: string
    ) {

        const address =
            await addressRepository.getById(id);

        if (!address) {
            throw new AppError(
                "Address not found",
                404
            );
        }

        if (address.userId !== userId) {
            throw new AppError(
                "Unauthorized",
                403
            );
        }

        await addressRepository.delete(id);

        return true;

    }

}

export default new DeleteAddressService();