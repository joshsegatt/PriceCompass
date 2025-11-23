import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateSavingsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  targetAmount: number;

  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}
