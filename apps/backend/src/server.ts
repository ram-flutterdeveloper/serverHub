
import app from "./app";
import { appConfig } from "./config";
import { connectDatabase } from "./database";
import superAdminSeeder from "./database/seeders/super-admin.seed";
const startServer = async () => {
  
  await connectDatabase();
  await superAdminSeeder.run();
  app.listen(appConfig.port, () => {
    console.log(`🚀 ${appConfig.appName} running on port ${appConfig.port}`);
  });
};

startServer();