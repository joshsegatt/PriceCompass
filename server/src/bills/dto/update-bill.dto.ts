import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateBillDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  monthlyCost?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  source?: string;
}
