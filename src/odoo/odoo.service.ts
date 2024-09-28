import { Injectable } from '@nestjs/common';
import * as xmlrpc from 'xmlrpc';

@Injectable()
export class OdooService {
  private client: any;
    private db: string = 'odoo16' // Nombre de la BD
    private username: string = 'brenovales1@gmail.com' // nombre de usuario de odoo
    private password: string = 'f006dfb53290db1b5ec596a28a3cb0b2980c31ea' // reemplazar con el api key generado.

    private modelsClient = xmlrpc.createClient( { 
      host: '127.0.0.1',
      port: 8069,
      path: '/xmlrpc/2/object',
  } );

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

                /* const modelsClient = xmlrpc.createClient( { 
                    host: '127.0.0.1',
                    port: 8069,
                    path: '/xmlrpc/2/object',
                } ); */

               this.modelsClient.methodCall( 'execute_kw', [
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

    async createProduct() : Promise<any> {
      const productData =  {'name': 'Prueba', 'list_price': 20, 'qty_available': 10} ;
      return new Promise( ( resolve, reject ) => {
        this.client.methodCall( 'authenticate', [this.db, this.username, this.password, {} ], ( err, uid ) => {
            if ( err ) {
                return reject ( err );
            }

            

            this.modelsClient.methodCall( 'execute_kw', [
                this.db,
                uid,
                this.password,
                'product.product',
                'create',
                [[productData]],
            ], ( err, products ) => {
                if ( err ) return reject( err );
                
                resolve ( products );
            } );

        } );
    } );
      /* try {
        
        /* const result = await this.client.methodCall(
          'product.product',
          'create',
          [productData],
        );
        return result; 
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw error;
    } */
    }

}
