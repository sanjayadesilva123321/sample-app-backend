import {SEQUELIZE} from "../constant/index";
import {Sequelize} from "sequelize-typescript";
import {ConfigService} from "@nestjs/config";
import {User} from "../models/user";

/**
 * OLTP db configuration
 */
export const DatabaseProvider = [
    {
        provide: SEQUELIZE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize(
                "testdb",
                "SA",
                "Ushika@123",
                {
                    dialect: "mssql",
                    host: "localhost",
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
            ]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
