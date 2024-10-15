import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { Movie } from './movie.schema';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';

type MovieDocument = HydratedDocument<Movie>;

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async create(movieDto: CreateMovieDto): Promise<MovieDocument> {
    const createdMovie = new this.movieModel(movieDto);
    return createdMovie.save();
  }

  async findAll(
    userId?: string,
    query?: { page?: string; limit?: string },
  ): Promise<{ data: Movie[]; total: number; page: number; limit: number }> {
    const page = parseInt(query?.page || '1', 10);
    const limit = parseInt(query?.limit || '10', 10);

    const filterQuery = userId ? { userId } : {};

    const [data, total] = await Promise.all([
      this.movieModel
        .find(filterQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.movieModel.countDocuments(filterQuery).exec(),
    ]);

    return {
      data: data as Movie[],
      total: total as number,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<MovieDocument> {
    return this.movieModel.findById(id).exec();
  }

  async update(id: string, movieDto: UpdateMovieDto): Promise<MovieDocument> {
    return this.movieModel
      .findByIdAndUpdate(id, movieDto, { new: false, runValidators: true })
      .exec();
  }

  async delete(id: string): Promise<MovieDocument> {
    return this.movieModel.findByIdAndDelete(id).exec();
  }
}
