// database.module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import config from './sequelize.config';

@Module({
  imports: [
    SequelizeModule.forRoot(config),
    SequelizeModule.forFeature([]),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
