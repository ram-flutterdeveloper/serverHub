import { Request, Response } from "express";

import { asyncHandler } from "../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../helpers/api-response";

import notificationRepository from "../repositories/notification.repository";
import notificationService from "../services/notification.service";
import { AuthRequest } from "../../../middlewares/auth.middleware";

class NotificationController {

    /*
    |--------------------------------------------------------------------------
    | Notification List
    |--------------------------------------------------------------------------
    */

    getNotifications = asyncHandler(
        async (req: AuthRequest, res: Response) => {

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;

            const notifications =
                await notificationRepository.getUserNotifications(
                    req.user!.userId,
                    page,
                    limit
                );

            return ApiResponseHelper.success(
                res,
                notifications,
                "Notifications fetched successfully"
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Unread Count
    |--------------------------------------------------------------------------
    */

    unreadCount = asyncHandler(
        async (req: AuthRequest, res: Response) => {

            const count =
                await notificationRepository.getUnreadCount(
                    req.user!.userId
                );

            return ApiResponseHelper.success(
                res,
                {
                    unreadCount: count,
                },
                "Unread notification count fetched successfully"
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Mark Single Notification As Read
    |--------------------------------------------------------------------------
    */

    markAsRead = asyncHandler(
        async (req: Request, res: Response) => {

            const notification =
                await notificationRepository.markAsRead(
                    req.params.id as string
                );

            return ApiResponseHelper.success(
                res,
                notification,
                "Notification marked as read"
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Mark All Notifications As Read
    |--------------------------------------------------------------------------
    */

    markAllAsRead = asyncHandler(
        async (req: AuthRequest, res: Response) => {

            await notificationRepository.markAllAsRead(
                req.user!.userId
            );

            return ApiResponseHelper.success(
                res,
                null,
                "All notifications marked as read"
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Delete Notification
    |--------------------------------------------------------------------------
    */

    delete = asyncHandler(
        async (req: Request, res: Response) => {

            await notificationRepository.delete(
                req.params.id as string
            );

            return ApiResponseHelper.success(
                res,
                null,
                "Notification deleted successfully"
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Test Push Notification
    |--------------------------------------------------------------------------
    */

    test = asyncHandler(
        async (req: AuthRequest, res: Response) => {

            const result =
                await notificationService.send({

                    userId: req.user!.userId,

                    title: "ServiceHub",

                    body: "Push notification is working successfully.",

                    type: "TEST_NOTIFICATION",

                    data: {
                        screen: "HOME",
                    },

                });

            return ApiResponseHelper.success(
                res,
                result,
                "Test notification sent successfully"
            );

        }
    );

}

export default new NotificationController();