import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsString()
    @IsOptional()
    poster?: string;
}

export class UpdateMovieDto extends CreateMovieDto {}
