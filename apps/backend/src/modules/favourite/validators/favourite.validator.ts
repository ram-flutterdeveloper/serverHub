import { param } from "express-validator";
import { validationResult } from "express-validator";

import { Request, Response, NextFunction } from "express";

export const favouritePackageValidator = [
  param("packageId")
    .isUUID()
    .withMessage("Invalid package ID"),

  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    next();
  },
];