import { Injectable } from '@nestjs/common';
import * as xmlrpc from 'xmlrpc';

@Injectable()
export class OdooService {
  private client: any;
    private db: string = 'odoo16' // Nombre de la BD
    private username: string = 'brenovales1@gmail.com' // nombre de usuario de odoo
    private password: string = 'f006dfb53290db1b5ec596a28a3cb0b2980c31ea' // reemplazar con el api key generado.

    constructor() {
        this.client = xmlrpc.createClient( { host: '127.0.0.1', // reemplazar con la direccion de tu servidor Odoo
            port: 8069, //Puerto por defecto de odoo.
            path: '/xmlrpc/2/common',
        } );
    }

    async getProducts() {
        return new Promise( ( resolve, reject ) => {
            this.client.methodCall( 'authenticate', [this.db, this.username, this.password, {} ], ( err, uid ) => {
                if ( err ) {
                    return reject ( err );
                }

                const modelsClient = xmlrpc.createClient( { 
                    host: '127.0.0.1',
                    port: 8069,
                    path: '/xmlrpc/2/object',
                } );

                modelsClient.methodCall( 'execute_kw', [
                    this.db,
                    uid,
                    this.password,
                    'product.product',
                    'search_read',
                    [[]],
                    { fields: [ 'id', 'name' , 'list_price', 'qty_available' ] },
                ], ( err, products ) => {
                    if ( err ) return reject( err );
                    
                    resolve ( products );
                } );

            } );
        } );
    }

}
