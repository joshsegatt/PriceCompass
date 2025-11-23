import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateSavingsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  targetAmount?: number;

  @IsOptional()
  @IsNumber()
  currentAmount?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
