import { Router } from "express";

import userController from "../controllers/user.controller";
import { authMiddleware } from "../../../../middlewares/auth.middleware";
import { adminMiddleware } from "../../../../middlewares/adminAuth.middleware";
import updateUserStatusValidator from "../validators/update-user-status.validator";
import verifyUserValidator from "../validators/verify-user.validator";
import getUsersValidator from "../validators/get-users.validator";



const router = Router();

/**
 * Dashboard
 */
router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    userController.dashboard
);

/**
 * User List
 */
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getUsersValidator,
    userController.getAll
);

/**
 * User Details
 */
router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    userController.getById
);

/**
 * Block User
 */
router.patch(
    "/:id/block",
    authMiddleware,
    adminMiddleware,
    updateUserStatusValidator,
    userController.block
);

/**
 * Unblock User
 */
router.patch(
    "/:id/unblock",
    authMiddleware,
    adminMiddleware,
    updateUserStatusValidator,
    userController.unblock
);

/**
 * Verify User
 */
router.patch(
    "/:id/verify",
    authMiddleware,
    adminMiddleware,
    verifyUserValidator,
    userController.verify
);

/**
 * Soft Delete User
 */
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    userController.delete
);

export default router;