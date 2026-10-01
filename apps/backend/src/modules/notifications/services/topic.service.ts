import { messaging } from "../config/firebase";

interface SendTopicNotificationDto {
  topic: string;
  title: string;
  body: string;
  image?: string;
  data?: Record<string, string>;
}

class TopicService {
  /*
  |--------------------------------------------------------------------------
  | Subscribe Tokens To Topic
  |--------------------------------------------------------------------------
  */

  async subscribe(
    topic: string,
    tokens: string[]
  ) {
    try {
      const response =
        await messaging.subscribeToTopic(
          tokens,
          topic
        );

      return {
        success: true,
        topic,
        successCount: response.successCount,
        failureCount: response.failureCount,
        errors: response.errors,
      };
    } catch (error: any) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Unsubscribe Tokens From Topic
  |--------------------------------------------------------------------------
  */

  async unsubscribe(
    topic: string,
    tokens: string[]
  ) {
    try {
      const response =
        await messaging.unsubscribeFromTopic(
          tokens,
          topic
        );

      return {
        success: true,
        topic,
        successCount: response.successCount,
        failureCount: response.failureCount,
        errors: response.errors,
      };
    } catch (error: any) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Send Notification To Topic
  |--------------------------------------------------------------------------
  */

  async send(params: SendTopicNotificationDto) {
    try {
      const response =
        await messaging.send({

          topic: params.topic,

          notification: {
            title: params.title,
            body: params.body,
            imageUrl: params.image,
          },

          data: params.data,

          android: {
            priority: "high",
            notification: {
              channelId: "servicehub",
              sound: "default",
              clickAction:
                "FLUTTER_NOTIFICATION_CLICK",
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
        });

      return {
        success: true,
        messageId: response,
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

export default new TopicService();