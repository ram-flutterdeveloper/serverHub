import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/error.middleware.js";
import { setupSwagger } from "./config/swagger.js";
import authModule from "./modules/auth";
import profileModule from "./modules/profile";
import discoveryModule from "./modules/discovery";
import providerModule from "./modules/provider";
import catalogModule from "./modules/master-data";
import masterDataModule from "./modules/master-data";

import adminRoutes from "./modules/admin";
import bookingModule from "./modules/booking";
import providerBookingRoutes from "./modules/provider/bookings";
import notificationRoutes from "./modules/notifications";
import path from "path";
import reviewRoutes from "./modules/reviews/routes/review.routes.js";
import adminReviewRoutes from "./modules/reviews/routes/admin-review.routes.js";
import providerReviewRoutes from "./modules/reviews/routes/provider-review.routes.js";
import favouriteRoutes from "./modules/favourite/routes/favourite.routes.js";
import supportRoutes
  from "./modules/support/routes/support.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Uploaded Files
// --------------------------------------------------

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

app.use("/api/v1", authModule);
app.use("/api/v1", profileModule);
app.use("/api/v1", discoveryModule);
app.use("/api/v1", providerModule);
app.use("/api/v1", catalogModule);
app.use("/api/v1", masterDataModule);
app.use("/api/v1/bookings", bookingModule);
app.use("/api/v1/admin", adminRoutes);
app.use(
  "/api/v1/provider/bookings",
  providerBookingRoutes
);
app.use(
  "/api/v1/notifications",
  notificationRoutes
);
app.use(
  "/api/v1/reviews",
  reviewRoutes
);

app.use(
  "/api/v1/provider",
  providerReviewRoutes
);

app.use(
  "/api/v1/admin",
  adminReviewRoutes
);

app.use(
  "/api/v1/favourites",
  favouriteRoutes
);
app.use(
  "/api/v1/support",
  supportRoutes
);


// Health Check Route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "🚀 ServiceHub API Running",
  });
});



// Error Handler (Always Last)
app.use(errorHandler);

setupSwagger(app);
export default app;