
import { Notification } from "../models";
class NotificationRepository {

    /*
    |--------------------------------------------------------------------------
    | Create Notification
    |--------------------------------------------------------------------------
    */

    async create(data: Partial<Notification>) {
        return Notification.create(data as any);
    }

    /*
    |--------------------------------------------------------------------------
    | Notification List
    |--------------------------------------------------------------------------
    */

    async getUserNotifications(
        userId: string,
        page: number = 1,
        limit: number = 20
    ) {

        const offset = (page - 1) * limit;

        const { rows, count } =
            await Notification.findAndCountAll({

                where: {
                    userId,
                },

                order: [
                    ["createdAt", "DESC"],
                ],

                offset,

                limit,
            });

        return {

            notifications: rows,

            total: count,

            page,

            limit,

            totalPages: Math.ceil(
                count / limit
            ),

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Get Notification By Id
    |--------------------------------------------------------------------------
    */

    async findById(id: string) {

        return Notification.findByPk(id);

    }

    /*
    |--------------------------------------------------------------------------
    | Mark As Read
    |--------------------------------------------------------------------------
    */

    async markAsRead(id: string) {

        await Notification.update(

            {
                isRead: true,
                readAt: new Date(),
            },

            {
                where: {
                    id,
                },
            }

        );

        return this.findById(id);

    }

    /*
    |--------------------------------------------------------------------------
    | Mark All As Read
    |--------------------------------------------------------------------------
    */

    async markAllAsRead(userId: string) {

        return Notification.update(

            {
                isRead: true,
                readAt: new Date(),
            },

            {
                where: {
                    userId,
                    isRead: false,
                },
            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Unread Count
    |--------------------------------------------------------------------------
    */

    async getUnreadCount(userId: string) {

        return Notification.count({

            where: {
                userId,
                isRead: false,
            },

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Delete Notification
    |--------------------------------------------------------------------------
    */

    async delete(id: string) {

        return Notification.destroy({

            where: {
                id,
            },

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Delete All Notifications
    |--------------------------------------------------------------------------
    */

    async deleteAll(userId: string) {

        return Notification.destroy({

            where: {
                userId,
            },

        });

    }

}

export default new NotificationRepository();