import { Router } from "express";
import { authMiddleware } from "../../../../middlewares/auth.middleware";
import acceptBookingController from "../controllers/accept-booking.controller";
import {
  bookingMediaUpload
} from "../../../../middlewares/upload.middleware";
const router = Router();

router.patch(

    "/:bookingId/accept",

    authMiddleware,
    acceptBookingController.accept

);
router.patch(
    "/:bookingId/reject",
    authMiddleware,
    acceptBookingController.reject
);


router.get(
    "/assigned",
    authMiddleware,
    acceptBookingController.getAssigned
);

router.get(
    "/current",
    authMiddleware,
    acceptBookingController.getCurrent
);

router.get(
    "/history",
    authMiddleware,
    acceptBookingController.getHistory
);

router.patch(
    "/:bookingId/start",
    authMiddleware,
    acceptBookingController.start
);

router.patch(
    "/:bookingId/arrived",
    authMiddleware,
    acceptBookingController.arrive
);

router.patch(
    "/:bookingId/complete",
    authMiddleware,
    bookingMediaUpload.array("media", 5),
    acceptBookingController.complete
);
// router.get(
//     "/:bookingId",
//     authMiddleware,
//     acceptBookingController.getDetails
// );
export default router;