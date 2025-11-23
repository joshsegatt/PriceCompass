import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [BillsService, PrismaService],
  controllers: [BillsController],
})
export class BillsModule {}
