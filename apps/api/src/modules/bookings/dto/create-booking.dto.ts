import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsISO8601()
  startUtc: string;

  @IsISO8601()
  endUtc: string;
}
