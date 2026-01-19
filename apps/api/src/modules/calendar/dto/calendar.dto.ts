import { IsString, IsNotEmpty, IsISO8601, IsOptional } from 'class-validator';

export class ConnectCalendarDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsISO8601()
  expiry: string;
}
