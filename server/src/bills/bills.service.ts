import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BillsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    const payload = { ...data } as any;
    if (payload.monthlyCost !== undefined && payload.monthlyCost !== null) {
      // Prisma Decimal fields are safest when provided as strings
      payload.monthlyCost = String(payload.monthlyCost);
    }
    const created = await this.prisma.trackedBill.create({ data: { ...payload, userId } });
    return created;
  }

  async findById(id: string) {
    return this.prisma.trackedBill.findUnique({ where: { id } });
  }

  async update(userId: string, id: string, data: any) {
    const bill = await this.findById(id);
    if (!bill) throw new NotFoundException('Bill not found');
    if (bill.userId !== userId) throw new ForbiddenException('Not allowed');
    const payload = { ...data } as any;
    if (payload.monthlyCost !== undefined && payload.monthlyCost !== null) {
      payload.monthlyCost = String(payload.monthlyCost);
    }
    return this.prisma.trackedBill.update({ where: { id }, data: payload });
  }

  async remove(userId: string, id: string) {
    const bill = await this.findById(id);
    if (!bill) throw new NotFoundException('Bill not found');
    if (bill.userId !== userId) throw new ForbiddenException('Not allowed');
    await this.prisma.trackedBill.delete({ where: { id } });
    return;
  }
}
