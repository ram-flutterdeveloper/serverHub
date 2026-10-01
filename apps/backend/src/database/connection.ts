

import sequelize from "./sequelize";
import "./register-models";
import { initializeModels } from "./init-models";

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    initializeModels();
    console.log("✅ Database Connected");

    // await sequelize.sync({
    //   // force: true,
    //   alter: false,
    //   force: false,
    // });
    await sequelize.sync();

    console.log("✅ Database Synced");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};