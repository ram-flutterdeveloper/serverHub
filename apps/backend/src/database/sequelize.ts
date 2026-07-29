import { Sequelize } from "sequelize";
import { databaseConfig } from "../config";

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: "postgres",
    logging: false,
    timezone: "+05:30",
  }
);

export default sequelize;