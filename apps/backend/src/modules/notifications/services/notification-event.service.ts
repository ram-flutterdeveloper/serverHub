import { NotificationType } from "../../../constants/notification-type";
import notificationService from "./notification.service";


class NotificationEventService {

  /*
  |--------------------------------------------------------------------------
  | Booking Assigned
  |--------------------------------------------------------------------------
  |
  | When admin assigns a provider:
  |
  | 1. Provider gets notification
  | 2. Customer gets notification
  |
  |--------------------------------------------------------------------------
  */

  async bookingAssigned(params: {
    providerUserId: string;
    customerUserId: string;
    bookingId: string;
    bookingNumber: string;
  }) {

    /*
    |--------------------------------------------------------------------------
    | 1. Provider Notification
    |--------------------------------------------------------------------------
    */

    await notificationService.send({

      userId: params.providerUserId,

      title: "New Service Assigned",

      body:
        `Booking ${params.bookingNumber} has been assigned to you.`,

      type: NotificationType.BOOKING_ASSIGNED,

      referenceId: params.bookingId,

      data: {
        screen: "PROVIDER_BOOKING_DETAILS",
        bookingId: params.bookingId,
      },

    });


    /*
    |--------------------------------------------------------------------------
    | 2. Customer Notification
    |--------------------------------------------------------------------------
    */

    await notificationService.send({

      userId: params.customerUserId,

      title: "Provider Assigned",

      body:
        "A service provider has been assigned to your booking.",

      type: NotificationType.BOOKING_ASSIGNED,

      referenceId: params.bookingId,

      data: {
        screen: "BOOKING_DETAILS",
        bookingId: params.bookingId,
      },

    });

  }


  /*
|--------------------------------------------------------------------------
| Booking Accepted
|--------------------------------------------------------------------------
|
| Provider accepts assigned booking.
|
| Send notification to:
|
| 1. Admin
| 2. Customer
|
|--------------------------------------------------------------------------
*/

  async bookingAccepted(params: {
    adminUserId: string;
    customerUserId: string;
    bookingId: string;
    bookingNumber: string;
  }) {

    /*
    |--------------------------------------------------------------------------
    | 1. Admin Notification
    |--------------------------------------------------------------------------
    */

    await notificationService.send({

      userId: params.adminUserId,

      title: "Service Confirmed",

      body:
        `Provider has accepted booking ${params.bookingNumber}.`,

      type: NotificationType.BOOKING_ACCEPTED,

      referenceId: params.bookingId,

      data: {
        screen: "ADMIN_BOOKING_DETAILS",
        bookingId: params.bookingId,
      },

    });


    /*
    |--------------------------------------------------------------------------
    | 2. Customer Notification
    |--------------------------------------------------------------------------
    */

    await notificationService.send({

      userId: params.customerUserId,

      title: "Service Confirmed",

      body:
        "Your service has been confirmed by the provider.",

      type: NotificationType.BOOKING_ACCEPTED,

      referenceId: params.bookingId,

      data: {
        screen: "BOOKING_DETAILS",
        bookingId: params.bookingId,
      },

    });

  }


  async providerOnTheWay(params: {
    adminUserId: string;
    customerUserId: string;
    bookingId: string;
    bookingNumber: string;
  }) {

    /*
    |--------------------------------------------------------------------------
    | 1. Admin Notification
    |--------------------------------------------------------------------------
    */

    await notificationService.send({

      userId: params.adminUserId,

      title: "Provider On The Way",

      body:
        `Provider has started travelling for booking ${params.bookingNumber}.`,

      type: NotificationType.PROVIDER_ON_THE_WAY,

      referenceId: params.bookingId,

      data: {
        screen: "ADMIN_BOOKING_DETAILS",
        bookingId: params.bookingId,
      },

    });


    /*
    |--------------------------------------------------------------------------
    | 2. Customer Notification
    |--------------------------------------------------------------------------
    */

    await notificationService.send({

      userId: params.customerUserId,

      title: "Provider On The Way",

      body:
        "Your provider is on the way to your location.",

      type: NotificationType.PROVIDER_ON_THE_WAY,

      referenceId: params.bookingId,

      data: {
        screen: "BOOKING_TRACKING",
        bookingId: params.bookingId,
      },

    });

  }

  /*
|--------------------------------------------------------------------------
| Provider Arrived
|--------------------------------------------------------------------------
|
| Provider reached customer location and OTP was verified.
|
| Notification:
|
| Customer only
|
|--------------------------------------------------------------------------
*/

  async providerArrived(params: {
    customerUserId: string;
    bookingId: string;
    bookingNumber: string;
  }) {

    await notificationService.send({

      userId: params.customerUserId,

      title: "Provider Arrived",

      body:
        `Your provider has arrived for booking ${params.bookingNumber}.`,

      type: NotificationType.PROVIDER_ARRIVED,

      referenceId: params.bookingId,

      data: {
        screen: "BOOKING_DETAILS",
        bookingId: params.bookingId,
      },

    });

  }

  /*
  |--------------------------------------------------------------------------
  | Service Completed
  |--------------------------------------------------------------------------
  |
  | Provider has completed the service and submitted
  | completion media.
  |
  | Notification:
  |
  | 1. Admin
  | 2. Customer
  |
  |--------------------------------------------------------------------------
  */

  async serviceCompleted(params: {
    adminUserId: string;
    customerUserId: string;
    bookingId: string;
    bookingNumber: string;
  }) {

    /*
    |--------------------------------------------------------------------------
    | Admin
    |--------------------------------------------------------------------------
    */

    await notificationService.send({

      userId: params.adminUserId,

      title: "Service Completed",

      body:
        `Provider has completed booking ${params.bookingNumber}.`,

      type: NotificationType.JOB_COMPLETED,

      referenceId: params.bookingId,

      data: {
        screen: "ADMIN_BOOKING_DETAILS",
        bookingId: params.bookingId,
      },

    });


    /*
    |--------------------------------------------------------------------------
    | Customer
    |--------------------------------------------------------------------------
    */

    await notificationService.send({

      userId: params.customerUserId,

      title: "Service Completed",

      body:
        "Your service has been completed successfully.",

      type: NotificationType.JOB_COMPLETED,

      referenceId: params.bookingId,

      data: {
        screen: "BOOKING_DETAILS",
        bookingId: params.bookingId,
      },

    });

  }

  async bookingCancelled(params:
    {
      adminUserId: string;
      bookingId: string;
      bookingNumber: string;
    }) {
    await notificationService.send({
      userId: params.adminUserId,

      title: "Booking Cancelled",

      body: `Booking ${params.bookingNumber} has been cancelled by the customer.`,

      type: NotificationType.BOOKING_CANCELLED,

      referenceId: params.bookingId,

      data: {
        screen: "ADMIN_BOOKING_DETAILS",
        bookingId: params.bookingId,
      },
    });
  }

}

export default new NotificationEventService();