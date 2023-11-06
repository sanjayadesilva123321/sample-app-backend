import {SEQUELIZE} from "../constant/index";
import {Sequelize} from "sequelize-typescript";
import {ConfigService} from "@nestjs/config";
import {User} from "../models/user";
import {UserRole} from "../models/user-role";

/**
 * OLTP db configuration
 */
export const DatabaseProvider = [
    {
        provide: SEQUELIZE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize(
                configService.get<string>("DATABASE_NAME"),
                configService.get<string>("DATABASE_USERNAME"),
                configService.get<string>("DATABASE_PASSWORD"),
                {
                    dialect: "mssql",
                    host: configService.get<string>("DATABASE_HOST"),
                    port: configService.get<number>("DATABASE_PORT"),
                    logging: false,
                    pool: {
                        max: 100,
                        min: 0,
                        acquire: 30000,
                        idle: 10000,
                    },
                }
            );
            sequelize.addModels([
                User,
                UserRole
            ]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
