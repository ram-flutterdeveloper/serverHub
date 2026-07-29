import { Router } from "express";

import providerDocumentController from "../controllers/provider-document.controller";

import { authMiddleware } from "../../../middlewares/auth.middleware";

import { providerDocumentValidator } from "../validators/provider-document.validator";

import { uploadProviderDocuments } from "../../../middlewares/upload.middleware";

const router = Router();

router.post(
    "/",
    authMiddleware,
    uploadProviderDocuments.fields([
        {
            name: "frontImage",
            maxCount: 1,
        },
        {
            name: "backImage",
            maxCount: 1,
        },
    ]),
    providerDocumentValidator,
    providerDocumentController.upload
);

router.get(
    "/",
    authMiddleware,
    providerDocumentController.getMyDocuments
);

router.delete(
    "/:id",
    authMiddleware,
    providerDocumentController.delete
);

export default router;