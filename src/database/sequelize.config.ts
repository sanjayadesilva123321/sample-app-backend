import { SequelizeModuleOptions } from '@nestjs/sequelize';

const config: SequelizeModuleOptions = {
  dialect: 'mssql',
  host: 'your_host',
  port: 1433,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database_name',
  define: {
    timestamps: false, // If you don't want timestamps in your tables
  },
};

export default config;