
// import app from "./app";
// import { appConfig } from "./config";
// import { connectDatabase } from "./database";
// import "./database/associations";
// import superAdminSeeder from "./database/seeders/super-admin.seed";
// import "./modules/notifications";
// import { startJobs } from "./jobs";

// import {
//   initializeSocket,
// } from "./socket";

// const startServer = async () => {

//   await connectDatabase();
//   startJobs();
//   await superAdminSeeder.run();
//   app.listen(appConfig.port, () => {
//     console.log(`🚀 ${appConfig.appName} running on port ${appConfig.port}`);
//   });
// };

// startServer();

import http from "http";

import app from "./app";
import { appConfig } from "./config";
import { connectDatabase } from "./database";
import "./database/associations";
import superAdminSeeder from "./database/seeders/super-admin.seed";
import "./modules/notifications";
import { startJobs } from "./jobs";

import {
  initializeSocket,
} from "./socket";

const startServer = async () => {
  await connectDatabase();
  startJobs();
  await superAdminSeeder.run();
  const server = http.createServer(app);
  initializeSocket(server);
  server.listen(
    appConfig.port,
    () => {

      console.log(
        `🚀 ${appConfig.appName} running on port ${appConfig.port}`
      );
      console.log(
        `🔌 Socket.IO running on port ${appConfig.port}`
      );

    }
  );
};

startServer();