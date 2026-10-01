import { Op, WhereOptions } from "sequelize";

import User from "../../../auth/models/User.model";
import { UserRole } from "../../../../constants/user-role";
import { UserStatus } from "../../../auth/constants/user-status";

class UserRepository {

    /**
     * Dashboard Statistics
     */
    async getDashboardStats() {

        const [
            totalUsers,
            activeUsers,
            blockedUsers,
            newUsers,
        ] = await Promise.all([

            User.count({
                where: {
                    role: UserRole.CUSTOMER,
                },
            }),

            User.count({
                where: {
                    role: UserRole.CUSTOMER,
                    status: UserStatus.ACTIVE,
                },
            }),

            User.count({
                where: {
                    role: UserRole.CUSTOMER,
                    status: UserStatus.BLOCKED,
                },
            }),

            User.count({
                where: {
                    role: UserRole.CUSTOMER,
                    createdAt: {
                        [Op.gte]: new Date(
                            new Date().setDate(
                                new Date().getDate() - 30
                            ),
                        ),
                    },
                },
            }),
        ]);

        return {
            totalUsers,
            activeUsers,
            blockedUsers,
            newUsers,
        };
    }

    /**
     * User List
     */
    async getUsers({
        page,
        limit,
        search,
        status,
        from,
        to,
    }: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
        from?: string;
        to?: string;
    }) {

        const where: WhereOptions = {
            role: UserRole.CUSTOMER,
        };

        if (status) {
            Object.assign(where, { status });
        }

        if (search) {
            Object.assign(where, {
                [Op.or]: [
                    {
                        firstName: {
                            [Op.iLike]: `%${search}%`,
                        },
                    },
                    {
                        lastName: {
                            [Op.iLike]: `%${search}%`,
                        },
                    },
                    {
                        email: {
                            [Op.iLike]: `%${search}%`,
                        },
                    },
                    {
                        mobile: {
                            [Op.iLike]: `%${search}%`,
                        },
                    },
                ],
            });
        }

        if (from && to) {
            Object.assign(where, {
                createdAt: {
                    [Op.between]: [
                        new Date(from),
                        new Date(to),
                    ],
                },
            });
        }

        const { rows, count } = await User.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit,
            order: [["createdAt", "DESC"]],
        });

        return {
            users: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }

    /**
     * User Details
     */
    async getUserById(id: string) {

        return User.findOne({
            where: {
                id,
                role: UserRole.CUSTOMER,
            },
        });

    }

    /**
     * Update Status
     */
    async updateStatus(
        id: string,
        status: string,
    ) {

        return User.update(
            { status },
            {
                where: {
                    id,
                    role: UserRole.CUSTOMER,
                },
            },
        );

    }

    /**
     * Verify User
     */
    async verifyUser(id: string) {

        return User.update(
            {
                isMobileVerified: true,
                isEmailVerified: true,
            },
            {
                where: {
                    id,
                    role: UserRole.CUSTOMER,
                },
            },
        );

    }

    /**
     * Soft Delete
     */
    async deleteUser(id: string) {

        return User.update(
            {
                status: 'DELETED',
                deletedAt: new Date(),
            },
            {
                where: {
                    id,
                    role: UserRole.CUSTOMER,
                },
            },
        );

    }
}

export default new UserRepository();