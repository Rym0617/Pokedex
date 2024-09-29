import { HttpService } from '@nestjs/axios';
import { Injectable, Get } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonController } from 'src/pokemon/pokemon.controller';
@Injectable()
export class SeedService {
    
    private readonly axios: AxiosInstance = axios;

    async executeSeed() {

        const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

        data.results.forEach( ( { name, url } ) => {

            const segments = url.split('/');
            const no: number = +segments[ segments.length -2 ];

           
           
            console.log( { name, no } )

        })
        return data.results;
 }
}