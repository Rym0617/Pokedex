import { BadRequestException, Get, HttpCode, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { ConfigService } from '@nestjs/config'
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  private defaultLimt: number

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,
  ) {

    this.defaultLimt = configService.get<number>('default_limit');
  }

  @Post()
  @HttpCode( HttpStatus.OK )
  async create(createPokemonDto: CreatePokemonDto) {    
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) {
      this.handleExceptions( error );  
  }
  }


 async findAll( paginationDto: PaginationDto) {

  const { limit = this.defaultLimt, offset = 0 } = paginationDto;
    return await this.pokemonModel.find()
    .limit( limit )
    .skip( offset )
    .sort({
      no: 1
    })
    .select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    //Si term es un numero
    if( !isNaN( +term ) ) {
      pokemon = await this.pokemonModel.findOne( {no: term} );
    }

    // MongoID
    if( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term );
    }
    
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne( { name: term.toLowerCase() } );
    }

    // Name
    if( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term } not found!`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
try {

  const pokemon = await this.findOne( term );

    if( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

   await pokemon.updateOne( updatePokemonDto );
    
    return { ...pokemon.toJSON(), ...updatePokemonDto };
 
} catch (error) {
  this.handleExceptions( error );
}
    
}

  async remove(id: string) {

    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});    

    if ( deletedCount === 0 ) {
      throw new BadRequestException(`Pokemon with id: ${ id } not found!`)
    }
    return;
  }
  

  private handleExceptions( error: any ) {
    if( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue )}`);
    }
    console.log( error );
  
    if( error ) {
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs.`);
    }
  }
}
