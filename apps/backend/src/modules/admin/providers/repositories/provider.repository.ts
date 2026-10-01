import { Op } from "sequelize";

import { UserRole } from "../../../../constants/user-role";
import Provider from "../../../provider/models/Provider.model";
import User from "../../../auth/models/User.model";
// import Provider from "../../../provider/models/provider.model";

import ProviderLocation from "../../../provider/models/ProviderLocation.model";
import ProviderService from "../../../provider/models/ProviderService.model";
import ProviderDocument from "../../../provider/models/ProviderDocument.model";
import ProviderBankAccount from "../../../provider/models/ProviderBankAccount.model";
import ProviderWorkingHour from "../../../provider/models/ProviderWorkingHour.model";


class ProviderRepository {


    async getDashboardStats() {

        const [
            totalProviders,
            approvedProviders,
            pendingProviders,
            suspendedProviders
        ] = await Promise.all([

            Provider.count(),

            Provider.count({
                where: {
                    status: "ACTIVE",
                },
            }),

            Provider.count({
                where: {
                    status: "PENDING",
                },
            }),

            Provider.count({
                where: {
                    status: "SUSPENDED",
                },
            }),

        ]);

        return {
            totalProviders,
            approvedProviders,
            pendingProviders,
            suspendedProviders,
        };
    }
    async getProviders({
        page,
        limit,
        search,
        status,
    }: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
    }) {

        const where: any = {};

        if (status) {
            where.status = status;
        }

        const userWhere: any = {
            role: UserRole.PROVIDER,
        };

        if (search) {
            userWhere[Op.or] = [
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
                    mobile: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    email: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
            ];
        }
        console.log("Provider ===>", Provider.name);
        console.log("User ===>", User.name);

        console.log("Provider associations:", Provider.associations);
        console.log("User associations:", User.associations);

        const { rows, count } = await Provider.findAndCountAll({

            where,

            include: [
                {
                    model: User,
                    as: "user",
                    where: userWhere,
                    required: true,
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "mobile",
                        "email",
                        "profileImage",
                        "status",
                        "createdAt",
                    ],
                },
            ],

            offset: (page - 1) * limit,

            limit,

            distinct: true,

            order: [["createdAt", "DESC"]],
        });

        return {
            providers: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }
    async getProviderById(id: string) {
        console.log("Provider ID:", id);
        return Provider.findOne({
            where: {
                id,
            },

            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "mobile",
                        "email",
                        "countryCode",
                        "profileImage",
                        "gender",
                        "dob",
                        "status",
                        "role",
                        "createdAt",
                    ],
                },

                {
                    model: ProviderLocation,
                    as: "locations",
                },

                {
                    model: ProviderService,
                    as: "providerServices",
                },

                {
                    model: ProviderDocument,
                    as: "documents",
                },

                {
                    model: ProviderBankAccount,
                    as: "bankAccount",
                },

                {
                    model: ProviderWorkingHour,
                    as: "workingHours",
                },
            ],
        });
    }

    async updateStatus(id: string, status: string) {
        const [updated] = await Provider.update(
            { status },
            {
                where: {
                    id,
                },
            }
        );

        return updated;
    }


    async updateUserStatus(userId: string, status: string) {

        const [updated] = await User.update(
            { status },
            {
                where: {
                    id: userId,
                },
            }
        );

        return updated;
    }


    async updateKycStatus(id: string) {

        const [updated] = await Provider.update(
            {
                isVerified: true,
            },
            {
                where: {
                    id,
                },
            }
        );

        return updated;
    }



    async updateCommission(
        id: string,
        commission: number
    ) {
        const [updated] = await User.update(
            { commission },
            {
                where: {
                    id,
                    role: UserRole.PROVIDER,
                },
            }
        );

        return updated;
    }

}

export default new ProviderRepository();