import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';
import { UUID } from 'crypto';
import { IsInt, IsOptional, IsPositive, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {

    @IsString()
    @IsUUID()
    @IsOptional()
    id: UUID

    @IsInt()
    @IsPositive()
    @Min(1)
    @IsOptional()
    no: number;

    @IsString()
    @IsOptional()
    @MinLength(1)
    name: string;
}
