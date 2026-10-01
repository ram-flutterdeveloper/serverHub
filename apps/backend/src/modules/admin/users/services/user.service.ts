import { AppError } from "../../../../helpers/AppError";
import { UserStatus } from "../../../auth/constants/user-status";
import userRepository from "../repositories/user.repository";

class UserService {

    /**
     * Dashboard
     */
    async dashboard() {
        return await userRepository.getDashboardStats();
    }

    /**
     * User List
     */
    async getUsers(query: any) {

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        return await userRepository.getUsers({
            page,
            limit,
            search: query.search,
            status: query.status,
            from: query.from,
            to: query.to,
        });
    }

    /**
     * User Details
     */
    async getUser(id: string) {

        const user = await userRepository.getUserById(id);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    }

    /**
     * Block User
     */
    async block(id: string) {

        await this.getUser(id);

        await userRepository.updateStatus(
            id,
            UserStatus.BLOCKED
        );

        return {
            message: "User blocked successfully",
        };
    }

    /**
     * Unblock User
     */
    async unblock(id: string) {

        await this.getUser(id);

        await userRepository.updateStatus(
            id,
            UserStatus.ACTIVE
        );

        return {
            message: "User unblocked successfully",
        };
    }

    /**
     * Verify User
     */
    async verify(id: string) {

        await this.getUser(id);

        await userRepository.verifyUser(id);

        return {
            message: "User verified successfully",
        };
    }

    /**
     * Soft Delete User
     */
    async delete(id: string) {

        await this.getUser(id);

        await userRepository.deleteUser(id);

        return {
            message: "User deleted successfully",
        };
    }

}

export default new UserService();