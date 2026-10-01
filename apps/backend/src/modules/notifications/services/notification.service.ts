
import notificationRepository from "../repositories/notification.repository";
import pushNotificationService from "./push-notification.service";

interface SendNotificationDto {
  userId: string;
  title: string;
  body: string;
  type: string;
  referenceId?: string;
  image?: string;
  data?: Record<string, string>;
}

class NotificationService {
  /*
  |--------------------------------------------------------------------------
  | Send Notification
  |--------------------------------------------------------------------------
  */

  async send(dto: SendNotificationDto) {
    /*
    |--------------------------------------------------------------------------
    | Save Notification History
    |--------------------------------------------------------------------------
    */

    const notification = await notificationRepository.create({
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
      type: dto.type,
      referenceId: dto.referenceId,
    });

    /*
    |--------------------------------------------------------------------------
    | Send Push Notification
    |--------------------------------------------------------------------------
    */

    await pushNotificationService.sendToUser({
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
      image: dto.image,
      data: {
        notificationId: notification.id,
        type: dto.type,
        referenceId: dto.referenceId ?? "",
        ...dto.data,
      },
    });

    return notification;
  }
}

export default new NotificationService();