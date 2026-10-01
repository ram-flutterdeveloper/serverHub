import {
  Message,
  Notification,
} from "firebase-admin/messaging";

import { messaging } from "../config/firebase";
import deviceTokenRepository from "../repositories/device-token.repository";

class PushNotificationService {

  /*
  |--------------------------------------------------------------------------
  | Build Notification Payload
  |--------------------------------------------------------------------------
  */

  private buildPayload(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
    image?: string
  ): Message {

    const notification: Notification = {
      title,
      body,
      imageUrl: image,
    };

    return {
      token,
      notification,
      data,
      android: {
        priority: "high",
        notification: {
          channelId: "servicehub",
          sound: "default",
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Send Notification To Single Device
  |--------------------------------------------------------------------------
  */

  async sendToDevice(params: {
    token: string;
    title: string;
    body: string;
    image?: string;
    data?: Record<string, string>;
  }) {

    try {

      const message = this.buildPayload(
        params.token,
        params.title,
        params.body,
        params.data,
        params.image
      );

      const response =
        await messaging.send(message);

      return {
        success: true,
        messageId: response,
      };

    } catch (error: any) {

      console.error(
        "Push Notification Error",
        error
      );

      return {
        success: false,
        error: error.message,
      };

    }

  }

  /*
|--------------------------------------------------------------------------
| Send Notification To User
|--------------------------------------------------------------------------
*/

async sendToUser(params: {
    userId: string;
    title: string;
    body: string;
    image?: string;
    data?: Record<string, string>;
}) {

    try {

        const tokens =
            await deviceTokenRepository.getUserTokens(
                params.userId
            );

        if (!tokens.length) {

            return {
                success: false,
                message: "No active devices found",
            };

        }

        const results = [];

        for (const device of tokens) {

            const result =
                await this.sendToDevice({

                    token: device.token,

                    title: params.title,

                    body: params.body,

                    image: params.image,

                    data: params.data,

                });

            /*
            |--------------------------------------------------------------------------
            | Invalid Token
            |--------------------------------------------------------------------------
            */

            if (
                !result.success &&
                result.error?.includes(
                    "registration-token-not-registered"
                )
            ) {

                await deviceTokenRepository.update(
                    device.id,
                    {
                        isActive: false,
                    }
                );

            }

            results.push(result);

        }

        return {

            success: true,

            totalDevices: tokens.length,

            results,

        };

    } catch (error: any) {

        console.error(error);

        return {

            success: false,

            message: error.message,

        };

    }

}

}

export default new PushNotificationService();