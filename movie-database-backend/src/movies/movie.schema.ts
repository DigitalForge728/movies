import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsInt, Min, Max } from 'class-validator';

@Schema()
export class Movie extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({
    required: true,
    validate: {
      validator: (year: number) => year >= 1000 && year <= 9999,
      message: 'Year must be a four-digit number between 1000 and 9999',
    },
  })
  year: number;

  @Prop()
  poster: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
