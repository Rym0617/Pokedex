import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { OdooModule } from './odoo/odoo.module';
import { EnvConfiguration } from './config/app.config';
@Module({
  imports: [

    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),

    MongooseModule.forRoot( process.env.MONGODB ),
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
export class AppModule {

  constructor(){}
}
