import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [SavingsService, PrismaService],
  controllers: [SavingsController],
})
export class SavingsModule {}
