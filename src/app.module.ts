import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { Sequelize } from 'sequelize';
import { SequelizeMethod } from 'sequelize/types/utils';
import { SequelizeModule } from '@nestjs/sequelize';
import { OdooModule } from './odoo/odoo.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),

    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest-pokemon'),
   /* SequelizeModule.forRoot({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'openpg',
    password: 'openpgpwd',
    database: 'odoo16'
   }),
 */
    PokemonModule,

    CommonModule,

    SeedModule,

    OdooModule,
  ]
})
export class AppModule {}
