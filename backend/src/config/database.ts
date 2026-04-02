import { DataSource } from "typeorm";
import { config } from "./env";
import path from "path";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: false, // NEVER use true in production
  logging: config.nodeEnv === "development",
  entities: [path.join(__dirname, "../entities/**/*.entity{.ts,.js}")],
  migrations: [path.join(__dirname, "../migrations/**/*{.ts,.js}")],
  subscribers: [],
  poolSize: config.db.poolSize,
  charset: "utf8mb4",
  timezone: "+07:00",
});
