import { Router } from "express";

import providerBankAccountController from "../controllers/provider-bank-account.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { providerBankAccountValidator } from "../validators/provider-bank-account.validator";

const router = Router();

router.post(
    "/",
    authMiddleware,
    providerBankAccountValidator,
    providerBankAccountController.save
);

router.get(
    "/",
    authMiddleware,
    providerBankAccountController.getMyBankAccount
);

router.put(
    "/",
    authMiddleware,
    providerBankAccountValidator,
    providerBankAccountController.save
);

router.delete(
    "/",
    authMiddleware,
    providerBankAccountController.delete
);
router.put(
    "/",
    authMiddleware,
    providerBankAccountValidator,
    providerBankAccountController.update
);

export default router;