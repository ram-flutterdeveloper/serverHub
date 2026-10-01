import { readFileSync } from "fs";
import path from "path";

import {
  initializeApp,
  cert,
  getApps,
} from "firebase-admin/app";

import { getMessaging } from "firebase-admin/messaging";

const serviceAccountPath = path.join(
  process.cwd(),
"firebase-service-account.json"
);

const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, "utf8")
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });

  console.log("🔥 Firebase Initialized");
}

export const messaging = getMessaging();